// index-MARKAN.js (v16) — proof-of-life + robust placement
(function () {
  // ---------- PROOF OF LIFE ----------
  try {
    console.log("[index-MARKAN.js] loaded v16");
    // Apply saved priority immediately so refresh preserves state
    let _saved = null;
    try { _saved = localStorage.getItem("gospelPriority"); } catch (_) {}
    // --- cookie fallback (added) ---
    if (!_saved) {
      try {
        const m = document.cookie.match(/(?:^|;\s*)gospelPriority=([^;]+)/);
        _saved = m ? decodeURIComponent(m[1]) : null;
      } catch (_) {}
    }
    if (_saved === "markan") {
      document.body.classList.add("markan-priority");
    } else if (_saved === "matthean") {
      document.body.classList.remove("markan-priority");
    }
    // (Removed green banner injection)
  } catch (e) {
    // If even this fails, nothing beyond here will run
  }

  // ---------- Styles (John tint + radio visibility) ----------
  const STYLE_ID = "markan-inline-style";
  const STYLE_CSS = `
    body.markan-priority .row.content > .col-lg-3.col_md-12.pb-3:nth-of-type(1) { order: 2 !important; }
    body.markan-priority .row.content > .col-lg-3.col-md-12.pb-3:nth-of-type(2) { order: 1 !important; }
    body.markan-priority .row.content > .col-lg-3.col-md-12.pb-3:nth-of-type(3) { order: 3 !important; }
    body.markan-priority .row.content > .col-lg-3.col.md-12.pb-3:nth-of-type(4) { order: 4 !important; }

    .gospel-john .section-header,
    .gospel-john .card-header,
    .gospel-john .header,
    .gospel-john h2,
    .gospel-john .bg-light,
    .gospel-john .accordion-button,
    .gospel-john .accordion-header .accordion-button {
      background-color: #eeeeee !important;
      border-color: #dddddd !important;
    }
    .gospel-john .accordion {
      --bs-accordion-btn-bg: #eeeeee;
      --bs-accordion-border-color: #dddddd;
      --bs-accordion-active-bg: #eeeeee;
      --bs-accordion-btn-focus-box-shadow: none;
    }
    .gospel-john .card, .gospel-john .card-header { box-shadow: none !important; }
    .gospel-john [class*="bg-"] { background-image: none !important; }

    #priority_choice input[type="radio"] {
      -webkit-appearance: radio; appearance: auto;
      transform: scale(1.20);
      accent-color: #0d6efd;
      outline: 1px solid #555; outline-offset: 1px; opacity: 1;
    }
    #priority_choice input[type="radio"]:checked { outline-color: #0d6efd; }
  `;
  function ensureInlineStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.appendChild(document.createTextNode(STYLE_CSS));
    document.head.appendChild(style);
  }

  // ---------- Helpers ----------
  const $ = (sel, root = document) => (root || document).querySelector(sel);
  const byId = (id) => document.getElementById(id);

  function getApp() {
    return byId("app") || document.body || document.documentElement;
  }

  function findNavLike() {
    const app = byId("app");
    return (app && app.querySelector("nav, [role='navigation'], .navbar, .nav-tabs, .tabs"))
        || $("header nav, header, nav, [role='navigation'], .navbar, .nav-tabs, .tabs");
  }

  function findPrefaceAnchor() {
    const app = byId("app");
    if (!app) return null;
    const nodes = app.querySelectorAll("h1, h2, h3, .section-header, .card-header, .header");
    for (const el of nodes) {
      const t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (/^I\.\s*Preface/i.test(t)) return el;
    }
    return null;
  }

  function findGridAnchor() {
    return $(".row.content");
  }

  // ---------- Dev warning (unchanged text/link) ----------
  function ensureDevWarning() {
    if (byId("dev_warning")) return;
    const app = getApp();

    const warning = document.createElement("div");
    warning.id = "dev_warning";
    warning.className = "text-center fs-3";
    warning.style.color = "red";
    warning.style.fontStyle = "normal";
    warning.innerHTML =
      'This developmental website is based on ' +
      '<a href="https://www.synopticus.org/en/ESV" target="_blank" ' +
      'style="color:red; font-style:normal; text-decoration:underline;">' +
      'https://www.synopticus.org/en/ESV</a>.<br><i>' +
      'Best viewed on a desktop browser</i>';

    const nav = findNavLike();
    if (nav && nav.parentNode) {
      nav.insertAdjacentElement("afterend", warning);
    } else {
      app.insertBefore(warning, app.firstChild);
    }
  }

  // ---------- Priority state ----------
  function setPriority(value) {
    const isMarkan = value === "markan";
    document.body.classList.toggle("markan-priority", isMarkan);
    try { localStorage.setItem("gospelPriority", isMarkan ? "markan" : "matthean"); } catch (_) {}
    const m1 = byId("priority_matthew");
    const m2 = byId("priority_markan");
    if (m1 && m2) { m1.checked = !isMarkan; m2.checked = isMarkan; }
  }

  // ---------- Chooser ----------
  function ensurePriorityChooser() {
    const app = getApp();
    const preface = findPrefaceAnchor();
    const grid = findGridAnchor();

    const anchor = preface || grid || app.lastChild;

    let chooser = byId("priority_choice");
    if (!chooser) {
      chooser = document.createElement("div");
      chooser.id = "priority_choice";
      chooser.className = "text-center";
      chooser.style.fontSize = "14px";
      chooser.style.margin = "0 0 0.75rem 0";
      chooser.innerHTML = `
        <div style="margin-bottom:6px;">Select the Gospel priority:</div>
        <div style="display:inline-block;border:1px solid #ccc;border-radius:8px;padding:12px 16px;background:#f9f9f9;text-align:left;">
          <div class="form-check d-flex justify-content-center" style="margin-bottom:6px;">
            <input class="form-check-input me-2" type="radio" name="gospelPriority" id="priority_matthew" value="matthean" checked>
            <label class="form-check-label" for="priority_matthew">Matthean (default) — Matthew listed first</label>
          </div>
          <div class="form-check d-flex justify-content-center">
            <input class="form-check-input me-2" type="radio" name="gospelPriority" id="priority_markan" value="markan">
            <label class="form-check-label" for="priority_markan">
              Markan — Mark listed first allows observing the evolving descriptions of events
              as Mark was likely written first and John last...
            </label>
          </div>
        </div>
        <div id="synoptic_note" style="margin-top:.75rem;max-width:100ch;margin-inline:auto;">
          The first three Gospels have darker gray headers to indicate they can be grouped as "Synoptic Gospels because..."
        </div>
        <div id="markan_note" style="margin-top:.5rem;max-width:100ch;margin-inline:auto;">
          Within the Markan priority, the role of Mark in the content of Matthew and Luke can be explained by either...
        </div>
      `;

      if (anchor && anchor.parentNode) {
        anchor.parentNode.insertBefore(chooser, anchor);
      } else {
        app.appendChild(chooser);
      }

      chooser.addEventListener("change", (e) => {
        if (e.target && e.target.name === "gospelPriority") setPriority(e.target.value);
      });
      let saved = null;
      try { saved = localStorage.getItem("gospelPriority"); } catch (_) {}
      // --- cookie fallback (added) ---
      if (!saved) {
        try {
          const m = document.cookie.match(/(?:^|;\s*)gospelPriority=([^;]+)/);
          saved = m ? decodeURIComponent(m[1]) : null;
        } catch (_) {}
      }
      setPriority(saved || "matthean");
    } else {
      if (anchor && chooser.nextSibling !== anchor) {
        anchor.parentNode.insertBefore(chooser, anchor);
      }
    }
  }

  // ---------- Tag John column ----------
  function tagJohnColumn() {
    const row = document.querySelector(".row.content"); if (!row) return;
    const cols = row.querySelectorAll(".col-lg-3.col-md-12.pb-3");
    if (cols.length >= 4) {
      cols.forEach(c => c.classList.remove("gospel-john"));
      cols[3].classList.add("gospel-john"); // 4th column = John
    }
  }

  // ---------- Orchestrate & retry ----------
  function step() {
    try { ensureInlineStyle(); } catch {}
    try { ensureDevWarning(); } catch {}
    try { ensurePriorityChooser(); } catch {}
    try { tagJohnColumn(); } catch {}
  }

  // Run immediately, on DOM ready, and on load
  step();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", step, { once: true });
  }
  window.addEventListener("load", step, { once: true });

  // Retry a bit (for late hydration)
  let tries = 0;
  const maxTries = 80; // ~16s
  const timer = setInterval(() => {
    tries++;
    step();
    // stop early if we see the chooser and the dev warning
    if (document.getElementById("dev_warning") && document.getElementById("priority_choice")) {
      clearInterval(timer);
    } else if (tries >= maxTries) {
      clearInterval(timer);
    }
  }, 200);
})();
