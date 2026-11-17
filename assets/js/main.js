(() => {
  const root = document.documentElement;
  const themeBtn = document.getElementById("theme-toggle");
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  const filterBtns = Array.from(document.querySelectorAll("[data-filter]"));
  const projectCards = Array.from(document.querySelectorAll(".project-card"));
  const projectCount = document.getElementById("project-count");
  const copyBtns = Array.from(document.querySelectorAll("[data-copy-email]"));
  const copyStatus = document.getElementById("copy-status");
  const heroCopyStatus = document.getElementById("hero-copy-status");

  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    root.setAttribute("data-theme", savedTheme);
  }

  const syncThemeLabel = () => {
    if (!themeBtn) return;
    const isLight = root.getAttribute("data-theme") === "light";
    themeBtn.textContent = isLight ? "Dark" : "Light";
    themeBtn.setAttribute("aria-pressed", String(isLight));
  };
  syncThemeLabel();

  themeBtn?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("portfolio-theme", next);
    syncThemeLabel();
  });

  navToggle?.addEventListener("click", () => {
    const open = navLinks?.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(Boolean(open)));
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks?.classList.contains("open")) {
      navLinks.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
      navToggle?.focus();
    }
  });

  const applyFilter = (category) => {
    let visible = 0;
    projectCards.forEach((card) => {
      const cats = (card.getAttribute("data-categories") || "").split(",");
      const match = category === "all" || cats.includes(category);
      card.hidden = !match;
      if (match) visible += 1;
    });
    filterBtns.forEach((btn) => {
      const active = btn.getAttribute("data-filter") === category;
      btn.setAttribute("aria-pressed", String(active));
    });
    if (projectCount) {
      projectCount.textContent = `${visible} project${visible === 1 ? "" : "s"}`;
    }
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      applyFilter(btn.getAttribute("data-filter") || "all");
    });
  });

  copyBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const email = btn.getAttribute("data-email") || "abdelrahman.m.magdy@gmail.com";
      const targetId = btn.getAttribute("data-status-target");
      const targetEl = targetId ? document.getElementById(targetId) : copyStatus;
      let msg = "Copied to clipboard";
      try {
        await navigator.clipboard.writeText(email);
      } catch {
        msg = email;
      }
      if (targetEl) targetEl.textContent = msg;
      if (!targetId && heroCopyStatus && btn.id === "hero-copy-email") {
        heroCopyStatus.textContent = msg;
      }
      setTimeout(() => {
        if (targetEl) targetEl.textContent = "";
      }, 2500);
    });
  });
})();
