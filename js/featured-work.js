import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  const isHomePage = document.querySelector(".page.home-page");
  if (!isHomePage) return;

  gsap.registerPlugin(ScrollTrigger);

  let scrollTriggerInstance = null;

  const initAnimations = () => {
    if (window.innerWidth <= 1000) {
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
        scrollTriggerInstance = null;
      }
      return;
    }

    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
    }

    const indicatorContainer = document.querySelector(".featured-work-indicator");
    if (indicatorContainer) {
      indicatorContainer.innerHTML = "";
      for (let section = 1; section <= 3; section++) {
        const sectionNumber = document.createElement("p");
        sectionNumber.className = "mn";
        sectionNumber.textContent = `0${section}`;
        indicatorContainer.appendChild(sectionNumber);
        for (let i = 0; i < 10; i++) {
          const indicator = document.createElement("div");
          indicator.className = "indicator";
          indicatorContainer.appendChild(indicator);
        }
      }
    }

    const featuredCardPos = [
      { y: 100, x: 1000 },
      { y: 1500, x: 100 },
      { y: 1250, x: 1950 },
      { y: 1500, x: 850 },
      { y: 200, x: 2100 },
      { y: 250, x: 600 },
      { y: 1100, x: 1650 },
      { y: 1000, x: 800 },
      { y: 900, x: 2200 },
      { y: 150, x: 1600 },
    ];

    const featuredTitles = document.querySelector(".featured-titles");
    const moveDistance = window.innerWidth * 3;

    const imagesContainer = document.querySelector(".featured-images");
    if (imagesContainer) {
      imagesContainer.innerHTML = "";
      for (let i = 1; i <= 10; i++) {
        const featuredImgCard = document.createElement("div");
        featuredImgCard.className = `featured-img-card featured-img-card-${i}`;
        const img = document.createElement("img");
        img.src = `/images/work-items/work-item-${i}.jpg`;
        img.alt = `featured work image ${i}`;
        featuredImgCard.appendChild(img);
        const position = featuredCardPos[i - 1];
        gsap.set(featuredImgCard, { x: position.x, y: position.y });
        imagesContainer.appendChild(featuredImgCard);
      }
    }

    const featuredImgCards = document.querySelectorAll(".featured-img-card");
    featuredImgCards.forEach((featuredImgCard) => {
      gsap.set(featuredImgCard, { z: -1500, scale: 0 });
    });

    scrollTriggerInstance = ScrollTrigger.create({
      trigger: ".featured-work",
      start: "top top",
      end: `+=${window.innerHeight * 4}px`,
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const xPosition = -moveDistance * self.progress;
        if (featuredTitles) gsap.set(featuredTitles, { x: xPosition });

        featuredImgCards.forEach((featuredImgCard, index) => {
          const staggerOffset = index * 0.075;
          const scaledProgress = (self.progress - staggerOffset) * 2;
          const individualProgress = Math.max(0, Math.min(1, scaledProgress));
          const newZ = -1500 + 3000 * individualProgress;
          const scaleProgress = Math.min(1, individualProgress * 10);
          const scale = Math.max(0, Math.min(1, scaleProgress));
          gsap.set(featuredImgCard, { z: newZ, scale: scale });
        });

        const indicators = document.querySelectorAll(".indicator");
        const totalIndicators = indicators.length;
        const progressPerIndicator = 1 / totalIndicators;
        indicators.forEach((indicator, index) => {
          const indicatorStart = index * progressPerIndicator;
          const indicatorOpacity = self.progress > indicatorStart ? 1 : 0.2;
          gsap.to(indicator, { opacity: indicatorOpacity, duration: 0.3 });
        });
      },
    });
  };

  initAnimations();
  window.addEventListener("resize", () => { initAnimations(); });
});