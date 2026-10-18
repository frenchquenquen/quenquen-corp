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
  function installChoice() {
    const anchor = document.getElementById("musicVolume");
    if (!anchor || document.getElementById("qcV1TrackingChoice")) return;
    const holder = document.createElement("div");
    holder.id = "qcV1TrackingChoice";
    holder.style.cssText = "margin:9px 0;padding:7px 9px;border:1px solid #b99a3466;border-radius:7px;color:#f2c52d;font:12px Arial,sans-serif;max-width:300px";
    const button = document.createElement("button");
    button.type = "button";
    button.style.cssText = "background:transparent;border:0;color:inherit;cursor:pointer;font:inherit;text-align:left;padding:4px";
    const note = document.createElement("div");
    note.style.cssText = "color:#b8b8b8;font-size:10px;margin-top:4px";
    note.textContent = "Facultatif : associe les secrets trouvés à votre carte d’agent CORP sur cet appareil. Désactivable à tout moment.";
    function refresh() { button.textContent = "SUIVI DES DÉCOUVERTES : " + (enabled() ? "OUI ✓" : "NON"); }
    button.addEventListener("click", () => {
      window.QCV1Tracking.consent(!enabled());
      refresh();
    });
    holder.append(button, note);
    anchor.parentElement?.insertAdjacentElement("afterend", holder);
    refresh();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", installChoice);
  else installChoice();
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
