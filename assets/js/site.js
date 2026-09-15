(function () {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    if (toggle) {
      const isEnglish = root.lang.toLowerCase().startsWith("en");
      const label = isEnglish
        ? (theme === "dark" ? "Switch to light mode" : "Switch to dark mode")
        : (theme === "dark" ? "切换到日间模式" : "切换到夜间模式");
      toggle.setAttribute("aria-label", label);
      toggle.setAttribute("title", label);
    }
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setTheme(root.dataset.theme === "dark" ? "light" : "dark");
    });
  }

  const reveals = document.querySelectorAll(".reveal");
  const immediate = document.querySelectorAll(".reveal-immediate");
  immediate.forEach(function (element) {
    requestAnimationFrame(function () {
      element.classList.add("is-visible");
    });
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (element) {
      element.classList.add("is-visible");
    });
  } else {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    reveals.forEach(function (element) {
      if (!element.classList.contains("reveal-immediate")) observer.observe(element);
    });
  }

  const portrait = document.querySelector(".hero-portrait");
  if (portrait && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    portrait.addEventListener("pointermove", function (event) {
      const rect = portrait.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
      portrait.style.setProperty("--photo-x", x.toFixed(2) + "px");
      portrait.style.setProperty("--photo-y", y.toFixed(2) + "px");
    });

    portrait.addEventListener("pointerleave", function () {
      portrait.style.setProperty("--photo-x", "0px");
      portrait.style.setProperty("--photo-y", "0px");
    });
  }
})();
