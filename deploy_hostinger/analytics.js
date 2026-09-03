/**
 * GemIInI SudaGene Platform — Anonymous Business & Funnel Telemetry Tracker (analytics.js)
 * Zero-PII, lightweight client-side event collector
 */
(function() {
  'use strict';

  const SESSION_KEY = 'gemiini_anon_session_id';
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = 'SESS-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }

  const trackEvent = function(eventName, eventData) {
    const payload = {
      event: eventName,
      sessionId: sessionId,
      path: window.location.pathname,
      page: window.location.pathname.split('/').pop() || 'index.html',
      referrer: document.referrer || 'direct',
      timestamp: new Date().toISOString(),
      data: eventData || {}
    };

    // Store in session log for multi-step audit
    try {
      const logs = JSON.parse(sessionStorage.getItem('gemiini_event_logs') || '[]');
      logs.push(payload);
      if (logs.length > 50) logs.shift();
      sessionStorage.setItem('gemiini_event_logs', JSON.stringify(logs));
    } catch (e) {}

    // Dispatch beacon or fallback sync if available
    if (typeof executeGemIInISync === 'function') {
      try {
        executeGemIInISync({
          action: 'LOG_ANONYMOUS_TELEMETRY',
          event: eventName,
          sessionId: sessionId,
          eventData: payload
        }).catch(function() {});
      } catch (err) {}
    }
  };

  // Expose global tracker
  window.GemIInITracker = {
    track: trackEvent,
    trackProgramInspection: function(programName) {
      trackEvent('INSPECT_PROGRAM', { program: programName });
    },
    trackInstitutionalCta: function(ctaId, orgType) {
      trackEvent('CLICK_INSTITUTIONAL_CTA', { cta: ctaId, type: orgType });
    },
    trackVerificationAttempt: function(gaIdQueried) {
      trackEvent('VERIFICATION_ATTEMPT', { targetGaId: gaIdQueried });
    },
    trackMemberPortalTransition: function(destinationGroup) {
      trackEvent('TRANSITION_TO_MEMBERS_APP', { destination: destinationGroup });
    }
  };

  // Auto-track page entry
  document.addEventListener('DOMContentLoaded', function() {
    trackEvent('PAGE_VIEW', { title: document.title });

    // Auto-wire tracking on member portal links
    document.querySelectorAll('a[href*="members.geneacademy.net"]').forEach(function(el) {
      el.addEventListener('click', function() {
        window.GemIInITracker.trackMemberPortalTransition(el.getAttribute('href'));
      });
    });

    // Auto-wire tracking on institution CTAs
    document.querySelectorAll('[data-track-cta]').forEach(function(el) {
      el.addEventListener('click', function() {
        window.GemIInITracker.trackInstitutionalCta(el.getAttribute('data-track-cta'), el.getAttribute('data-org-type') || 'generic');
      });
    });
  });
})();
