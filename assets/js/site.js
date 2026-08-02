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

// V1.1 interaction layer
(() => {
  "use strict";

  const interactiveSelectors = [
    ".technology-tile",
    ".solution-card",
    ".capability-grid article",
    ".metrics article",
    ".info-panel",
    ".diagram-panel",
    ".career-entry",
    ".contact-grid article",
    ".approach-flow article",
    ".capability-map article",
    ".executive-summary article"
  ].join(",");

  const interactiveCards = Array.from(
    document.querySelectorAll(interactiveSelectors)
  );

  const coarsePointer =
    window.matchMedia("(pointer: coarse)").matches;

  interactiveCards.forEach((card) => {
    if (!coarsePointer) {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty(
          "--mouse-x",
          `${event.clientX - rect.left}px`
        );
        card.style.setProperty(
          "--mouse-y",
          `${event.clientY - rect.top}px`
        );
      });
    }

    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      card.classList.toggle("is-active");
    });
  });

  const architectureNodes = Array.from(
    document.querySelectorAll(".architecture-node")
  );

  architectureNodes.forEach((node) => {
    node.tabIndex = 0;

    const activate = () => {
      const parent = node.parentElement;
      if (parent) {
        Array.from(parent.children).forEach((item) => {
          if (item !== node) item.classList.remove("is-active");
        });
      }
      node.classList.toggle("is-active");
    };

    node.addEventListener("click", activate);
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activate();
      }
    });
  });

  const magneticButtons = Array.from(
    document.querySelectorAll(".button")
  );

  if (!coarsePointer) {
    magneticButtons.forEach((button) => {
      button.addEventListener("pointermove", (event) => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        button.style.transform =
          `translate(${x * 0.06}px, ${y * 0.08}px) translateY(-2px)`;
      });

      button.addEventListener("pointerleave", () => {
        button.style.transform = "";
      });
    });
  }

  const firstHeroActions =
    document.querySelector(".hero .hero-actions");

  if (firstHeroActions && !document.querySelector(".scroll-cue")) {
    const cue = document.createElement("div");
    cue.className = "scroll-cue";
    cue.textContent = "Scroll to explore";
    firstHeroActions.insertAdjacentElement("afterend", cue);
  }
})();

