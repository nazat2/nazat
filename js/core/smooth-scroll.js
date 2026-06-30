import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  // Lenis 1.x option names only — old "smooth"/"smoothTouch"/"direction"/
  // "gestureDirection"/"syncTouch" keys from the v0.x API don't exist anymore
  // and were silently ignored, which is why touch scroll never felt smooth.
  const lenis = new Lenis({
    duration: prefersReducedMotion ? 0.4 : isTouchDevice ? 1 : 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: !prefersReducedMotion,
    syncTouch: false,
    touchMultiplier: 1,
    wheelMultiplier: 1,
    infinite: false,
    autoResize: true,
  });

  // Expose globally so other scripts (e.g. nav "scroll to top" on same page)
  // can reuse the same smooth-scroll instance instead of fighting it.
  window.__lenis = lenis;

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Pause Lenis raf loop while the tab is hidden to save battery on mobile.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      lenis.stop();
    } else {
      lenis.start();
    }
  });

  // Stop Lenis while the mobile menu is open (body is position:fixed) so the
  // two scroll systems never fight each other and cause jank/glitches.
  const menuToggleBtn = document.querySelector(".menu-toggle-btn");
  if (menuToggleBtn) {
    const observer = new MutationObserver(() => {
      if (menuToggleBtn.classList.contains("menu-open")) {
        lenis.stop();
      } else {
        lenis.start();
      }
    });
    observer.observe(menuToggleBtn, { attributes: true, attributeFilter: ["class"] });
  }
});
