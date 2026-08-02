(() => {
  "use strict";

  const all = (selector, scope = document) =>
    Array.from(scope.querySelectorAll(selector));

  const header = document.querySelector(".site-header");
  const updateHeader = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  all("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const progress = document.createElement("div");
  progress.className = "page-progress";
  document.body.appendChild(progress);

  const updateProgress = () => {
    const available =
      document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width =
      `${available > 0 ? Math.min(100, Math.max(0, window.scrollY / available * 100)) : 0}%`;
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  const revealItems = all(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });

    revealItems.forEach((item, index) => {
      item.style.setProperty("--delay", `${Math.min(index * 30, 180)}ms`);
      observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  const filterButtons = all("[data-filter]");
  const solutionCards = all("[data-category]");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;

      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      solutionCards.forEach((card) => {
        card.hidden =
          category !== "All" && card.dataset.category !== category;
      });
    });
  });
})();
