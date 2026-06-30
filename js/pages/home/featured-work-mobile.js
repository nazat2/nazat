document.addEventListener("DOMContentLoaded", () => {
  const isHomePage = document.querySelector(".page.home-page");
  if (!isHomePage) return;

  const track = document.querySelector(".featured-work .featured-titles");
  const dotsContainer = document.querySelector(".featured-carousel-dots");
  if (!track || !dotsContainer) return;

  let slides = [];
  let observer = null;
  let isMobile = window.innerWidth <= 1000;

  const buildDots = () => {
    dotsContainer.innerHTML = "";
    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot";
      dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
      dot.addEventListener("click", () => {
        slides[index].scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      });
      dotsContainer.appendChild(dot);
    });
  };

  const setActive = (activeIndex) => {
    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === activeIndex);
    });
    const dots = dotsContainer.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
    });
  };

  const initObserver = () => {
    if (observer) observer.disconnect();

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const index = slides.indexOf(entry.target);
            if (index !== -1) setActive(index);
          }
        });
      },
      { root: track, threshold: [0.6] }
    );

    slides.forEach((slide) => observer.observe(slide));
  };

  const init = () => {
    slides = Array.from(track.querySelectorAll(".featured-title-wrapper"));
    if (slides.length === 0) return;
    buildDots();
    setActive(0);
    initObserver();
  };

  const teardown = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    dotsContainer.innerHTML = "";
    slides.forEach((slide) => slide.classList.remove("is-active"));
  };

  if (isMobile) init();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const nowMobile = window.innerWidth <= 1000;
      if (nowMobile === isMobile) return;
      isMobile = nowMobile;
      if (isMobile) {
        init();
      } else {
        teardown();
      }
    }, 150);
  });
});
