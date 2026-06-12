import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  const isAboutPage = document.querySelector(".page.home-page") || document.querySelector(".about-hero");
  if (!isAboutPage) return;

  gsap.registerPlugin(ScrollTrigger);

  let scrollTriggerInstances = [];

  const initAnimations = () => {
    scrollTriggerInstances.forEach((instance) => {
      if (instance) instance.kill();
    });
    scrollTriggerInstances = [];

    if (window.innerWidth > 1000) {
      const portraitElement = document.querySelector(".about-hero-portrait");
      if (portraitElement) {
        const portraitAnimation = gsap.to(".about-hero-portrait", {
          y: -200,
          rotation: -25,
          scrollTrigger: {
            trigger: ".about-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
        scrollTriggerInstances.push(portraitAnimation.scrollTrigger);
      }
    }
  };

  initAnimations();
  window.addEventListener("resize", () => { initAnimations(); });
});