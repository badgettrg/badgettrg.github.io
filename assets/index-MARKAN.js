// index-MARKAN.js (v11) — place chooser before "I. Preface" and improve radio visibility
(function () {
  // --- Inline CSS (John headers + radio visibility) ---
  const STYLE_ID = "markan-inline-style";
  const STYLE_CSS = `
    /* Optional Markan ordering via body class (kept for future use) */
    body.markan-priority .row.content > .col-lg-3.col-md-12.pb-3:nth-of-type(1) { order: 2 !important; } /* Matthew -> 2nd */
    body.markan-priority .row.content > .col-lg-3.col-md-12.pb-3:nth-of-type(2) { order: 1 !important; } /* Mark    -> 1st */
    body.markan-priority .row.content > .col-lg-3.col-md-12.pb-3:nth-of-type(3) { order: 3 !important; }
    body.markan-priority .row.content > .col-lg-3.col-md-12.pb-3:nth-of-type(4) { order: 4 !important; }

    /* Make John's headers a lighter gray (applies to the column we tag as .gospel-john) */
    .gospel-john .section-header,
    .gospel-john .card-header,
    .gospel-john h2,
    .gospel-john .header {
      background-color: #eeeeee !important;
      border-color: #dddddd !important;
    }

    /* Radios inside our chooser: make UNSELECTED state more visible across browsers (incl. iOS) */
    #priority_choice input[type="radio"] {
      -webkit-appearance: radio;
      appearance: auto;
      transform: scale(1.20);
      accent-color: #0d6efd;   /* supported by Safari/Chrome/Firefox */
      outline: 1px solid #555; /* gives a darker ring even when not selected */
      outline-offset: 1px;
      opacity: 1;              /* avoid frameworks lowering opacity */
    }
    #priority_choice input[type="radio"]:checked {
      outline-color: #0d6efd;
    }
  `;

  function ensureInlineStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.type = "text/css";
    style.appendChild(document.createTextNode(STYLE_CSS));
    document.head.appendChild(style);
  }

  // --- Dev warning (unchanged text/link) ---
  function ensureDevWarning() {
    if (document.getElementById("dev_warning")) return;
    const app = document.getElementById("app");
    if (!app) return;

    const warning = document.createElement("div");
    warning.id = "dev_warning";
    warning.className = "text-center fs-3";
    warning.style.color = "red";
    warning.style.fontStyle = "italic";
    warning.innerHTML =
      'This developmental website is based on ' +
      '<a href="https://www.synopticus.org/en/ESV" target="_blank" ' +
      'style="color:red; font-style:italic; text-decoration:underline;">' +
      'https://www.synopticus.org/en/ESV</a>.<br>' +
      'This page is best viewed on a desktop browser';

    const synopsis = document.querySelector('#app h1.text-center.display-1');
    (synopsis?.parentNode || app).insertBefore(warning, synopsis || app.firstChild);
  }

  // --- Find the "I. Preface" anchor element ---
  function findPrefaceAnchor() {
    const app = document.getElementById("app");
    if (!app) return null;

    // Search common heading containers for text "I. Preface"
    const candidates = app.querySelectorAll("h1, h2, h3, .section-header, .card-header, .header");
    for (const el of candidates) {
      const t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (/^I\.\s*Preface/i.test(t)) return el;
    }
    return null;
  }

  // --- Priority state + toggler ---
  function setPriority(value) {
    const isMarkan = value === "markan";
    document.body.classList.toggle("markan-priority", isMarkan);
    localStorage.setItem("gospelPriority", isMarkan ? "markan" : "matthean");
    const m1 = document.getElementById("priority_matthew");
    const m2 = document.getElementById("priority_markan");
    if (m1 && m2) {
      m1.checked = !isMarkan;
      m2.checked = isMarkan;
    }
  }

  // --- Create/ensure chooser placed BEFORE "I. Preface" ---
  function ensurePriorityChooser() {
    const app = document.getElementById("app");
    const preface = findPrefaceAnchor();
    if (!app || !preface) return;

    let chooser = document.getElementById("priority_choice");
    if (!chooser) {
      chooser = document.createElement("div");
      chooser.id = "priority_choice";
      chooser.className = "text-center";
      chooser.style.fontSize = "14px";
      chooser.style.marginBottom = "0.75rem";
      chooser.innerHTML = `
        <div style="margin-bottom:6px;">Select the Gospel priority:</div>
        <div style="
          display:inline-block;
          border: 1px solid #ccc;   /* set to 'none' later to hide if desired */
          border-radius: 8px;
          padding: 12px 16px;
          background-color: #f9f9f9;
          text-align: left;
        ">
          <div class="form-check d-flex justify-content-center" style="margin-bottom:6px;">
            <input class="form-check-input me-2" type="radio" name="gospelPriority"
                   id="priority_matthew" value="matthean" checked>
            <label class="form-check-label" for="priority_matthew">
              Matthean (default) — Matthew listed first
            </label>
          </div>
          <div class="form-check d-flex justify-content-center">
            <input class="form-check-input me-2" type="radio" name="gospelPriority"
                   id="priority_markan" value="markan">
            <label class="form-check-label" for="priority_markan">
              Markan — Mark listed first allows observing the evolving descriptions of events
              as Mark was likely written first and John last...
            </label>
          </div>
        </div>
        <div id="synoptic_note" style="margin-top: 0.75rem; max-width: 100ch; margin-left:auto; margin-right:auto;">
          The first three Gospels have darker gray headers to indicate they can be grouped as "Synoptic Gospels because..."
        </div>
        <div id="markan_note" style="margin-top: 0.5rem; max-width: 100ch; margin-left:auto; margin-right:auto;">
          Within the Markan priority, the role of Mark in the content of Matthew and Luke can be explained by either...
        </div>
      `;

      // Insert BEFORE "I. Preface"
      preface.parentNode.insertBefore(chooser, preface);

      // Wire up
      chooser.addEventListener("change", (e) => {
        if (e.target && e.target.name === "gospelPriority") {
          setPriority(e.target.value);
        }
      });

      // Initialize from saved state
      setPriority(localStorage.getItem("gospelPriority") || "matthean");
    } else {
      // If it already exists (from a prior render), ensure it sits before "I. Preface"
      if (chooser.nextSibling !== preface) {
        preface.parentNode.insertBefore(chooser, preface);
      }
    }
  }

  // --- Tag John's column (so lighter-gray styling applies) ---
  function tagJohnColumn() {
    const row = document.querySelector(".row.content");
    if (!row) return;
    const cols = row.querySelectorAll(".col-lg-3.col-md-12.pb-3");
    if (cols.length >= 4) {
      cols.forEach(c => c.classList.remove("gospel-john"));
      cols[3].classList.add("gospel-john"); // 4th column = John
    }
  }

  // --- Orchestration ---
  function runAll() {
    ensureInlineStyle();
    ensureDevWarning();
    ensurePriorityChooser();
    tagJohnColumn();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runAll);
  } else {
    runAll();
  }

  // In case the app hydrates asynchronously, watch briefly and re-apply
  const obs = new MutationObserver(() => {
    runAll();
    if (document.getElementById("dev_warning") &&
        document.getElementById("priority_choice") &&
        findPrefaceAnchor()) {
      obs.disconnect();
    }
  });
  obs.observe(document.body, { childList: true, subtree: true });
  setTimeout(() => obs.disconnect(), 15000);
})();
