/* QUENQUEN CORP — Card Collector V1: voluntary mystery telemetry.
   This file does nothing until loaded by the album and a visitor opts in.
   Call window.QCV1Tracking.record('noel39') only after the real discovery event. */
(() => {
  "use strict";
  const ENDPOINT = "https://qfkjrlpkykkizrmzlixp.supabase.co/functions/v1/qc-v1-discovery";
  const CONSENT = "qc_v1_tracking_consent_v1";
  const VISITOR = "qc_v1_tracking_visitor_v1";
  const IDENTITY = "quenquen_corp_identity_v2";
  const TOKENS = "quenquen_corp_edit_tokens_v1";
  const pending = new Set();
  function agentCredentials() {
    try {
      const agent = JSON.parse(localStorage.getItem(IDENTITY) || "null");
      const tokens = JSON.parse(localStorage.getItem(TOKENS) || "{}");
      const corpId = agent?.corpId;
      const token = corpId && tokens?.[corpId];
      if (typeof corpId === "string" && corpId.length <= 80 &&
          typeof token === "string" && token.length <= 256) {
        return { corp_id: corpId, agent_token: token };
      }
    } catch {}
    return null;
  }
  function enabled() {
    try { return localStorage.getItem(CONSENT) === "yes"; } catch { return false; }
  }
  function visitorId() {
    try {
      let id = localStorage.getItem(VISITOR);
      if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
        id = crypto.randomUUID();
        localStorage.setItem(VISITOR, id);
      }
      return id;
    } catch { return null; }
  }
  async function record(code) {
    if (!enabled() || typeof code !== "string" || !/^[a-z0-9_]{1,80}$/.test(code) || pending.has(code)) return false;
    const visitor_id = visitorId();
    if (!visitor_id) return false;
    pending.add(code);
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST", mode: "cors", credentials: "omit",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, visitor_id, ...(agentCredentials() || {}) })
      });
      return response.ok;
    } catch { return false; }
    finally { pending.delete(code); }
  }
  window.QCV1Tracking = Object.freeze({
    record,
    isEnabled: enabled,
    hasAgentCard: () => agentCredentials() !== null,
    consent(value) {
      if (value !== true && value !== false) return;
      try {
        localStorage.setItem(CONSENT, value ? "yes" : "no");
        if (!value) localStorage.removeItem(VISITOR);
      } catch {}
    }
  });
})();
