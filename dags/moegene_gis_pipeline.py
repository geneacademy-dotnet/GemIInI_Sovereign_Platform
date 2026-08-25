"""
MoeGene GIS Diaspora Spatial Mapping Pipeline
==============================================
Orchestration Engine: Apache Airflow (Cloud Composer)
Composer Environment: my-apache-airflow
GCP Project ID:       SudaGene
Region:               me-central1 (sudan-MENA)
Artifacts Bucket:     gs://my-bucket

Description:
Extracts daily candidate nodes from the GA_MASTER_REGISTRY,
parses Location/University columns, maps geocoded coordinates across
Sudan, Egypt, KSA, and global nodes, and uploads GIS spatial artifacts.
"""

import os
import json
import logging
from datetime import datetime, timedelta

from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.google.cloud.hooks.gcs import GCSHook
from airflow.providers.google.cloud.hooks.bigquery import BigQueryHook

# Environment Variables & Configuration
GCP_PROJECT_ID = os.getenv('GCP_PROJECT_ID', 'SudaGene')
GCS_BUCKET = os.getenv('GCS_ARTIFACTS_BUCKET', 'my-bucket')
DAG_ID = 'MoeGene_GIS_Pipeline'

# Canonical Spatial Centroids (Coordinates)
CENTROIDS = {
    'SUDAN_KHARTOUM': {'lat': 15.5007, 'lng': 32.5599, 'country': 'Sudan', 'region': 'Khartoum State'},
    'SUDAN_PORT_SUDAN': {'lat': 19.6158, 'lng': 37.2164, 'country': 'Sudan', 'region': 'Red Sea'},
    'SUDAN_GEZIRA': {'lat': 14.4012, 'lng': 33.5199, 'country': 'Sudan', 'region': 'Gezira State'},
    'SUDAN_SHENDI': {'lat': 16.6917, 'lng': 33.4344, 'country': 'Sudan', 'region': 'River Nile'},
    'EGYPT_CAIRO': {'lat': 30.0444, 'lng': 31.2357, 'country': 'Egypt', 'region': 'Greater Cairo'},
    'EGYPT_GIZA_DOKKI': {'lat': 30.0382, 'lng': 31.2118, 'country': 'Egypt', 'region': 'Dokki Clinical Hub'},
    'EGYPT_ALEXANDRIA': {'lat': 31.2001, 'lng': 29.9187, 'country': 'Egypt', 'region': 'Alexandria'},
    'KSA_RIYADH': {'lat': 24.7136, 'lng': 46.6753, 'country': 'KSA', 'region': 'Riyadh Central'},
    'KSA_JEDDAH': {'lat': 21.4858, 'lng': 39.1925, 'country': 'KSA', 'region': 'Makkah Province'},
    'GULF_UAE': {'lat': 25.2048, 'lng': 55.2708, 'country': 'UAE', 'region': 'Dubai / Abu Dhabi'},
    'UK_LONDON': {'lat': 51.5074, 'lng': -0.1278, 'country': 'UK', 'region': 'United Kingdom'},
    'GLOBAL_UNKNOWN': {'lat': 15.0000, 'lng': 30.0000, 'country': 'Global', 'region': 'Diaspora'}
}

default_args = {
    'owner': 'SudaGene_GIS_Ops',
    'depends_on_past': False,
    'start_date': datetime(2026, 8, 1),
    'email': ['amjadgorashi32@gmail.com'],
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
}

def extract_and_geocode_registry(**context):
    """
    Extracts raw rows, geocodes locations and universities,
    and produces GeoJSON feature collection for spatial GIS dashboard.
    """
    logging.info("Initiating MoeGene GIS Data Extraction for project: %s", GCP_PROJECT_ID)

    # Sample master data fallback / BigQuery pull
    # In production, query BigQueryHook or Google Sheets API directly:
    # bq_hook = BigQueryHook(gcp_conn_id='google_cloud_default')
    # rows = bq_hook.get_records(f"SELECT * FROM `{GCP_PROJECT_ID}.registry.ga_master_registry`")

    sample_registry = [
        {"gaId": "GA-000", "name": "Dr. Mohamed Gibbril", "univ": "University of Khartoum", "location": "Sudan", "track": "Executive"},
        {"gaId": "GA-001", "name": "Dr. Alaa Mursi Elnour", "univ": "University of Khartoum", "location": "Egypt", "track": "Operations"},
        {"gaId": "GA-011", "name": "Eng. Amjad Gurashi", "univ": "SudaGene GIS Lead", "location": "KSA", "track": "GIS Telemetry"},
        {"gaId": "GA-087", "name": "Dr. Ahmed Eltayeb", "univ": "University of Gezira", "location": "Egypt", "track": "BLS / Dokki"},
        {"gaId": "GA-1001", "name": "Dr. Clinical Candidate", "univ": "Ahfad University", "location": "Egypt", "track": "SMC Track"}
    ]

    features = []
    csv_rows = ["gaId,name,university,location,track,latitude,longitude,region_label"]

    for doc in sample_registry:
        loc_str = doc.get("location", "").lower()
        univ_str = doc.get("univ", "").lower()

        # Spatial Classification Rules
        if "dokki" in loc_str or "sabri" in univ_str:
            coord = CENTROIDS['EGYPT_GIZA_DOKKI']
        elif "egypt" in loc_str or "cairo" in loc_str or "مصر" in loc_str:
            coord = CENTROIDS['EGYPT_CAIRO']
        elif "ksa" in loc_str or "saudi" in loc_str or "سعودية" in loc_str or "riyadh" in loc_str:
            coord = CENTROIDS['KSA_RIYADH']
        elif "gezira" in univ_str or "madani" in loc_str:
            coord = CENTROIDS['SUDAN_GEZIRA']
        elif "port" in loc_str or "بورتسودان" in loc_str:
            coord = CENTROIDS['SUDAN_PORT_SUDAN']
        elif "sudan" in loc_str or "khartoum" in univ_str or "ahfad" in univ_str:
            coord = CENTROIDS['SUDAN_KHARTOUM']
        else:
            coord = CENTROIDS['GLOBAL_UNKNOWN']

        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [coord['lng'], coord['lat']]
            },
            "properties": {
                "gaId": doc["gaId"],
                "name": doc["name"],
                "university": doc["univ"],
                "location": doc["location"],
                "track": doc["track"],
                "country": coord['country'],
                "region": coord['region'],
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        features.append(feature)

        csv_rows.append(f'{doc["gaId"]},{doc["name"]},{doc["univ"]},{doc["location"]},{doc["track"]},{coord["lat"]},{coord["lng"]},{coord["region"]}')

    geojson_collection = {
        "type": "FeatureCollection",
        "metadata": {
            "pipeline": "MoeGene_GIS",
            "project": GCP_PROJECT_ID,
            "generated_at": datetime.utcnow().isoformat(),
            "total_nodes": len(features)
        },
        "features": features
    }

    # Write local scratch files
    scratch_geojson = "/tmp/moegene_diaspora_spatial.json"
    scratch_csv = "/tmp/moegene_diaspora_spatial.csv"

    with open(scratch_geojson, "w", encoding="utf-8") as f:
        json.dump(geojson_collection, f, ensure_ascii=False, indent=2)

    with open(scratch_csv, "w", encoding="utf-8") as f:
        f.write("\n".join(csv_rows))

    context['task_instance'].xcom_push(key='geojson_path', value=scratch_geojson)
    context['task_instance'].xcom_push(key='csv_path', value=scratch_csv)
    logging.info("Extracted and geocoded %d candidate nodes.", len(features))

def upload_gis_artifacts_to_gcs(**context):
    """
    Uploads generated GeoJSON and CSV artifacts to the GCP Cloud Storage bucket.
    """
    ti = context['task_instance']
    geojson_local = ti.xcom_pull(task_ids='extract_and_geocode', key='geojson_path')
    csv_local = ti.xcom_pull(task_ids='extract_and_geocode', key='csv_path')

    gcs_hook = GCSHook(gcp_conn_id='google_cloud_default')

    target_json_path = 'gis/moegene_diaspora_spatial.json'
    target_csv_path = 'gis/moegene_diaspora_spatial.csv'

    logging.info("Uploading %s to gs://%s/%s", geojson_local, GCS_BUCKET, target_json_path)
    if os.path.exists(geojson_local):
        gcs_hook.upload(
            bucket_name=GCS_BUCKET,
            object_name=target_json_path,
            filename=geojson_local,
            mime_type='application/geo+json'
        )

    if os.path.exists(csv_local):
        gcs_hook.upload(
            bucket_name=GCS_BUCKET,
            object_name=target_csv_path,
            filename=csv_local,
            mime_type='text/csv'
        )

    logging.info("MoeGene GIS upload completed successfully!")

with DAG(
    dag_id=DAG_ID,
    default_args=default_args,
    description='MoeGene GIS Diaspora Spatial Mapping & Telemetry Pipeline',
    schedule_interval='@daily',
    catchup=False,
    max_active_runs=1,
    tags=['SudaGene', 'MoeGene', 'GIS', 'CloudComposer']
) as dag:

    t1_extract_geocode = PythonOperator(
        task_id='extract_and_geocode',
        python_callable=extract_and_geocode_registry,
        provide_context=True,
    )

    t2_upload_gcs = PythonOperator(
        task_id='upload_to_gcs',
        python_callable=upload_gis_artifacts_to_gcs,
        provide_context=True,
    )

    t1_extract_geocode >> t2_upload_gcs
