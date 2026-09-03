/**
 * SudaGene Consortium - Independent Telemetry API
 * Features: IndexedDB Offline Caching & Background Sync Queue
 */

const GeneAPI = (function() {
    const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwe3rUYJgtSjcnPaKxJOiPsmA19yglrXyWJtAVq0fy4rPi1zLUIacZaWpC4Yhg0x5Ux/exec";
    const DB_NAME = "SudaGeneDB";
    const STORE_QUEUE = "offline_queue";
    const STORE_CACHE = "api_cache";

    let dbPromise = null;

    function initDB() {
        if (!dbPromise) {
            dbPromise = new Promise((resolve, reject) => {
                const req = indexedDB.open(DB_NAME, 1);
                req.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(STORE_QUEUE)) {
                        db.createObjectStore(STORE_QUEUE, { keyPath: "id", autoIncrement: true });
                    }
                    if (!db.objectStoreNames.contains(STORE_CACHE)) {
                        db.createObjectStore(STORE_CACHE, { keyPath: "url" });
                    }
                };
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            });
        }
        return dbPromise;
    }

    async function saveToCache(url, data) {
        const db = await initDB();
        return new Promise((resolve) => {
            const tx = db.transaction(STORE_CACHE, "readwrite");
            tx.objectStore(STORE_CACHE).put({ url: url, data: data, timestamp: Date.now() });
            tx.oncomplete = () => resolve();
        });
    }

    async function getFromCache(url) {
        const db = await initDB();
        return new Promise((resolve) => {
            const tx = db.transaction(STORE_CACHE, "readonly");
            const req = tx.objectStore(STORE_CACHE).get(url);
            req.onsuccess = () => resolve(req.result ? req.result.data : null);
            req.onerror = () => resolve(null);
        });
    }

    async function queueRequest(payload) {
        const db = await initDB();
        return new Promise((resolve) => {
            const tx = db.transaction(STORE_QUEUE, "readwrite");
            tx.objectStore(STORE_QUEUE).add({ payload: payload, timestamp: Date.now() });
            tx.oncomplete = () => resolve();
        });
    }

    async function flushQueue() {
        if (!navigator.onLine) return;
        const db = await initDB();
        
        return new Promise((resolve) => {
            const tx = db.transaction(STORE_QUEUE, "readonly");
            const store = tx.objectStore(STORE_QUEUE);
            const req = store.getAll();
            
            req.onsuccess = async () => {
                const items = req.result;
                if (!items || items.length === 0) return resolve();
                
                for (const item of items) {
                    try {
                        await fetch(APPS_SCRIPT_URL, {
                            method: "POST",
                            headers: { "Content-Type": "text/plain;charset=utf-8" },
                            body: JSON.stringify(item.payload)
                        });
                        // If successful, delete from queue
                        const delTx = db.transaction(STORE_QUEUE, "readwrite");
                        delTx.objectStore(STORE_QUEUE).delete(item.id);
                    } catch (e) {
                        console.warn("Sync failed for item:", item.id);
                        break; // Stop flushing if connection drops again
                    }
                }
                resolve();
            };
        });
    }

    // Auto-flush queue when returning online
    window.addEventListener("online", flushQueue);

    return {
        // Perform a GET request (with aggressive offline caching)
        async get(action, params = {}) {
            const query = new URLSearchParams({ action, ...params }).toString();
            const url = `${APPS_SCRIPT_URL}?${query}`;

            if (navigator.onLine) {
                try {
                    const res = await fetch(url);
                    const data = await res.json();
                    await saveToCache(url, data);
                    return data;
                } catch (e) {
                    // Fallback to cache on unexpected failure
                    const cached = await getFromCache(url);
                    if (cached) return { ...cached, _isOffline: true };
                    throw e;
                }
            } else {
                const cached = await getFromCache(url);
                if (cached) return { ...cached, _isOffline: true };
                throw new Error("No network connection and no cached data available.");
            }
        },

        // Perform a POST request (queues telemetry automatically if offline)
        async post(action, payload = {}) {
            const fullPayload = { action, ...payload };
            
            if (navigator.onLine) {
                try {
                    const res = await fetch(APPS_SCRIPT_URL, {
                        method: "POST",
                        headers: { "Content-Type": "text/plain;charset=utf-8" },
                        body: JSON.stringify(fullPayload)
                    });
                    
                    // Flush any pending items since we clearly have connectivity
                    setTimeout(flushQueue, 1000); 
                    
                    return await res.json();
                } catch (e) {
                    // If fetch throws despite navigator.onLine (e.g., spotty connection)
                    await queueRequest(fullPayload);
                    return { success: true, _queuedOffline: true, message: "Connection unstable. Request queued for background sync." };
                }
            } else {
                await queueRequest(fullPayload);
                return { success: true, _queuedOffline: true, message: "You are offline. Data saved and will sync automatically." };
            }
        }
    };
})();
