import gsap from "gsap";

document.addEventListener("DOMContentLoaded", () => {
  revealTransition();

  function revealTransition() {
    return new Promise((resolve) => {
      gsap.set(".transition-overlay", { scaleY: 1, transformOrigin: "top" });
      gsap.to(".transition-overlay", {
        scaleY: 0,
        duration: 0.6,
        stagger: -0.1,
        ease: "power2.inOut",
        onComplete: resolve,
      });
    });
  }

  function animateTransition() {
    return new Promise((resolve) => {
      gsap.set(".transition-overlay", { scaleY: 0, transformOrigin: "bottom" });
      gsap.to(".transition-overlay", {
        scaleY: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.inOut",
        onComplete: resolve,
      });
    });
  }

  function closeMenuIfOpen() {
    const menuToggleBtn = document.querySelector(".menu-toggle-btn");
    if (menuToggleBtn && menuToggleBtn.classList.contains("menu-open")) {
      menuToggleBtn.click();
    }
  }

  function isSamePage(href) {
    if (!href || href === "#" || href === "") return true;
    const currentPath = window.location.pathname;
    if (href === currentPath) return true;
    if (
      (currentPath === "/" || currentPath === "/index.html") &&
      (href === "/" || href === "/index.html" || href === "index.html" || href === "./index.html")
    ) {
      return true;
    }
    const currentFileName = currentPath.split("/").pop() || "index.html";
    const hrefFileName = href.split("/").pop();
    if (currentFileName === hrefFileName) return true;
    return false;
  }

  function scrollToTopSmooth() {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (
        href &&
        (href.startsWith("http") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:"))
      ) {
        return;
      }
      if (href === "#" || href === "") {
        return;
      }
      if (isSamePage(href)) {
        event.preventDefault();
        const wasMenuOpen = document
          .querySelector(".menu-toggle-btn")
          ?.classList.contains("menu-open");
        closeMenuIfOpen();
        // If we're already on this page, give visible feedback instead of
        // doing nothing: smooth-scroll back to the top of the page.
        if (window.scrollY > 0) {
          setTimeout(scrollToTopSmooth, wasMenuOpen ? 400 : 0);
        }
        return;
      }
      event.preventDefault();
      animateTransition().then(() => {
        window.location.href = href;
      });
    });
  });
});