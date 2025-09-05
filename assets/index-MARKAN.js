(function () {
  // --- 0) Inline CSS we’ll inject once; enabled by toggling a body class ---
  const STYLE_ID = "markan-inline-style";
  const STYLE_CSS = `
    /* When body has .markan-priority, put Mark before Matthew */
    body.markan-priority .row.content > .col-lg-3.col-md-12.pb-3:nth-of-type(1) { order: 2 !important; } /* Matthew -> 2nd */
    body.markan-priority .row.content > .col-lg-3.col-md-12.pb-3:nth-of-type(2) { order: 1 !important; } /* Mark    -> 1st */
    body.markan-priority .row.content > .col-lg-3.col-md-12.pb-3:nth-of-type(3) { order: 3 !important; }
    body.markan-priority .row.content > .col-lg-3.col-md-12.pb-3:nth-of-type(4) { order: 4 !important; }

    /* Make John's headers lighter gray (target the 4th Gospel column we tag as .gospel-john) */
    .gospel-john .section-header,
    .gospel-john .card-header,
    .gospel-john h2,
    .gospel-john .header {
      background-color: #eeeeee !important;
      border-color: #dddddd !important;
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

  // --- 1) Priority state + toggler (body class + localStorage) ---
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

  // --- 2) Dev warning above H1 "Synopsis" ---
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

    const synopsis = app.querySelector('h1.text-center.display-1');
    (synopsis?.parentNode || app).insertBefore(warning, synopsis || app.firstChild);
  }

  // --- 3) Priority chooser just BEFORE section with id="1" (Prologue block) ---
  function ensurePriorityChooser() {
    if (document.getElementById("priority_choice")) return;

    const app = document.getElementById("app");
    const sectionOne = document.getElementById("1");
    if (!app || !sectionOne) return;

    const chooser = document.createElement("div");
    chooser.id = "priority_choice";
    chooser.className = "text-center";
    chooser.style.fontSize = "14px";
    chooser.innerHTML = `
  <div style="margin-bottom:6px;">Select the Gospel priority:</div>
  <div style="
    display:inline-block;
    border: 1px solid #ccc;   /* 👈 make this 'none' to hide */
    border-radius: 6px;
    padding: 10px 16px;
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
        Markan — Mark listed first
      </label>
    </div>
  </div>
  <div>The first three Gospels have darker gray headers to indicate they can be grouped as "Synoptic Gospels because..."</div>
  <div>Within the Markan priority, the role of Mark in the content of Matthew and Luke can be explained by either...</div>
`;

    sectionOne.parentNode.insertBefore(chooser, sectionOne);

    chooser.addEventListener("change", (e) => {
      if (e.target && e.target.name === "gospelPriority") {
        setPriority(e.target.value);
      }
    });

    const saved = localStorage.getItem("gospelPriority") || "matthean";
    setPriority(saved);
  }

  // --- 3b) Tag John's column so we can safely style its headers
  function tagJohnColumn() {
    const row = document.querySelector('.row.content');
    if (!row) return;
    const cols = row.querySelectorAll('.col-lg-3.col-md-12.pb-3');
    if (cols.length >= 4) {
      cols.forEach(c => c.classList.remove('gospel-john'));
      cols[3].classList.add('gospel-john'); // 4th column = John
    }
  }

  // --- 4) Orchestration ---
  function tryInsertAll() {
    ensureInlineStyle();
    ensureDevWarning();
    ensurePriorityChooser();
    tagJohnColumn(); // ← add the marker class so the CSS applies
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tryInsertAll);
  } else {
    tryInsertAll();
  }

  // Vue mounts late; watch briefly until elements appear, then stop
  const obs = new MutationObserver(() => {
    tryInsertAll();
    if (document.getElementById("dev_warning") &&
        document.getElementById("priority_choice")) {
      obs.disconnect();
    }
  });
  obs.observe(document.body, { childList: true, subtree: true });
  setTimeout(() => obs.disconnect(), 15000);
})();
