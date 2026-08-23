// ============================================================
// PORTOFOLIO — M Najat
// Section 1: Hero — outline text per-letter hover effect
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Photo mask reveal: circle follows the cursor ----------
  const photo = document.querySelector('.stage__photo');

  if (photo) {
    const updateReveal = (clientX, clientY) => {
      const rect = photo.getBoundingClientRect();
      const px = (clientX - rect.left) / rect.width;
      const py = (clientY - rect.top) / rect.height;

      const x = px * 100;
      const y = py * 100;
      photo.style.setProperty('--reveal-x', `${x}%`);
      photo.style.setProperty('--reveal-y', `${y}%`);

      // Reveal aktif di seluruh area foto (kepala sampai badan/tangan),
      // ngikutin posisi kursor ke mana pun selama masih di dalam foto.
      photo.classList.add('is-hovering-face');
    };

    photo.addEventListener('mousemove', (e) => {
      updateReveal(e.clientX, e.clientY);
    });

    photo.addEventListener('mouseleave', () => {
      photo.classList.remove('is-hovering-face');
    });

    // touch: reveal follows the finger while pressed
    photo.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      updateReveal(touch.clientX, touch.clientY);
    }, { passive: true });

    photo.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      if (touch) updateReveal(touch.clientX, touch.clientY);
    }, { passive: true });

    photo.addEventListener('touchend', () => {
      photo.classList.remove('is-hovering-face');
    });

    // keyboard focus: reveal centered on the photo
    photo.addEventListener('focus', () => {
      photo.style.setProperty('--reveal-x', '50%');
      photo.style.setProperty('--reveal-y', '58%');
      photo.classList.add('is-hovering-face');
    });

    photo.addEventListener('blur', () => {
      photo.classList.remove('is-hovering-face');
    });
  }

  // ---------- Interactive Spidey Logo ----------
  const logoLetters = document.querySelectorAll('.spidey-logo__bottom span');
  const heroGrid = document.querySelector('.hero__grid');
  const LOGO_HOVER_RADIUS = 50; // Jarak kursor dalam px untuk menyalakan huruf

  if (logoLetters.length > 0 && heroGrid) {
    const lightNearbyLetters = (clientX, clientY) => {
      logoLetters.forEach((span) => {
        const rect = span.getBoundingClientRect();
        // Pusat huruf
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(clientX - cx, clientY - cy);
        span.classList.toggle('is-lit', dist < LOGO_HOVER_RADIUS);
      });
    };

    const clearLetters = () => {
      logoLetters.forEach((span) => span.classList.remove('is-lit'));
    };

    heroGrid.addEventListener('mousemove', (e) => {
      lightNearbyLetters(e.clientX, e.clientY);
    });
    heroGrid.addEventListener('mouseleave', clearLetters);

    // Support sentuhan di HP
    heroGrid.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      if (touch) lightNearbyLetters(touch.clientX, touch.clientY);
    }, { passive: true });
    heroGrid.addEventListener('touchend', clearLetters);
  }


  // ---------- Spider-Man Puller Effect ----------
  const spideyPuller = document.getElementById('spidey-puller');
  const sectionTwo = document.getElementById('section-two');

  if (spideyPuller && sectionTwo) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      
      // Deteksi sedang scroll (untuk efek jaring putus-putus)
      if (scrollY > 50) {
        document.body.classList.add('is-scrolling');
      } else {
        document.body.classList.remove('is-scrolling');
      }

      const containerRect = sectionTwo.getBoundingClientRect();
      
      // Logika kemunculan Spidey Puller (berpatokan pada posisi sectionTwo)
      // Tambahkan toleransi 10px agar jika scroll kembali ke paling atas, Spidey pasti ditarik.
      if (containerRect.top >= window.innerHeight - 10) {
          spideyPuller.classList.remove('is-visible');
      } else if (containerRect.top > 0) {
          spideyPuller.classList.add('is-visible');
      } else {
          spideyPuller.classList.remove('is-visible');
      }

    }, { passive: true });
  }

});

// ================= PROGRESS BAR ANIMATION (SECTION 3) =================
document.addEventListener("DOMContentLoaded", () => {
    /* ================= PROGRESS BAR ANIMATION ================= */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // Jika elemen tersebut punya progress bar, jalankan animasinya
                const progressBar = entry.target.querySelector('.skill-progress-bar');
                if (progressBar) {
                    const targetWidth = progressBar.getAttribute('data-width');
                    setTimeout(() => {
                        progressBar.style.width = targetWidth;
                    }, 300); // Sedikit delay agar efek fadeUp selesai dulu
                }
            }
        });
    }, {
        threshold: 0.2
    });

    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        observer.observe(card);
    });

    /* ================= SECTION 4: PROJECT FILTERS ================= */
    const filterBtns = document.querySelectorAll('.s4-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Hapus class active dari semua tombol
            filterBtns.forEach(b => b.classList.remove('active'));
            // Tambahkan class active ke tombol yang diklik
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'flex';
                } else {
                    if (card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    /* ================= SECTION 4: ROW HOVER SYNC ================= */
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const rect = card.getBoundingClientRect();
            projectCards.forEach(c => {
                // Pastikan card yang dicek sedang tampil (tidak di-filter) 
                // dan berada di baris yang sama (toleransi perbedaan Y sebesar 10px)
                if (c.style.display !== 'none' && Math.abs(c.getBoundingClientRect().top - rect.top) < 10) {
                    c.classList.add('row-hover');
                }
            });
        });
        card.addEventListener('mouseleave', () => {
            projectCards.forEach(c => c.classList.remove('row-hover'));
        });
    });

    /* ================= SECTION 5: CONTACT FORM (EmailJS) ================= */
    const contactForm = document.querySelector('.s5-form');
    if (contactForm) {
        // Konfigurasi EmailJS
        const EMAILJS_PUBLIC_KEY = 'QJTtRS5QX6qOH_Sm3';
        const EMAILJS_SERVICE_ID = 'service_ln50p2c';
        const EMAILJS_TEMPLATE_ID = 'template_jre50eu';

        if (window.emailjs) {
            emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
        }

        const submitBtn = contactForm.querySelector('.btn-submit');
        const statusEl = contactForm.querySelector('.s5-form-status');
        const submitBtnDefaultText = submitBtn ? submitBtn.innerHTML : '';

        function setStatus(message, type) {
            if (!statusEl) return;
            statusEl.textContent = message;
            statusEl.className = 's5-form-status' + (type ? ` s5-form-status--${type}` : '');
        }

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Mencegah halaman reload

            if (!window.emailjs) {
                setStatus('Gagal memuat layanan email. Coba lagi nanti.', 'error');
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'MENGIRIM...';
            }
            setStatus('Sedang mengirim pesan...', 'sending');

            emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm)
                .then(function() {
                    setStatus('Pesan berhasil terkirim! Terima kasih sudah menghubungi. 🕷️', 'success');
                    contactForm.reset();
                })
                .catch(function(error) {
                    console.error('EmailJS error:', error);
                    setStatus('Gagal mengirim pesan. Coba lagi atau kirim email langsung.', 'error');
                })
                .finally(function() {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = submitBtnDefaultText;
                    }
                });
        });
    }

});

// ============================================================
// Comic Navbar & Back to Top Scroll Effect
// ============================================================
window.addEventListener('scroll', () => {
    // Navbar darkening
    const nav = document.getElementById('navbar-inner');
    if (nav) {
        if (window.scrollY > 50) {
            nav.style.backgroundColor = '#0f2063'; // Darker blue
        } else {
            nav.style.backgroundColor = '#1E40C4'; // Original blue
        }
    }

    // Back to Top Button visibility
    const backToTopBtn = document.getElementById('btn-back-to-top');
    if (backToTopBtn) {
        if (window.scrollY > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.pointerEvents = 'auto';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.pointerEvents = 'none';
        }
    }
});

// ============================================================
// Mobile Hamburger Menu Toggle
// ============================================================
function closeMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.classList.remove('is-active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
            const isActive = hamburgerBtn.classList.toggle('is-active');
            hamburgerBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            mobileMenu.classList.toggle('is-open');
            // Prevent body scroll when menu is open
            document.body.style.overflow = isActive ? 'hidden' : '';
        });
    }
});