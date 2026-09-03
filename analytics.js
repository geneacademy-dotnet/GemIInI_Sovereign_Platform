/**
 * GemIInI SudaGene Platform — Unified Analytics Engine (analytics.js v3.0)
 * ─────────────────────────────────────────────────────────────────────────────
 * Property  : G-H1Q67PP2DJ
 * Domains   : geneacademy.net + members.geneacademy.net (cross-subdomain)
 * User-ID   : Set on authentication via setAuthenticatedUser()
 * Changelog : v3.0 — cross-domain linker, User-ID layer, learning events,
 *             archetype classification, GPS funnel tracking.
 *             v2.0 — GA4 business event bridge.
 * ─────────────────────────────────────────────────────────────────────────────
 * GOVERNANCE: WellPlan is STRICTLY INTERNAL CRM — never referenced here.
 *             All custom events fire on geneacademy.net public surface only.
 * ─────────────────────────────────────────────────────────────────────────────
 */
(function() {
  'use strict';

  const GA_ID = 'G-H1Q67PP2DJ';

  // ── Cross-Subdomain Linker Configuration ─────────────────────────────────
  // Configures GA4 to treat geneacademy.net and members.geneacademy.net as
  // a single property. Sessions are maintained when a user moves from the
  // public site to the authenticated member portal.
  if (typeof gtag === 'function') {
    gtag('config', GA_ID, {
      'linker': {
        'domains': ['geneacademy.net', 'members.geneacademy.net'],
        'accept_incoming': true
      },
      'anonymize_ip': true,
      'send_page_view': true
    });
  }

  // ── Safe gtag wrapper ─────────────────────────────────────────────────────
  const gtagEvent = function(eventName, params) {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }
  };

  // ── Session Identity (anonymous until auth) ───────────────────────────────
  const SESSION_KEY = 'gemiini_anon_session_id';
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = 'SESS-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }

  // ── Internal Beacon (to GemIInI SSOT backend) ────────────────────────────
  const beaconEvent = function(eventName, eventData) {
    const payload = {
      event:     eventName,
      sessionId: sessionId,
      path:      window.location.pathname,
      page:      window.location.pathname.split('/').pop() || 'index.html',
      referrer:  document.referrer || 'direct',
      timestamp: new Date().toISOString(),
      data:      eventData || {}
    };
    try {
      const logs = JSON.parse(sessionStorage.getItem('gemiini_event_logs') || '[]');
      logs.push(payload);
      if (logs.length > 50) logs.shift();
      sessionStorage.setItem('gemiini_event_logs', JSON.stringify(logs));
    } catch (e) {}
    if (typeof executeGemIInISync === 'function') {
      try {
        executeGemIInISync({
          action:    'LOG_ANONYMOUS_TELEMETRY',
          event:     eventName,
          sessionId: sessionId,
          eventData: payload
        }).catch(function() {});
      } catch (e) {}
    }
  };

  // ── Unified track: GA4 + internal beacon ─────────────────────────────────
  const track = function(gaEventName, params, internalName) {
    gtagEvent(gaEventName, params);
    beaconEvent(internalName || gaEventName, params);
  };

  // ── GLOBAL TRACKER API ────────────────────────────────────────────────────
  window.GemIInITracker = {

    track: track,

    // ── USER-ID LAYER ─────────────────────────────────────────────────────
    // Called immediately after successful authentication on members.geneacademy.net.
    // gaId must be the verified GA-XXXX identifier from the SSOT registry.
    // This links all cross-device and cross-session activity to a single user.
    setAuthenticatedUser: function(gaId, archetype) {
      if (!gaId) return;
      // Set the User-ID on the GA4 config — this persists for the session
      if (typeof gtag === 'function') {
        gtag('set', 'user_id', gaId);
        gtag('config', GA_ID, { 'user_id': gaId });
      }
      // Store in session so subsequent events carry the ID
      sessionStorage.setItem('gemiini_ga_id', gaId);
      if (archetype) sessionStorage.setItem('gemiini_archetype', archetype);
      // Fire an identity resolution event
      track('user_authenticated', {
        event_category:  'Identity',
        event_label:     gaId,
        member_archetype: archetype || 'UNKNOWN',
        business_niche:  'Independent_identity'
      }, 'USER_AUTH_RESOLVED');
    },

    // ── GPS FUNNEL / ARCHETYPE CLASSIFICATION ─────────────────────────────
    // Fires when the two-question Smart Funnel classifies a registrant.
    // archetype: 'STRANDED_EXPERT' | 'DESPERATE_EXAMINEE' | 'ACADEMIC_SEEKER' | 'B2B_CONNECTOR'
    trackArchetypeClassified: function(archetype, journeyStage, primaryGoal) {
      track('archetype_classified', {
        event_category:  'GPS Funnel',
        event_label:     archetype,
        journey_stage:   journeyStage,
        primary_goal:    primaryGoal,
        funnel_stage:    'classification',
        business_niche:  'gps_profile'
      }, 'ARCHETYPE_CLASSIFIED');
    },

    // Fires when registrant submits the full GPS profile form
    trackGpsFormSubmit: function(archetype, university, acquisitionChannel) {
      track('gps_profile_submitted', {
        event_category:     'GPS Funnel',
        event_label:        archetype,
        member_archetype:   archetype,
        university_cluster: university || 'unknown',
        acquisition_channel: acquisitionChannel || 'organic',
        funnel_stage:       'conversion',
        business_niche:     'gps_profile',
        value:              25  // Explorer GP awarded on registration
      }, 'GPS_FORM_SUBMIT');
    },

    // Fires when the system routes a user to their destination page
    trackArchetypeRouted: function(archetype, destinationUrl) {
      track('archetype_routed', {
        event_category:  'GPS Funnel',
        event_label:     archetype,
        destination:     destinationUrl,
        funnel_stage:    'routing',
        business_niche:  'gps_profile'
      }, 'ARCHETYPE_ROUTED');
    },

    // ── PARTNER / B2B FUNNEL ──────────────────────────────────────────────
    trackPartnerModalOpen: function(source) {
      track('partner_funnel_entry', {
        event_category:  'B2B Funnel',
        event_label:     source || 'cta_button',
        funnel_stage:    'modal_open',
        business_niche:  'university_partnership'
      }, 'PARTNER_MODAL_OPEN');
    },
    trackProfileTypeSelect: function(type) {
      track('profile_type_selected', {
        event_category:  'B2B Funnel',
        event_label:     type,
        funnel_stage:    'form_engagement',
        business_niche:  'university_partnership'
      }, 'PROFILE_TYPE_SELECT');
    },
    trackPartnerFormSubmit: function(profileType) {
      track('partner_form_submit', {
        event_category:  'B2B Funnel',
        event_label:     profileType,
        funnel_stage:    'conversion',
        business_niche:  'university_partnership',
        value:           profileType === 'business' ? 10 : 5
      }, 'PARTNER_FORM_SUBMIT');
    },

    // ── LEARNING INTERACTION EVENTS ───────────────────────────────────────
    // These fire on members.geneacademy.net LMS interactions.

    // Video engagement (called from the LMS video player)
    // milestone: 'play' | '25%' | '50%' | '75%' | 'complete'
    trackVideoEngagement: function(moduleId, milestone) {
      track('video_engagement', {
        event_category:  'Learning',
        event_label:     moduleId,
        video_milestone: milestone,
        business_niche:  'lms_engagement'
      }, 'VIDEO_ENGAGEMENT');
    },

    // Module completion (MTC case solved, vignette completed, etc.)
    trackModuleCompletion: function(moduleId, moduleName, gpAwarded, score) {
      var gaId = sessionStorage.getItem('gemiini_ga_id');
      track('module_completed', {
        event_category:  'Learning',
        event_label:     moduleId,
        module_name:     moduleName,
        gp_awarded:      gpAwarded || 0,
        score:           score || null,
        member_ga_id:    gaId || 'anonymous',
        funnel_stage:    'progression',
        business_niche:  'lms_engagement',
        value:           gpAwarded || 10
      }, 'MODULE_COMPLETED');
    },

    // Assessment / MTC case submission
    // result: 'pass' | 'fail' | 'attempt'
    trackAssessmentSubmit: function(assessmentId, result, score) {
      var gaId = sessionStorage.getItem('gemiini_ga_id');
      track('assessment_submitted', {
        event_category:  'Clinical Assessment',
        event_label:     assessmentId,
        assessment_result: result,
        score:           score || null,
        member_ga_id:    gaId || 'anonymous',
        business_niche:  'mtc_framework',
        value:           result === 'pass' ? 10 : 2
      }, 'ASSESSMENT_SUBMIT');
    },

    // Workshop registration (BLS, BSS-2, etc.)
    trackWorkshopRegistration: function(workshopId, workshopName, gpAwarded) {
      track('workshop_registered', {
        event_category:  'Workshop',
        event_label:     workshopId,
        workshop_name:   workshopName,
        gp_awarded:      gpAwarded || 500,
        funnel_stage:    'conversion',
        business_niche:  'hands_on_training',
        value:           gpAwarded || 500
      }, 'WORKSHOP_REGISTRATION');
    },

    // ── BLS EVENTS ────────────────────────────────────────────────────────
    trackBlsInterest: function(cohortId) {
      track('bls_workshop_interest', {
        event_category: 'BLS Workshop',
        event_label:    cohortId || 'general',
        business_niche: 'bls_training',
        value:          8
      }, 'BLS_INTEREST');
    },
    trackBlsRegistration: function(cohortId) {
      track('bls_registration_attempt', {
        event_category: 'BLS Workshop',
        event_label:    cohortId || 'general',
        funnel_stage:   'conversion',
        business_niche: 'bls_training',
        value:          15
      }, 'BLS_REGISTRATION');
    },

    // ── JOURNAL / RESEARCH ────────────────────────────────────────────────
    trackJournalInquiry: function(inquiryType) {
      track('journal_inquiry_submit', {
        event_category: 'Research & Journal',
        event_label:    inquiryType,
        funnel_stage:   'conversion',
        business_niche: 'gjmr_journal'
      }, 'JOURNAL_INQUIRY');
    },

    // ── CASE STUDY ────────────────────────────────────────────────────────
    trackCaseStudyRead: function() {
      track('case_study_engagement', {
        event_category: 'University Partnership',
        event_label:    'iend_khartoum',
        business_niche: 'university_partnership',
        value:          3
      }, 'CASE_STUDY_READ');
    },
    trackCaseStudyCta: function(ctaLabel) {
      track('case_study_cta_click', {
        event_category: 'University Partnership',
        event_label:    ctaLabel,
        funnel_stage:   'consideration',
        business_niche: 'university_partnership'
      }, 'CASE_STUDY_CTA');
    },

    // ── CLINICAL / SMC ────────────────────────────────────────────────────
    trackProgramInspection: function(programName) {
      track('program_inspection', {
        event_category: 'Clinical Programs',
        event_label:    programName,
        business_niche: 'smc_prep'
      }, 'INSPECT_PROGRAM');
    },

    // ── VERIFICATION ──────────────────────────────────────────────────────
    trackVerificationAttempt: function() {
      track('verification_attempt', {
        event_category: 'Identity & Trust',
        event_label:    'sudapass_verify',
        business_niche: 'Independent_identity'
      }, 'VERIFICATION_ATTEMPT');
    },

    // ── MEMBER PORTAL TRANSITION ──────────────────────────────────────────
    trackMemberPortalTransition: function(destination) {
      track('member_portal_entry', {
        event_category: 'Member Portal',
        event_label:    destination,
        business_niche: 'member_platform'
      }, 'TRANSITION_TO_MEMBERS_APP');
    },

    // ── INSTITUTIONAL CTA ─────────────────────────────────────────────────
    trackInstitutionalCta: function(ctaId, orgType) {
      track('institutional_cta_click', {
        event_category: 'Institutional',
        event_label:    ctaId,
        org_type:       orgType || 'generic',
        business_niche: 'university_partnership'
      }, 'CLICK_INSTITUTIONAL_CTA');
    }
  };

  // ── AUTO-WIRING ON DOM READY ──────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function() {

    // Page view beacon
    beaconEvent('PAGE_VIEW', { title: document.title });

    // Member portal transition links
    document.querySelectorAll('a[href*="members.geneacademy.net"]').forEach(function(el) {
      el.addEventListener('click', function() {
        window.GemIInITracker.trackMemberPortalTransition(el.getAttribute('href'));
      });
    });

    // Institutional CTAs
    document.querySelectorAll('[data-track-cta]').forEach(function(el) {
      el.addEventListener('click', function() {
        window.GemIInITracker.trackInstitutionalCta(
          el.getAttribute('data-track-cta'),
          el.getAttribute('data-org-type') || 'generic'
        );
      });
    });

    // BLS CTAs
    document.querySelectorAll('[data-track-bls]').forEach(function(el) {
      el.addEventListener('click', function() {
        window.GemIInITracker.trackBlsInterest(el.getAttribute('data-track-bls'));
      });
    });

    // Case study CTAs
    document.querySelectorAll('[data-track-case-study]').forEach(function(el) {
      el.addEventListener('click', function() {
        window.GemIInITracker.trackCaseStudyCta(el.getAttribute('data-track-case-study'));
      });
    });

    // Auto-detect case study page
    const page = window.location.pathname;
    if (page.includes('university-partnership-case-study')) {
      window.GemIInITracker.trackCaseStudyRead();
    }

    // Cross-subdomain linker: auto-decorate outbound links to members portal
    // so GA4 can stitch the session on the other side.
    if (typeof gtag === 'function') {
      document.querySelectorAll('a[href*="members.geneacademy.net"]').forEach(function(el) {
        el.addEventListener('click', function(event) {
          // gtag linker will have already decorated the URL via the config above.
          // This is a backup manual decoration if needed.
        });
      });
    }
  });

})();
