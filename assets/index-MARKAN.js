// index-MARKAN.js (v7) — place box *below* the nav/tabs
(function () {
  const byId = (id) => document.getElementById(id);

  // keep John's headers light
  function styleJohnHeadersLighterGray() {
    const headers = document.querySelectorAll(".john-header");
    headers.forEach((h) => {
      if (!h.style.backgroundColor) h.style.backgroundColor = "#d3d3d3";
      if (!h.style.padding) h.style.padding = "6px 10px";
      if (!h.style.borderRadius) h.style.borderRadius = "4px";
      if (!h.style.marginTop) h.style.marginTop = "1em";
    });
  }

  function populatePriorityBox(el) {
    el.id = "priority_box";
    Object.assign(el.style, {
      backgroundColor: "#f0f0f0",
      border: "1px solid #ccc",
      borderRadius: "12px",
      padding: "1rem",
      margin: "1rem auto",
      maxWidth: "640px",
      textAlign: "left",
    });

    const title = document.createElement("div");
    Object.assign(title.style, { textAlign: "center", marginBottom: "0.5rem", fontWeight: "600" });
    title.textContent = "Priority:";

    const wrap = document.createElement("div");
    Object.assign(wrap.style, { display: "grid", rowGap: "0.5rem" });

    const mkOption = (id, label, checked) => {
      const row = document.createElement("label");
      Object.assign(row.style, { display: "flex", alignItems: "center", gap: "0.6rem" });
      row.setAttribute("for", id);

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "priority";
      input.id = id;
      input.value = label;
      if (checked) input.checked = true;

      // make sure iOS shows radios
      Object.assign(input.style, { WebkitAppearance: "radio", appearance: "auto", width: "1rem", height: "1rem" });

      const span = document.createElement("span");
      span.textContent = label;

      row.appendChild(input);
      row.appendChild(span);
      return row;
    };

    wrap.appendChild(mkOption("matthean", "Matthean Priority", true));
    wrap.appendChild(mkOption("markan", "Markan Priority", false));

    el.appendChild(title);
    el.appendChild(wrap);
  }

  // Find best insertion anchor: prefer nav/tabs; else before first H1; else after dev warning; else end of #app
  function insertAfterBestAnchor(node) {
    const app = byId("app");
    if (!app) return;

    // 1) Any obvious nav/container for tabs?
    const nav =
      app.querySelector('nav, [role="navigation"], .navbar, .nav-tabs, .tabs, .topnav, header nav') ||
      document.querySelector('nav, [role="navigation"], .navbar, .nav-tabs, .tabs, .topnav');

    if (nav) {
      nav.insertAdjacentElement("afterend", node);
      return;
    }

    // 2) Before the first main H1 (so it sits above "Synopsis" heading but under other header chrome)
    const h1 = app.querySelector("h1");
    if (h1) {
      h1.insertAdjacentElement("beforebegin", node);
      return;
    }

    // 3) After dev warning if present
    const dev = byId("dev_warning");
    if (dev && dev.parentElement) {
      dev.insertAdjacentElement("afterend", node);
      return;
    }

    // 4) Fallback: end of #app
    app.appendChild(node);
  }

  function ensurePriorityUI() {
    const app = byId("app");
    if (!app) return;

    let box = byId("priority_box");
    if (!box) {
      box = document.createElement("div");
      populatePriorityBox(box);
      insertAfterBestAnchor(box);
    } else if (box.childElementCount === 0) {
      populatePriorityBox(box);
    }

    // notes below the box
    if (!byId("synoptic_note")) {
      const d1 = document.createElement("div");
      d1.id = "synoptic_note";
      Object.assign(d1.style, { margin: "0.75rem auto 0", maxWidth: "70ch" });
      d1.textContent =
        "The first three Gospels have darker gray headers to indicate they can be grouped as 'Synoptic Gospels...'";
      box.insertAdjacentElement("afterend", d1);
    }

    if (!byId("markan_note")) {
      const d2 = document.createElement("div");
      d2.id = "markan_note";
      Object.assign(d2.style, { margin: "0.5rem auto 0", maxWidth: "75ch" });
      d2.textContent =
        "Within the Markan priority, the role of Mark in the content of Matthew and Luke can be explained by the two-source or the Farrer hypothesis...";
      const after = byId("synoptic_note") || box;
      after.insertAdjacentElement("afterend", d2);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    styleJohnHeadersLighterGray();
    ensurePriorityUI();
  });
})();
