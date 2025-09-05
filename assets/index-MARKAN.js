// index-MARKAN.js (v6)
(function () {
  const byId = (id) => document.getElementById(id);

  // Lighten John's headers (no content changes)
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

    // Container: make sure it shows on mobile
    Object.assign(el.style, {
      backgroundColor: "#f0f0f0",
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "1em",
      margin: "1em auto",
      maxWidth: "480px",
      textAlign: "left",
      display: "block",          // force visible
      visibility: "visible"      // force visible
    });

    // Title
    const title = document.createElement("div");
    Object.assign(title.style, {
      textAlign: "center",
      marginBottom: "0.5em",
      fontWeight: "600"
    });
    title.textContent = "Priority:";

    // Vertical radio options; force radios to be visible on iOS
    const optWrap = document.createElement("div");
    Object.assign(optWrap.style, {
      display: "grid",
      rowGap: "0.5em"
    });

    const mkOption = (id, label, checked) => {
      const row = document.createElement("label");
      row.setAttribute("for", id);
      Object.assign(row.style, {
        display: "flex",
        alignItems: "center",
        gap: "0.6em",
        lineHeight: "1.3"
      });

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "priority";
      input.id = id;
      input.value = label;
      if (checked) input.checked = true;

      // iOS/Safari: fight global resets that hide radios
      Object.assign(input.style, {
        display: "inline-block",
        visibility: "visible",
        WebkitAppearance: "radio", // restore native radio on iOS
        appearance: "auto",
        width: "1rem",
        height: "1rem",
        flex: "0 0 auto"
      });

      const text = document.createElement("span");
      text.textContent = label;

      row.appendChild(input);
      row.appendChild(text);
      return row;
    };

    optWrap.appendChild(mkOption("matthean", "Matthean Priority", true));
    optWrap.appendChild(mkOption("markan", "Markan Priority", false));

    el.appendChild(title);
    el.appendChild(optWrap);
  }

  function ensurePriorityUI() {
    const app = byId("app");
    if (!app) return;

    // Create the box if missing
    let box = byId("priority_box");
    if (!box) {
      box = document.createElement("div");
      populatePriorityBox(box);

      // Place right below dev warning if present; otherwise at top of #app
      const dev = byId("dev_warning");
      if (dev && dev.parentElement === app) {
        dev.insertAdjacentElement("afterend", box);
      } else {
        app.prepend(box);
      }
    } else if (box.childElementCount === 0) {
      populatePriorityBox(box);
    }

    // Two explanatory divs below the box (create once)
    if (!byId("synoptic_note")) {
      const div1 = document.createElement("div");
      div1.id = "synoptic_note";
      Object.assign(div1.style, {
        margin: "0.75em auto 0",
        maxWidth: "60ch",
        display: "block",
        visibility: "visible"
      });
      div1.textContent =
        "The first three Gospels have darker gray headers to indicate they can be grouped as 'Synoptic Gospels...'";
      box.insertAdjacentElement("afterend", div1);
    }

    if (!byId("markan_note")) {
      const div2 = document.createElement("div");
      div2.id = "markan_note";
      Object.assign(div2.style, {
        margin: "0.5em auto 0",
        maxWidth: "70ch",
        display: "block",
        visibility: "visible"
      });
      div2.textContent =
        "Within the Markan priority, the role of Mark in the content of Matthew and Luke can be explained by the two-source or the Farrer hypothesis...";
      const after = byId("synoptic_note") || box;
      after.insertAdjacentElement("afterend", div2);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    styleJohnHeadersLighterGray();
    ensurePriorityUI();
  });
})();
