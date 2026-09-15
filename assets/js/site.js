(function () {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    if (toggle) {
      toggle.setAttribute("aria-label", theme === "dark" ? "切换到浅色模式" : "切换到深色模式");
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

  const plant = document.querySelector(".botanical-stage");
  if (plant && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    plant.addEventListener("pointermove", function (event) {
      const rect = plant.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
      plant.style.setProperty("--plant-x", x.toFixed(2) + "px");
      plant.style.setProperty("--plant-y", y.toFixed(2) + "px");
    });

    plant.addEventListener("pointerleave", function () {
      plant.style.setProperty("--plant-x", "0px");
      plant.style.setProperty("--plant-y", "0px");
    });
  }
})();
