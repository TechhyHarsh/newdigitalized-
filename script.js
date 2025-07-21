// ==================================
//    FINAL & COMPLETE JAVASCRIPT
// ==================================

document.addEventListener('DOMContentLoaded', function () {

    // --- Navbar & Dropdown Logic ---
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const dropdowns = document.querySelectorAll('.dropdown');

    if (hamburger && header) {
        hamburger.addEventListener('click', () => {
            header.classList.toggle('menu-open');
        });
    }

    if (dropdowns) {
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('click', function(e) {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    this.classList.toggle('open');
                }
            });
        });
    }

    // --- Search Overlay Logic ---
    const searchIcon = document.querySelector('.search-icon');
    const searchOverlay = document.getElementById('search-overlay');
    const closeBtn = document.querySelector('#search-overlay .close-btn');

    if (searchIcon) {
        searchIcon.addEventListener('click', () => {
            if (searchOverlay) searchOverlay.style.display = 'flex';
        });
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (searchOverlay) searchOverlay.style.display = 'none';
        });
    }

    // --- Scroll to Top Button Logic ---
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.style.display = 'flex';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });
        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Reusable Modal Logic ---
    function setupModal(openSelector, modalId, closeSelector) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        const closeBtn = modal.querySelector(closeSelector);
        const openBtns = document.querySelectorAll(openSelector);

        const openModal = (e) => { e.preventDefault(); modal.style.display = 'flex'; };
        const closeModal = () => { modal.style.display = 'none'; };

        openBtns.forEach(btn => btn.addEventListener('click', openModal));
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    }

    setupModal('.open-form-btn', 'contact-modal', '.close-modal');
    setupModal('.open-quote-form-btn', 'quote-modal', '.close-quote-modal');

    // --- Animated Counter Logic (THE CORRECT CODE) ---
    const statsSection = document.querySelector('.cta-stats-side');
    if (statsSection) {
        const counters = statsSection.querySelectorAll('.counter');
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        let current = 0;
                        const increment = target / 100; // Animate in 100 steps
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                clearInterval(timer);
                                counter.innerText = target.toLocaleString();
                            } else {
                                counter.innerText = Math.ceil(current).toLocaleString();
                            }
                        }, 20); // Update every 20ms
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }

    // --- Portfolio Slider Logic ---
    const portfolioSlider = new Swiper('.portfolio-slider', {
        loop: true, spaceBetween: 30, slidesPerView: 1,
        navigation: { nextEl: '.portfolio-section .swiper-button-next', prevEl: '.portfolio-section .swiper-button-prev' },
        pagination: { el: '.portfolio-section .swiper-pagination', clickable: true },
        breakpoints: { 768: { slidesPerView: 2 }, 992: { slidesPerView: 3 } }
    });


    // --- AJAX FORM SUBMISSION LOGIC ---
    async function handleFormSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const status = form.querySelector('.form-status');
        const data = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                form.reset();
                window.location.href = 'thank-you.html';
            } else {
                const responseData = await response.json();
                if (Object.hasOwn(responseData, 'errors')) {
                    if(status) status.innerHTML = responseData["errors"].map(error => error["message"]).join(", ");
                } else {
                    if(status) status.innerHTML = "Oops! There was a problem submitting your form";
                }
            }
        } catch (error) {
            if(status) status.innerHTML = "Oops! There was a problem submitting your form";
        }
    }

    // Teeno forms par event listener lagayein
    const contactForm = document.getElementById('contact-form-popup');
    const scheduleForm = document.getElementById('schedule-form');
    const quoteForm = document.getElementById('quote-form-popup');

    if(contactForm) contactForm.addEventListener("submit", handleFormSubmit);
    if(scheduleForm) scheduleForm.addEventListener("submit", handleFormSubmit);
    if(quoteForm) quoteForm.addEventListener("submit", handleFormSubmit);
});