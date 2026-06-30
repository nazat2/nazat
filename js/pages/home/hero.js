import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  const isHomePage = document.querySelector(".page.home-page");
  if (!isHomePage) return;

  gsap.registerPlugin(ScrollTrigger);

  const heroImg = document.querySelector(".hero-img img");
  const heroImgHolder = document.querySelector(".hero-img-holder");
  let currentImageIndex = 1;
  const totalImages = 10;
  let scrollTriggerInstance = null;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (heroImg) {
    let rotationTimer = null;
    let isVisible = true;
    const intervalMs = prefersReducedMotion ? 1200 : 250;

    const startRotation = () => {
      if (rotationTimer) return;
      rotationTimer = setInterval(() => {
        currentImageIndex = currentImageIndex >= totalImages ? 1 : currentImageIndex + 1;
        heroImg.src = `/images/work-items/work-item-${currentImageIndex}.jpg`;
      }, intervalMs);
    };

    const stopRotation = () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
        rotationTimer = null;
      }
    };

    if (heroImgHolder && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
            if (isVisible && document.visibilityState === "visible") {
              startRotation();
            } else {
              stopRotation();
            }
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(heroImgHolder);
    } else {
      startRotation();
    }

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && isVisible) {
        startRotation();
      } else {
        stopRotation();
      }
    });
  }

  const initAnimations = () => {
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
    }

    scrollTriggerInstance = ScrollTrigger.create({
      trigger: ".hero-img-holder",
      start: "top bottom",
      end: "top top",
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.set(".hero-img", {
          y: `${-110 + 110 * progress}%`,
          scale: 0.25 + 0.75 * progress,
          rotation: -15 + 15 * progress,
        });
      },
    });
  };

  initAnimations();
  window.addEventListener("resize", () => { initAnimations(); });
});