import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Coarse pointer = touch device (phones/tablets). Native mobile scrolling
  // is already smooth and reliable — wrapping it with a JS scroll library
  // only adds risk (jank, frozen scroll, fighting with the OS). So Lenis is
  // only used on devices with a real mouse, where its wheel-easing actually
  // adds value. ScrollTrigger works perfectly fine on native scroll with no
  // extra wiring needed.
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const shouldUseLenis = !isCoarsePointer && !prefersReducedMotion;

  if (!shouldUseLenis) {
    // Nothing to do: ScrollTrigger already listens to native scroll events.
    return;
  }

  (async () => {
    try {
      const { default: Lenis } = await import("lenis");

      const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        autoResize: true,
      });

      window.__lenis = lenis;

      lenis.on("scroll", ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          lenis.stop();
        } else {
          lenis.start();
        }
      });

      const menuToggleBtn = document.querySelector(".menu-toggle-btn");
      if (menuToggleBtn) {
        const observer = new MutationObserver(() => {
          if (menuToggleBtn.classList.contains("menu-open")) {
            lenis.stop();
          } else {
            lenis.start();
          }
        });
        observer.observe(menuToggleBtn, {
          attributes: true,
          attributeFilter: ["class"],
        });
      }
    } catch (error) {
      // If Lenis fails to load/init for any reason, fail silently and let
      // the browser's native scroll handle everything — never let a smooth
      // scroll enhancement break the core ability to scroll the page.
      console.warn("Smooth scroll (Lenis) failed to initialize, falling back to native scroll.", error);
    }
  })();
});
