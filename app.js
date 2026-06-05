/* ==========================================
   IMPACTA DIGITAL - Landing Page JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Register GSAP plugins
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    initAnimations();
  }

  initParticles();
  initCountdown();
  initCarousel();
  initLightbox();
  initForm();
  initStickyCta();
});

/* ==========================================
   PARTICLE BACKGROUND ENGINE
   ========================================== */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let particlesArray = [];
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      // Boundaries check
      if (this.x > w || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > h || this.y < 0) {
        this.directionY = -this.directionY;
      }

      // Mouse interactive collision
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < mouse.radius + this.size) {
        if (mouse.x < this.x && this.x < w - this.size * 10) {
          this.x += 2;
        }
        if (mouse.x > this.x && this.x > this.size * 10) {
          this.x -= 2;
        }
        if (mouse.y < this.y && this.y < h - this.size * 10) {
          this.y += 2;
        }
        if (mouse.y > this.y && this.y > this.size * 10) {
          this.y -= 2;
        }
      }

      // Move particle
      this.x += this.directionX;
      this.y += this.directionY;
      this.draw();
    }
  }

  function init() {
    particlesArray = [];
    let numberOfParticles = (w * h) / 14000;
    // Cap particles limit for performance
    numberOfParticles = Math.min(numberOfParticles, 80);

    for (let i = 0; i < numberOfParticles; i++) {
      let size = Math.random() * 2 + 1;
      let x = Math.random() * (w - size * 2) + size;
      let y = Math.random() * (h - size * 2) + size;
      let directionX = (Math.random() * 0.4) - 0.2;
      let directionY = (Math.random() * 0.4) - 0.2;
      
      // Sophisticated color palette (gold-tinted and red-tinted particles)
      let color = i % 2 === 0 ? 'rgba(197, 168, 128, 0.25)' : 'rgba(116, 1, 8, 0.25)';
      
      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
  }

  init();
  animate();
}

/* ==========================================
   GSAP INTERACTION ANIMATIONS
   ========================================== */
function initAnimations() {
  // Hero load animations
  const heroTl = gsap.timeline();
  
  heroTl.from('#hero-tagline-text', {
    duration: 0.8,
    opacity: 0,
    y: -20,
    ease: 'power3.out'
  })
  .from('#hero-headline', {
    duration: 1,
    opacity: 0,
    y: 30,
    ease: 'power4.out'
  }, '-=0.6')
  .from('#hero-subheadline-text', {
    duration: 0.8,
    opacity: 0,
    y: 20,
    ease: 'power3.out'
  }, '-=0.7')
  .from('.bullet-item', {
    duration: 0.6,
    opacity: 0,
    y: 15,
    stagger: 0.1,
    ease: 'power2.out'
  }, '-=0.6')
  .from('.hero-actions', {
    duration: 0.8,
    opacity: 0,
    y: 20,
    ease: 'power3.out'
  }, '-=0.5')
  .from('#hero-media-wrapper', {
    duration: 1.2,
    opacity: 0,
    scale: 0.95,
    x: 40,
    ease: 'power4.out'
  }, '-=1.1')
  .from('#hero-trust-indicators', {
    duration: 1,
    opacity: 0,
    y: 20,
    ease: 'power3.out'
  }, '-=0.8');

  // Scroll triggered reveals for section headers
  const sections = ['#why-fail', '#what-you-learn', '#transformation', '#about-norlis', '#testimonials', '#register', '#final-cta'];
  
  sections.forEach(sectionId => {
    const subtitle = document.querySelector(`${sectionId} .section-subtitle`);
    const title = document.querySelector(`${sectionId} h2, ${sectionId} h3`);
    const paragraphs = document.querySelectorAll(`${sectionId} > .container > p`);

    const trigger = {
      trigger: sectionId,
      start: 'top 80%',
      toggleActions: 'play none none none'
    };

    if (subtitle) {
      gsap.from(subtitle, {
        scrollTrigger: trigger,
        duration: 0.8,
        opacity: 0,
        y: -15,
        ease: 'power2.out'
      });
    }

    if (title) {
      gsap.from(title, {
        scrollTrigger: trigger,
        duration: 1,
        opacity: 0,
        y: 25,
        ease: 'power3.out',
        delay: 0.1
      });
    }

    if (paragraphs.length > 0) {
      gsap.from(paragraphs, {
        scrollTrigger: trigger,
        duration: 0.8,
        opacity: 0,
        y: 15,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.2
      });
    }
  });

  // Section 2 - Fail Cards Stagger
  gsap.from('.fail-card', {
    scrollTrigger: {
      trigger: '#why-fail',
      start: 'top 70%'
    },
    duration: 0.8,
    opacity: 0,
    y: 40,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // Section 3 - Learn Cards Stagger
  gsap.from('.learn-card', {
    scrollTrigger: {
      trigger: '#what-you-learn',
      start: 'top 70%'
    },
    duration: 0.8,
    opacity: 0,
    y: 30,
    stagger: 0.1,
    ease: 'power3.out'
  });

  // Section 4 - Transformation side-by-side transition
  gsap.from('#transform-panel-before', {
    scrollTrigger: {
      trigger: '#transformation',
      start: 'top 70%'
    },
    duration: 1,
    opacity: 0,
    x: -50,
    ease: 'power3.out'
  });

  gsap.from('#transform-panel-after', {
    scrollTrigger: {
      trigger: '#transformation',
      start: 'top 70%'
    },
    duration: 1,
    opacity: 0,
    x: 50,
    ease: 'power3.out'
  });

  // Section 5 - About Norlis Coa Portrait & Text
  gsap.from('#about-img-container', {
    scrollTrigger: {
      trigger: '#about-norlis',
      start: 'top 70%'
    },
    duration: 1.2,
    opacity: 0,
    scale: 0.95,
    x: -30,
    ease: 'power3.out'
  });

  gsap.from('#about-text-container > *', {
    scrollTrigger: {
      trigger: '#about-norlis',
      start: 'top 70%'
    },
    duration: 0.8,
    opacity: 0,
    y: 20,
    stagger: 0.15,
    ease: 'power2.out'
  });

  // Section 7 - Registration Form reveal
  gsap.from('#register-card-wrapper', {
    scrollTrigger: {
      trigger: '#register',
      start: 'top 75%'
    },
    duration: 1,
    opacity: 0,
    y: 50,
    scale: 0.98,
    ease: 'power3.out'
  });

  // Section 8 - Final CTA Card reveal
  gsap.from('#final-cta-card-element', {
    scrollTrigger: {
      trigger: '#final-cta',
      start: 'top 80%'
    },
    duration: 1.2,
    opacity: 0,
    y: 40,
    ease: 'power3.out'
  });
}

/* ==========================================
   PERSISTENT COUNTDOWN TIMER (15 Minutes)
   ========================================== */
function initCountdown() {
  const hoursEl = document.getElementById('timer-hours');
  const minutesEl = document.getElementById('timer-minutes');
  const secondsEl = document.getElementById('timer-seconds');
  
  if (!hoursEl || !minutesEl || !secondsEl) return;

  const COUNTDOWN_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds
  let endTime = localStorage.getItem('impacta_cta_timer');

  if (!endTime) {
    endTime = Date.now() + COUNTDOWN_TIME;
    localStorage.setItem('impacta_cta_timer', endTime);
  } else {
    // If elapsed, reset timer for urgency (or let it stay 00:00:00. Resetting is better for evergreen conversions)
    if (Date.now() > parseInt(endTime)) {
      endTime = Date.now() + COUNTDOWN_TIME;
      localStorage.setItem('impacta_cta_timer', endTime);
    }
  }

  function updateTimer() {
    const timeRemaining = parseInt(endTime) - Date.now();

    if (timeRemaining <= 0) {
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      
      // Auto-restart timer for next potential session (keeps page evergreen)
      localStorage.setItem('impacta_cta_timer', Date.now() + COUNTDOWN_TIME);
      endTime = localStorage.getItem('impacta_cta_timer');
      return;
    }

    const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
    const seconds = Math.floor((timeRemaining / 1000) % 60);

    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================
   TESTIMONIAL CAROUSEL
   ========================================== */
function initCarousel() {
  const track = document.getElementById('testimonials-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (!track || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  const cards = document.querySelectorAll('.testimonial-card');
  const totalCards = cards.length;

  function getCardsPerView() {
    return window.innerWidth > 1024 ? 2 : 1;
  }

  function updateCarouselPosition() {
    const cardsPerView = getCardsPerView();
    const maxIndex = totalCards - cardsPerView;
    
    // Safety check for index
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    let percentageToShift;
    if (cardsPerView === 2) {
      // Shift by half container width + gap spacing
      percentageToShift = currentIndex * 50;
      track.style.transform = `translateX(calc(-${percentageToShift}% - ${currentIndex * 1}rem))`;
    } else {
      percentageToShift = currentIndex * 100;
      track.style.transform = `translateX(calc(-${percentageToShift}% - ${currentIndex * 2}rem))`;
    }
  }

  nextBtn.addEventListener('click', () => {
    const cardsPerView = getCardsPerView();
    if (currentIndex < totalCards - cardsPerView) {
      currentIndex++;
    } else {
      currentIndex = 0; // Wrap around
    }
    updateCarouselPosition();
  });

  prevBtn.addEventListener('click', () => {
    const cardsPerView = getCardsPerView();
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = totalCards - cardsPerView; // Wrap around
    }
    updateCarouselPosition();
  });

  window.addEventListener('resize', updateCarouselPosition);
}

/* ==========================================
   VIDEO LIGHTBOX MODAL
   ========================================== */
function initLightbox() {
  const modal = document.getElementById('video-lightbox-modal');
  const videoTriggerBtn = document.getElementById('cta-hero-secondary');
  const videoThumbContainer = document.getElementById('video-thumbnail-container');
  const closeBtn = document.getElementById('btn-close-modal');
  const iframe = document.getElementById('modal-video-iframe');

  if (!modal || !closeBtn || !iframe) return;

  // Premium corporate video embed
  // This is a premium branding/aesthetic portfolio video loop from YouTube
  const videoUrl = 'https://www.youtube.com/embed/3Q3A7_F7wO0?autoplay=1&rel=0&modestbranding=1';

  function openModal() {
    modal.classList.add('active');
    iframe.src = videoUrl;
    document.body.style.overflow = 'hidden'; // Lock scrolling
  }

  function closeModal() {
    modal.classList.remove('active');
    iframe.src = ''; // Stop video
    document.body.style.overflow = ''; // Unlock scrolling
  }

  if (videoTriggerBtn) videoTriggerBtn.addEventListener('click', openModal);
  if (videoThumbContainer) videoThumbContainer.addEventListener('click', openModal);

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* ==========================================
   LEAD REGISTRATION FORM HANDLER
   ========================================== */
function initForm() {
  const form = document.getElementById('lead-form');
  const formContentArea = document.getElementById('form-content-area');
  const successScreen = document.getElementById('form-success-screen');
  const whatsappButton = document.getElementById('btn-success-whatsapp');

  if (!form || !formContentArea || !successScreen) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('form-input-name');
    const whatsappInput = document.getElementById('form-input-whatsapp');
    const emailInput = document.getElementById('form-input-email');

    let isValid = true;

    // Reset styles
    [nameInput, whatsappInput, emailInput].forEach(input => {
      input.style.borderColor = '';
    });

    // Simple validation
    if (!nameInput.value.trim()) {
      nameInput.style.borderColor = '#ff3333';
      isValid = false;
    }
    if (!whatsappInput.value.trim()) {
      whatsappInput.style.borderColor = '#ff3333';
      isValid = false;
    }
    if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
      emailInput.style.borderColor = '#ff3333';
      isValid = false;
    }

    if (!isValid) return;

    // Simulate Lead Capture Storage & Processing
    const leadData = {
      name: nameInput.value.trim(),
      whatsapp: whatsappInput.value.trim(),
      email: emailInput.value.trim(),
      timestamp: new Date().toISOString()
    };

    console.log('Lead captured successfully:', leadData);

    // Save lead to local storage (mock DB)
    let leads = JSON.parse(localStorage.getItem('impacta_leads') || '[]');
    leads.push(leadData);
    localStorage.setItem('impacta_leads', JSON.stringify(leads));

    // Customize WhatsApp success message
    if (whatsappButton) {
      const messageText = encodeURIComponent(
        `Hola Norlis! Acabo de registrarme para la asesoría estratégica gratuita por Zoom de Impacta Digital. Mi nombre es ${leadData.name} y mi correo es ${leadData.email}. ¡Espero la confirmación de mi cupo!`
      );
      // Constructing WhatsApp redirection link
      whatsappButton.href = `https://api.whatsapp.com/send?phone=51987654321&text=${messageText}`;
    }

    // Success Screen Transition Animation
    gsap.to(formContentArea, {
      duration: 0.4,
      opacity: 0,
      y: -20,
      onComplete: () => {
        formContentArea.style.display = 'none';
        successScreen.style.display = 'block';
        gsap.fromTo(successScreen, 
          { opacity: 0, y: 20 },
          { duration: 0.6, opacity: 1, y: 0, ease: 'power3.out' }
        );
      }
    });
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
}

/* ==========================================
   STICKY MOBILE CTA BEHAVIOR
   ========================================== */
function initStickyCta() {
  const stickyCta = document.getElementById('mobile-sticky-cta-container');
  const heroSection = document.getElementById('hero');

  if (!stickyCta || !heroSection) return;

  function checkScroll() {
    // Only toggle on mobile viewport
    if (window.innerWidth <= 768) {
      const heroHeight = heroSection.offsetHeight;
      if (window.scrollY > heroHeight - 100) {
        stickyCta.classList.add('show');
      } else {
        stickyCta.classList.remove('show');
      }
    } else {
      stickyCta.classList.remove('show');
    }
  }

  window.addEventListener('scroll', checkScroll);
  window.addEventListener('resize', checkScroll);
}
