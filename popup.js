// Form Field Counter - MV3 popup. Injects a counting function into the active tab on click only.
function countForms() {
  const SKIP_TYPES = new Set(["hidden", "submit", "button", "reset", "image"]);
  function visible(el) {
    const s = getComputedStyle(el);
    if (s.display === "none" || s.visibility === "hidden") return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }
  const forms = Array.from(document.forms);
  // Also treat a page with orphan inputs (no <form>) as one pseudo-form.
  const orphans = Array.from(document.querySelectorAll("input,select,textarea")).filter(
    (el) => !el.form && !SKIP_TYPES.has((el.type || "").toLowerCase()) && visible(el)
  );
  const groups = forms.map((f, i) => ({
    name: f.getAttribute("name") || f.id || "form #" + (i + 1),
    fields: Array.from(f.elements).filter(
      (el) => /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName) && !SKIP_TYPES.has((el.type || "").toLowerCase())
    )
  }));
  if (orphans.length) groups.push({ name: "inputs outside a <form>", fields: orphans });
  return groups
    .map((g) => {
      // Radios with the same name count as one field.
      const seen = new Set();
      const vis = g.fields.filter((el) => {
        if (!visible(el)) return false;
        if ((el.type || "").toLowerCase() === "radio") {
          if (seen.has(el.name)) return false;
          seen.add(el.name);
        }
        return true;
      });
      return {
        name: g.name,
        total: vis.length,
        required: vis.filter((el) => el.required || el.getAttribute("aria-required") === "true").length,
        hiddenCount: g.fields.length - vis.length,
        textareas: vis.filter((el) => el.tagName === "TEXTAREA").length
      };
    })
    .filter((g) => g.total > 0);
}

function grade(total) {
  if (total <= 5) return ["ok", "Good for mobile (5 or fewer)"];
  if (total <= 8) return ["warn", "Trim if you can (6-8)"];
  return ["bad", "Long for mobile (9+)"];
}

(async () => {
  const out = document.getElementById("out");
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const res = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: countForms });
    const groups = (res && res[0] && res[0].result) || [];
    if (!groups.length) { out.textContent = "No visible form fields found on this page."; return; }
    out.innerHTML = "";
    const lines = [tab.url];
    groups.forEach((g) => {
      const [cls, msg] = grade(g.total);
      const d = document.createElement("div");
      d.className = "form " + cls;
      d.innerHTML = "<b></b><div></div><div class='muted'></div>";
      d.querySelector("b").textContent = g.name;
      d.children[1].textContent = g.total + " visible fields, " + g.required + " required";
      d.children[2].textContent = msg;
      out.appendChild(d);
      lines.push(g.name + ": " + g.total + " fields, " + g.required + " required - " + msg);
    });
    const b = document.getElementById("copy");
    b.hidden = false;
    b.onclick = () => navigator.clipboard.writeText(lines.join("\n"));
  } catch (e) {
    out.textContent = "Cannot scan this page (browser pages and the Web Store are blocked by Chrome).";
  }
})();
