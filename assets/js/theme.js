(() => {
  const root = document.documentElement;
  try {
    const saved = localStorage.getItem("portfolio-theme");
    if (saved === "light" || saved === "dark") {
      root.setAttribute("data-theme", saved);
      if (saved === "light") {
        document.getElementById("color-scheme-meta")?.setAttribute("content", "light");
        document.getElementById("darkreader-lock-meta")?.remove();
      }
    }
  } catch {}
  if (window.self !== window.top || new URLSearchParams(window.location.search).has("embed")) {
    root.setAttribute("data-embed", "true");
  }
})();
