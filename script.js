document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // STAGE SPOTLIGHT CURSOR TRACKING
  // ==========================================================================
  const glowPoint = document.querySelector('.glow-point');
  
  if (glowPoint) {
    document.addEventListener('mousemove', (e) => {
      // Offset by half width/height of the radial-gradient container (250px)
      // clientX/clientY gets coordinates relative to viewport
      const x = e.clientX - 250;
      const y = e.clientY - 250;
      glowPoint.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  // ==========================================================================
  // MOBILE NAVIGATION MENU
  // ==========================================================================
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navItems = document.querySelectorAll('.nav-item');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close mobile menu when nav item clicked
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // ==========================================================================
  // SCROLL EFFECTS (NAV BAR SCROLL & SCROLL-REVEAL ACTIVATOR)
  // ==========================================================================
  const header = document.querySelector('.site-header');
  const sections = document.querySelectorAll('section[id]');
  const scrollReveals = document.querySelectorAll('.scroll-reveal');

  // Handle sticky header background transition on scroll
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scroll-nav');
    } else {
      header.classList.remove('scroll-nav');
    }

    // Scroll reveal triggers
    scrollReveals.forEach(reveal => {
      const revealTop = reveal.getBoundingClientRect().top;
      const revealPoint = 150; // offset
      
      if (revealTop < window.innerHeight - revealPoint) {
        reveal.classList.add('active');
      }
    });

    // Navigation item active state updater based on scroll height
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelector(`.nav-menu a[href*=${sectionId}]`)?.classList.add('active');
      } else {
        document.querySelector(`.nav-menu a[href*=${sectionId}]`)?.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  // Trigger once on load to reveal hero / above fold sections
  handleScroll();

  // ==========================================================================
  // ACHIEVEMENTS & CERTIFICATIONS FILTERING
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const achievementCards = document.querySelectorAll('.achievement-card');

  if (filterBtns && achievementCards) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active class on tab buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        // Show/hide cards with clean transitions
        achievementCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // ==========================================================================
  // REUSABLE LIGHTBOX VIEWER (GALLERY & CERTIFICATES)
  // ==========================================================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  
  let currentIdx = 0;
  let activeImageSet = [];
  
  // 1. Gather Gallery Images
  const galleryImages = [];
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('.gallery-img');
    galleryImages.push({
      src: img.src,
      alt: img.alt || `Priyanka Swarna portfolio image ${index + 1}`
    });

    item.addEventListener('click', () => {
      activeImageSet = galleryImages;
      currentIdx = index;
      openLightbox();
    });
  });

  // 2. Gather Certificate Images
  const certButtons = document.querySelectorAll('.view-cert-btn');
  const certThumbnails = document.querySelectorAll('.card-thumbnail-wrapper');
  const certImages = [];
  
  certButtons.forEach((btn, index) => {
    const src = btn.getAttribute('data-cert-src');
    const alt = btn.getAttribute('data-title') || `Certificate ${index + 1}`;
    certImages.push({ src, alt });

    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid parent click bubble
      activeImageSet = certImages;
      currentIdx = index;
      openLightbox();
    });
  });

  // Bind click handlers to certificate thumbnails
  certThumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', (e) => {
      e.stopPropagation();
      activeImageSet = certImages;
      currentIdx = index;
      openLightbox();
    });
  });

  const openLightbox = () => {
    if (!lightbox || !lightboxImg || activeImageSet.length === 0) return;
    updateLightboxImg();
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Lock background scrolling
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto'; // Unlock background scrolling
  };

  const updateLightboxImg = () => {
    if (!lightboxImg || !lightboxCaption || activeImageSet.length === 0) return;
    lightboxImg.src = activeImageSet[currentIdx].src;
    lightboxImg.alt = activeImageSet[currentIdx].alt;
    lightboxCaption.textContent = activeImageSet[currentIdx].alt;
  };

  const navigateLightbox = (direction) => {
    if (activeImageSet.length === 0) return;
    if (direction === 'next') {
      currentIdx = (currentIdx + 1) % activeImageSet.length;
    } else if (direction === 'prev') {
      currentIdx = (currentIdx - 1 + activeImageSet.length) % activeImageSet.length;
    }
    updateLightboxImg();
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox('next'));
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));

  // Close lightbox on backdrop clicks
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation shortcuts
  document.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.style.display !== 'flex') return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      navigateLightbox('next');
    } else if (e.key === 'ArrowLeft') {
      navigateLightbox('prev');
    }
  });

  // ==========================================================================
  // WEB3FORMS CONTACT FORM HANDLER (AJAX SUBMISSION)
  // ==========================================================================
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnSpinner = document.getElementById('btnSpinner');
  const formResponse = document.getElementById('formResponse');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check if access_key is left as default placeholder, alert developer/user
      const accessKeyInput = form.querySelector('input[name="access_key"]');
      if (accessKeyInput && accessKeyInput.value === 'YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
        formResponse.className = 'form-response-msg error';
        formResponse.innerHTML = '<strong>Error:</strong> Form access key not configured. Please get a free key from <a href="https://web3forms.com" target="_blank" style="color: inherit; text-decoration: underline;">Web3Forms</a> and add it to your <code>index.html</code> code.';
        return;
      }

      // Show loader spinner and disable button
      if (submitBtn) submitBtn.disabled = true;
      if (btnSpinner) btnSpinner.style.display = 'inline-block';
      formResponse.style.display = 'none';

      const formData = new FormData(form);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      })
      .then(async (response) => {
        let res = await response.json();
        if (response.status === 200) {
          formResponse.className = 'form-response-msg success';
          formResponse.textContent = "Thank you! Your message has been sent successfully. Priyanka will get back to you shortly.";
          form.reset();
        } else {
          console.error(response);
          formResponse.className = 'form-response-msg error';
          formResponse.textContent = res.message || "An error occurred. Please try again later.";
        }
      })
      .catch((error) => {
        console.error(error);
        formResponse.className = 'form-response-msg error';
        formResponse.textContent = "Unable to send message. Please check your internet connection or email directly.";
      })
      .finally(() => {
        // Hide loader spinner and enable button
        if (submitBtn) submitBtn.disabled = false;
        if (btnSpinner) btnSpinner.style.display = 'none';
      });
    });
  }
});
