(() => {
  const root = document.documentElement;
  const themeBtn = document.getElementById("theme-toggle");
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  const filterBtns = document.querySelectorAll("[data-filter]");
  const projectCards = document.querySelectorAll(".project-card");
  const projectCount = document.getElementById("project-count");
  const contactForm = document.getElementById("contact-form");
  const contactStatus = document.getElementById("contact-status");
  const copyTimers = new WeakMap();

  const syncThemeSwitch = () => {
    const isDark = root.getAttribute("data-theme") !== "light";
    const colorSchemeMeta = document.getElementById("color-scheme-meta");
    if (colorSchemeMeta) {
      colorSchemeMeta.setAttribute("content", isDark ? "dark" : "light");
    }
    const existingLock = document.getElementById("darkreader-lock-meta");
    if (isDark && !existingLock) {
      const lock = document.createElement("meta");
      lock.id = "darkreader-lock-meta";
      lock.name = "darkreader-lock";
      document.head.appendChild(lock);
    } else if (!isDark && existingLock) {
      existingLock.remove();
    }
    if (!themeBtn) return;
    themeBtn.setAttribute("aria-checked", String(isDark));
    themeBtn.setAttribute("aria-label", isDark ? "Dark mode enabled, switch to light mode" : "Light mode enabled, switch to dark mode");
  };
  syncThemeSwitch();

  themeBtn?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("portfolio-theme", next);
    } catch {}
    syncThemeSwitch();
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

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.filter || "all";
      let visible = 0;
      projectCards.forEach((card) => {
        const cats = (card.dataset.categories || "").split(",");
        const match = category === "all" || cats.includes(category);
        card.hidden = !match;
        if (match) visible += 1;
      });
      filterBtns.forEach((b) => {
        b.setAttribute("aria-pressed", String(b.dataset.filter === category));
      });
      if (projectCount) {
        projectCount.textContent = `${visible} project${visible === 1 ? "" : "s"}`;
      }
    });
  });

  document.querySelectorAll("[data-copy-email]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const email = btn.dataset.copyEmail || "";
      const targetEl = btn.dataset.statusTarget && document.getElementById(btn.dataset.statusTarget);
      let msg = "Copied to clipboard";
      try {
        await navigator.clipboard.writeText(email);
      } catch {
        msg = email;
      }
      if (!targetEl) return;
      clearTimeout(copyTimers.get(targetEl));
      targetEl.textContent = msg;
      copyTimers.set(
        targetEl,
        setTimeout(() => {
          targetEl.textContent = "";
        }, 2500)
      );
    });
  });

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const recipient = contactForm.dataset.email || "";
    const name = document.getElementById("msg-name")?.value.trim() || "";
    const replyEmail = document.getElementById("msg-email")?.value.trim() || "";
    const subject = document.getElementById("msg-subject")?.value.trim() || "Portfolio inquiry";
    const bodyText = document.getElementById("msg-body")?.value.trim() || "";
    const meta = [name ? `From: ${name}` : "", replyEmail ? `Reply-To: ${replyEmail}` : ""].filter(Boolean).join("\n");
    const fullBody = meta ? `${meta}\n\n${bodyText}` : bodyText;
    if (contactStatus) {
      contactStatus.textContent = `Opening your email client... If nothing opens, email ${recipient} directly or use Copy email below.`;
    }
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullBody)}`;
  });

  document.querySelectorAll("[data-iframe-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const iframe = document.getElementById(btn.dataset.iframeToggle);
      if (!iframe) return;
      const pressed = btn.getAttribute("aria-pressed") === "true";
      const currentSrc = iframe.getAttribute("src") || "";
      iframe.setAttribute("src", btn.dataset.altSrc || "");
      btn.dataset.altSrc = currentSrc;
      [btn.textContent, btn.dataset.altText] = [btn.dataset.altText, btn.textContent];
      btn.setAttribute("aria-pressed", String(!pressed));

      const bar = btn.dataset.barTarget && document.getElementById(btn.dataset.barTarget);
      if (bar && btn.dataset.altBar) {
        [bar.textContent, btn.dataset.altBar] = [btn.dataset.altBar, bar.textContent];
      }
    });
  });
})();
