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
    const anchor = document.querySelector(".coverSide .qcCoverTitle");
    if (!anchor || document.getElementById("qcV1TrackingChoice")) return;
    const holder = document.createElement("div");
    holder.id = "qcV1TrackingChoice";
    holder.style.cssText = "position:relative;z-index:30;margin:0 auto 16px;padding:0;text-align:center;color:#f2c52d;font:12px Arial,sans-serif;max-width:360px;pointer-events:auto";
    const button = document.createElement("button");
    button.type = "button";
    button.id = "qcV1TrackingToggle";
    button.style.cssText = "display:inline-block;position:relative;z-index:31;min-width:235px;min-height:44px;background:#202027;border:2px solid #a18a2b;border-radius:999px;color:#ffd400;cursor:pointer;font:700 12px Arial,sans-serif;letter-spacing:.04em;text-align:center;padding:11px 16px;touch-action:manipulation;pointer-events:auto";
    const note = document.createElement("div");
    note.style.cssText = "color:#555;font-size:11px;margin:8px auto 0;max-width:330px;line-height:1.4";
    function refresh() {
      const on = enabled();
      button.textContent = on ? "✓ SUIVI ACTIVÉ — CLIQUER POUR DÉSACTIVER" : "○ ACTIVER LE SUIVI DES DÉCOUVERTES";
      button.style.background = on ? "#ffd400" : "#202027";
      button.style.color = on ? "#111" : "#ffd400";
      button.style.borderColor = on ? "#111" : "#a18a2b";
      button.setAttribute("aria-pressed", String(on));
      button.title = on ? "Désactiver le suivi des découvertes" : "Activer le suivi des découvertes";
      note.textContent = on
        ? "Suivi activé sur cet appareil. Les nouvelles découvertes seront enregistrées."
        : "Facultatif : cliquez pour associer vos prochaines découvertes à votre carte d’agent CORP.";
    }
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      window.QCV1Tracking.consent(!enabled());
      refresh();
    });
    holder.append(button, note);
    anchor.insertAdjacentElement("afterend", holder);
    refresh();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", installChoice);
  else installChoice();

  // Observe only genuine first-time unlock writes, never replay old saved flags.
  const MYSTERY_FLAGS = Object.freeze({
    "quenquen_corp_archive_11_discovered_v1":"archive11",
    "quenquen_corp_archive_6_discovered_v1":"archive6",
    "quenquen_corp_archive_1_discovered_v1":"archive1",
    "quenquen_corp_archive_3_discovered_v1":"archive3",
    "quenquen_corp_archive_8_discovered_v1":"archive8",
    "quenquen_corp_archive_16_discovered_v1":"archive16",
    "quenquen_corp_archive_12_discovered_v1":"archive12",
    "quenquen_corp_archive_0_discovered_v1":"archive0",
    "quenquen_corp_remote_archive_99_discovered_v1":"remote_archive99",
    "quenquen_corp_archive_23_discovered_v1":"archive23",
    "quenquen_corp_archive_14_discovered_v1":"archive14",
    "quenquen_amour_du_cringe_found_v1":"cringe_love",
    "quenquen_frenchblade_acquired_v1":"frenchblade",
    "quenquen_bits55_completed_v1":"bits55",
    "quenquen_suzie_bear_recovered_v1":"suzie_bear",
    "quenquen_monteur_quenquen_20_unlocked_v1":"monteur20",
    "quenquen_jungle_croissant_unlocked_v1":"jungle_croissant",
    "qc_royal_quantin_unlocked_v1":"royal_quantin",
    "qc_french_grenier_unlocked_v1":"french_grenier",
    "qc_chocolat45_found_v1":"chocolat45",
    "qc_egg_arek33_v1":"arek33",
    "qc_egg_reims27_v1":"reims27",
    "qc_egg_flavie4_v1":"flavie4",
    "qc_last_page_dot_found_v1":"last_page_dot",
    "qc_expert_quenquen_unlocked_v1":"expert_quenquen",
    "quenquen_quick43_burger_unlocked_v1":"quick43",
    "qc_og_letter_unlocked_v1":"og_letter",
    "quenquen_andromeda_watch_unlocked_v9":"andromeda_watch",
    "quenquen_spooky_17_seen_v1":"spooky17",
    "quenquen_noel39_found_v1":"noel39",
    "quenquen_saboteur69_found_v1":"saboteur69"
  });
  // Backfill saved discoveries only after explicit consent; never alter album progress.
  const CRINGE_KEY = "quenquen_amour_du_cringe_found_v1";
  const BACKFILL_VERSION = "qc_v1_tracking_backfill_v3";
  const BACKFILL_OWNER = "qc_v1_tracking_backfill_owner_v1";
  function identityKey() {
    const creds = agentCredentials();
    return creds ? "agent:" + creds.corp_id : "visitor:" + (visitorId() || "unknown");
  }
  async function syncSaved() {
    if (!enabled()) return {total:0,success:0};
    const currentIdentity = identityKey();
    try {
      const previousOwner = localStorage.getItem(BACKFILL_OWNER);
      if (previousOwner && previousOwner !== currentIdentity) {
        // Never replay one browser's old album flags into another agent identity.
        return {total:0,success:0,skipped:"identity_changed"};
      }
      localStorage.setItem(BACKFILL_OWNER, currentIdentity);
    } catch {}
    const codes = new Set();
    try {
      for (const [key, code] of Object.entries(MYSTERY_FLAGS)) {
        if (key === CRINGE_KEY || code === "remote_archive99") continue;
        if (localStorage.getItem(key)) {
          codes.add(code);
          if (code === "archive16") codes.add("gift16");
          if (code === "archive12") codes.add("twitch_unlock");
        }
      }
      // Legacy keys still used by collectible triggers.
      const legacy = {
        "qc_quick43_unlocked_v1":"quick43",
        "qc_noel39_unlocked_v1":"noel39",
        "qc_og_letter_unlocked_v1":"og_letter",
        "qc_egg_arek33_v1":"arek33"
      };
      for (const [key, code] of Object.entries(legacy)) if (localStorage.getItem(key)) codes.add(code);
      const saved = JSON.parse(localStorage.getItem(CRINGE_KEY) || "[]");
      if (Array.isArray(saved)) for (const id of saved) {
        const n = Number(id);
        if (Number.isInteger(n) && n >= 1 && n <= 16) codes.add("cringe_" + String(n).padStart(2,"0"));
      }
    } catch {}
    let success = 0;
    for (const code of codes) {
      if (!enabled()) break;
      if (await record(code)) success++;
    }
    if (enabled() && success === codes.size) {
      try {
        localStorage.setItem(BACKFILL_VERSION, currentIdentity);
        localStorage.setItem(BACKFILL_OWNER, currentIdentity);
      } catch {}
    }
    return {total:codes.size,success};
  }
  let syncInFlight = null;
  function synchronize() {
    if (!enabled()) return Promise.resolve({total:0,success:0});
    if (syncInFlight) return syncInFlight;
    syncInFlight = syncSaved().finally(() => { syncInFlight = null; });
    return syncInFlight;
  }
  const originalSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function(key, value) {
    const mystery = this === localStorage && MYSTERY_FLAGS[String(key)];
    const wasUnlocked = mystery ? this.getItem(key) !== null : false;
    const result = originalSetItem.apply(this, arguments);
    if (mystery && !wasUnlocked && value != null && String(value) !== "" && enabled()) {
      void record(mystery);
      if (mystery === "archive16") void record("gift16");
      if (mystery === "archive12") void record("twitch_unlock");
    }
    return result;
  };
  window.QCV1Tracking = Object.freeze({
    record,
    isEnabled: enabled,
    hasAgentCard: () => agentCredentials() !== null,
    identityKey,
    syncSaved: synchronize,
    consent(value) {
      if (value !== true && value !== false) return;
      try {
        localStorage.setItem(CONSENT, value ? "yes" : "no");
        if (value) void synchronize();
        if (!value) localStorage.removeItem(VISITOR);
      } catch {}
    }
  });
  if (enabled()) setTimeout(() => { void synchronize(); }, 1200);
})();
