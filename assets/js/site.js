/* global document, window, localStorage */
(function () {
  const root = document.documentElement;

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (_) {}
  }

  function initTheme() {
    let theme = null;
    try {
      theme = localStorage.getItem("theme");
    } catch (_) {}

    if (!theme) {
      theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    setTheme(theme);
  }

  function initNav() {
    const topbar = document.querySelector("[data-topbar]");
    const toggle = document.querySelector("[data-nav-toggle]");
    if (!topbar || !toggle) return;

    toggle.addEventListener("click", () => {
      const open = topbar.getAttribute("data-open") === "true";
      topbar.setAttribute("data-open", open ? "false" : "true");
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
    });
  }

  function initThemeToggle() {
    const btn = document.querySelector("[data-theme-toggle]");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      setTheme(next);
    });
  }

  function initNewsletterForms() {
    const forms = document.querySelectorAll('form[data-form="newsletter"]');
    for (const form of forms) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const out = form.querySelector("[data-form-out]");
        if (!out) return;
        out.hidden = false;
        out.classList.add("ok");
        out.textContent = "Thanks — you’re on the list (demo). Connect Mailchimp/ConvertKit to make it live.";
        form.reset();
      });
    }
  }

  function initFilters() {
    const scope = document.querySelector("[data-filter-scope]");
    if (!scope) return;
    const query = scope.querySelector("[data-filter-query]");
    const chips = Array.from(scope.querySelectorAll("[data-filter-chip]"));
    const items = Array.from(scope.querySelectorAll("[data-filter-item]"));
    let active = "all";

    function apply() {
      const q = (query ? query.value : "").trim().toLowerCase();
      for (const el of items) {
        const tags = (el.getAttribute("data-tags") || "").toLowerCase();
        const text = (el.textContent || "").toLowerCase();
        const matchesChip = active === "all" || tags.split(",").map((s) => s.trim()).includes(active);
        const matchesQuery = !q || text.includes(q) || tags.includes(q);
        el.hidden = !(matchesChip && matchesQuery);
      }
    }

    if (query) {
      query.addEventListener("input", apply);
    }
    for (const chip of chips) {
      chip.addEventListener("click", () => {
        active = chip.getAttribute("data-filter-chip") || "all";
        for (const c of chips) c.setAttribute("aria-pressed", c === chip ? "true" : "false");
        apply();
      });
    }
    apply();
  }

  initTheme();
  initNav();
  initThemeToggle();
  initNewsletterForms();
  initFilters();
})();

