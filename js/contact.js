import emailjs from '@emailjs/browser';

document.addEventListener("DOMContentLoaded", () => {
  const isContactPage = document.querySelector(".page.contact-page");
  if (!isContactPage) return;

  // ========== EMAILJS INIT ==========
  emailjs.init("d2oi_fcBXnjBWkW8Z");

  // ========== MOUSE TRAIL CONFIG ==========
  const container = document.querySelector(".trail-container");
  let isDesktop = window.innerWidth > 1000;
  let animationId = null;
  let mouseMoveListener = null;

  const config = {
    imageCount: 8,
    imageLifespan: 800,
    removalDelay: 60,
    mouseThreshold: 80,
    inDuration: 600,
    outDuration: 800,
    inEasing: "cubic-bezier(.07,.5,.5,1)",
    outEasing: "cubic-bezier(.87, 0, .13, 1)",
  };

  const images = Array.from(
    { length: config.imageCount },
    (_, i) => `/images/work-items/work-item-${i + 1}.jpg`
  );
  const trail = [];
  let mouseX = 0, mouseY = 0, lastMouseX = 0, lastMouseY = 0;
  let isCursorInContainer = false;
  let lastRemovalTime = 0;

  // ========== FLOATING ELEMENTS ==========
  const createFloatingElements = () => {
    const floatingContainer = document.querySelector(".floating-elements");
    if (!floatingContainer) return;
    for (let i = 0; i < 12; i++) {
      const element = document.createElement("div");
      element.className = "floating-element";
      element.style.left = Math.random() * 100 + "%";
      element.style.animationDelay = Math.random() * 8 + "s";
      element.style.animationDuration = 8 + Math.random() * 4 + "s";
      floatingContainer.appendChild(element);
    }
  };

  // ========== MOUSE TRAIL FUNCTIONS ==========
  const isInContainer = (x, y) => {
    if (!container) return false;
    const rect = container.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  };

  const hasMovedEnough = () => {
    const distance = Math.sqrt(Math.pow(mouseX - lastMouseX, 2) + Math.pow(mouseY - lastMouseY, 2));
    return distance > config.mouseThreshold;
  };

  const createImage = () => {
    if (!container) return;
    const img = document.createElement("img");
    img.classList.add("trail-img");
    const randomIndex = Math.floor(Math.random() * images.length);
    const rotation = (Math.random() - 0.5) * 40;
    img.src = images[randomIndex];
    const rect = container.getBoundingClientRect();
    const relativeX = mouseX - rect.left;
    const relativeY = mouseY - rect.top;
    img.style.left = `${relativeX}px`;
    img.style.top = `${relativeY}px`;
    img.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(0)`;
    img.style.transition = `transform ${config.inDuration}ms ${config.inEasing}`;
    container.appendChild(img);
    setTimeout(() => {
      img.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(1)`;
    }, 10);
    trail.push({ element: img, rotation: rotation, removeTime: Date.now() + config.imageLifespan });
  };

  const removeOldImages = () => {
    const now = Date.now();
    if (now - lastRemovalTime < config.removalDelay || trail.length === 0) return;
    const oldestImage = trail.shift();
    oldestImage.element.style.transition = `transform ${config.outDuration}ms ${config.outEasing}`;
    oldestImage.element.style.transform = `translate(-50%, -50%) rotate(${oldestImage.rotation}deg) scale(0)`;
    lastRemovalTime = now;
    setTimeout(() => {
      if (oldestImage.element.parentNode) {
        oldestImage.element.parentNode.removeChild(oldestImage.element);
      }
    }, config.outDuration);
  };

  const startAnimation = () => {
    if (!isDesktop) return;
    mouseMoveListener = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isCursorInContainer = isInContainer(mouseX, mouseY);
      if (isCursorInContainer && hasMovedEnough()) {
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        createImage();
      }
    };
    document.addEventListener("mousemove", mouseMoveListener);
    const animate = () => {
      removeOldImages();
      animationId = requestAnimationFrame(animate);
    };
    animate();
  };

  const stopAnimation = () => {
    if (mouseMoveListener) {
      document.removeEventListener("mousemove", mouseMoveListener);
      mouseMoveListener = null;
    }
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    trail.forEach((item) => {
      if (item.element.parentNode) {
        item.element.parentNode.removeChild(item.element);
      }
    });
    trail.length = 0;
  };

  // ========== HANDLE RESIZE ==========
  const handleResize = () => {
    const wasDesktop = isDesktop;
    isDesktop = window.innerWidth > 1000;
    if (isDesktop && !wasDesktop) {
      startAnimation();
    } else if (!wasDesktop && isDesktop) {
      stopAnimation();
    }
  };

  // ========== EMAILJS FORM HANDLER ==========
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector(".submit-btn");
    const successMessage = document.getElementById("successMessage");
    const originalBtnText = submitBtn.textContent;
    
    // Animasi loading
    submitBtn.style.transform = "translateY(-1px)";
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;
    
    // Ambil data dari form
    const firstName = document.getElementById("firstName")?.value || "";
    const lastName = document.getElementById("lastName")?.value || "";
    const email = document.getElementById("email")?.value || "";
    const phone = document.getElementById("phone")?.value || "";
    const projectType = document.getElementById("projectType")?.value || "";
    const message = document.getElementById("message")?.value || "";
    
    const fullName = `${firstName} ${lastName}`.trim();
    
    // Template params sesuai dengan template EmailJS lu
    const templateParams = {
      name: fullName || "Tidak disebutkan",
      email: email,
      message: `Project Type: ${projectType}\nPhone: ${phone}\n\nMessage:\n${message}`,
      time: new Date().toLocaleString('id-ID', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
      }),
      to_email: "mnajat0508@gmail.com"
    };
    
    // Kirim via EmailJS
    emailjs.send("service_9measla", "template_67rf4v7", templateParams)
      .then(() => {
        // Sukses
        form.reset();
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.style.transform = "";
        successMessage.classList.add("show");
        setTimeout(() => {
          successMessage.classList.remove("show");
        }, 5000);
      })
      .catch((error) => {
        // Gagal
        console.error("EmailJS Error:", error);
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.style.transform = "";
        alert("❌ Gagal mengirim pesan. Silakan coba lagi nanti.");
      });
  };

  // ========== ENHANCE FORM INPUTS ==========
  const enhanceFormInputs = () => {
    const inputs = document.querySelectorAll(".form-group input, .form-group textarea, .form-group select");
    inputs.forEach((input) => {
      input.addEventListener("focus", () => {
        input.parentElement.style.transform = "translateY(-2px)";
      });
      input.addEventListener("blur", () => {
        input.parentElement.style.transform = "";
      });
    });
  };

  // ========== INITIALIZE ==========
  window.addEventListener("resize", handleResize);
  createFloatingElements();
  enhanceFormInputs();
  
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
  }
  
  if (isDesktop) {
    startAnimation();
  }
});