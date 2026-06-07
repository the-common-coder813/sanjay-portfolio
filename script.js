document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // INITIALIZE LUCIDE ICONS
    // ==========================================================================
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==========================================================================
    // STICKY HEADER & SCROLL TO TOP SHOW/HIDE
    // ==========================================================================
    const header = document.getElementById('header');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
        // Sticky Header class
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll To Top button visibility
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });

    // Scroll to Top action
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==========================================================================
    // MOBILE NAVIGATION TOGGLE
    // ==========================================================================
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navCta = document.querySelector('.nav-cta');

    const toggleMenu = () => {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        mobileToggle.setAttribute('aria-expanded', !isExpanded);
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Prevent body scroll when menu is open on mobile
        document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
    };

    const closeMenu = () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    mobileToggle.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    if (navCta) {
        navCta.addEventListener('click', closeMenu);
    }

    // Close mobile menu if clicked outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !mobileToggle.contains(e.target)) {
            closeMenu();
        }
    });

    // ==========================================================================
    // INTERSECTION OBSERVER FOR ACTIVE NAV LINKS & SCROLL REVEALS
    // ==========================================================================
    const sections = document.querySelectorAll('section');

    const navObserverOptions = {
        root: null,
        threshold: 0.2,
        rootMargin: '-80px 0px -20px 0px' // offset header height
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // Scroll Reveal elements
    const reveals = document.querySelectorAll('.reveal');

    // Add reveal class to sections programmatically for clean animations
    sections.forEach(sec => {
        sec.classList.add('reveal');
        // Add cascade delays to children where appropriate
        const cards = sec.querySelectorAll('.service-card, .why-card, .skill-card');
        cards.forEach((card, index) => {
            card.classList.add('reveal');
            card.classList.add(`delay-${(index % 4) + 1}`);
        });
    });

    const revealObserverOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Trigger only once
            }
        });
    }, revealObserverOptions);

    // Refresh reveal selectors after class additions
    const allReveals = document.querySelectorAll('.reveal');
    allReveals.forEach(el => {
        revealObserver.observe(el);
    });

    // ==========================================================================
    // SKILLS PROGRESS BAR ANIMATION
    // ==========================================================================
    const skillsSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.skill-progress');

    // Store target widths and set to 0 initially
    progressBars.forEach(bar => {
        const targetWidth = bar.style.width || '0%';
        bar.dataset.width = targetWidth;
        bar.style.width = '0%';
    });

    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressBars.forEach(bar => {
                    bar.style.width = bar.dataset.width;
                });
                skillsObserver.unobserve(entry.target); // Animate once
            }
        });
    }, { threshold: 0.1 });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // ==========================================================================
    // MODAL DIALOG CONTROLLER (FREE QUOTE)
    // ==========================================================================
    const quoteModal = document.getElementById('quoteModal');
    const quoteBtn = document.getElementById('quoteBtn');
    const modalClose = document.getElementById('modalClose');
    const modalQuoteForm = document.getElementById('modalQuoteForm');

    const openModal = () => {
        quoteModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        quoteModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        modalQuoteForm.reset();
        clearFormErrors(modalQuoteForm);
    };

    if (quoteBtn) quoteBtn.addEventListener('click', openModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);

    // Close on click outside modal content
    if (quoteModal) {
        quoteModal.addEventListener('click', (e) => {
            if (e.target === quoteModal) {
                closeModal();
            }
        });
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && quoteModal.classList.contains('active')) {
            closeModal();
        }
    });

    // ==========================================================================
    // TOAST NOTIFICATIONS
    // ==========================================================================
    const toast = document.getElementById('toast');
    const toastClose = document.getElementById('toastClose');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');

    const showToast = (title, message) => {
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        toast.classList.add('active');

        // Auto dismiss after 5 seconds
        setTimeout(hideToast, 5000);
    };

    const hideToast = () => {
        toast.classList.remove('active');
    };

    if (toastClose) toastClose.addEventListener('click', hideToast);

    // ==========================================================================
    // FORM VALIDATION & SUBMISSION
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');

    const clearFormErrors = (form) => {
        const groups = form.querySelectorAll('.form-group');
        groups.forEach(g => g.classList.remove('error'));
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePhone = (phone) => {
        // Standard 10-digit number check
        const re = /^\d{10}$/;
        return re.test(String(phone).replace(/[\s-()]/g, ''));
    };

    // Main Contact Form Submission
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearFormErrors(contactForm);

            const fullName = document.getElementById('fullName');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const projectDetails = document.getElementById('projectDetails');
            const submitBtn = document.getElementById('submitBtn');

            let isValid = true;
            let firstErrorElement = null;

            // Validate Full Name
            if (!fullName.value.trim()) {
                fullName.closest('.form-group').classList.add('error');
                isValid = false;
                if (!firstErrorElement) firstErrorElement = fullName;
            }

            // Validate Email
            if (!email.value.trim() || !validateEmail(email.value)) {
                email.closest('.form-group').classList.add('error');
                isValid = false;
                if (!firstErrorElement) firstErrorElement = email;
            }

            // Validate Phone
            if (!phone.value.trim() || !validatePhone(phone.value)) {
                phone.closest('.form-group').classList.add('error');
                isValid = false;
                if (!firstErrorElement) firstErrorElement = phone;
            }

            // Validate Details
            if (!projectDetails.value.trim()) {
                projectDetails.closest('.form-group').classList.add('error');
                isValid = false;
                if (!firstErrorElement) firstErrorElement = projectDetails;
            }

            if (!isValid) {
                if (firstErrorElement) firstErrorElement.focus();
                return;
            }

            // Show Loading State
            const origCtaText = submitBtn.querySelector('span').textContent;
            submitBtn.disabled = true;
            submitBtn.querySelector('span').textContent = 'Sending Message...';

            // Simulate form submission
            setTimeout(() => {
                showToast(
                    'Message Sent!',
                    'Thank you. Sanjay Baliyan will reply to your inquiry shortly.'
                );
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.querySelector('span').textContent = origCtaText;
            }, 1200);
        });
    }

    // Modal Quote Form Submission
    if (modalQuoteForm) {
        modalQuoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearFormErrors(modalQuoteForm);

            const modalName = document.getElementById('modalName');
            const modalEmail = document.getElementById('modalEmail');
            const modalType = document.getElementById('modalType');
            const modalDesc = document.getElementById('modalDesc');
            const modalSubmitBtn = document.getElementById('modalSubmitBtn');

            let isValid = true;
            let firstErrorElement = null;

            // Validate Name
            if (!modalName.value.trim()) {
                modalName.closest('.form-group').classList.add('error');
                isValid = false;
                if (!firstErrorElement) firstErrorElement = modalName;
            }

            // Validate Email
            if (!modalEmail.value.trim() || !validateEmail(modalEmail.value)) {
                modalEmail.closest('.form-group').classList.add('error');
                isValid = false;
                if (!firstErrorElement) firstErrorElement = modalEmail;
            }

            // Validate Service Type
            if (!modalType.value) {
                modalType.closest('.form-group').classList.add('error');
                isValid = false;
                if (!firstErrorElement) firstErrorElement = modalType;
            }

            // Validate Project Description
            if (!modalDesc.value.trim()) {
                modalDesc.closest('.form-group').classList.add('error');
                isValid = false;
                if (!firstErrorElement) firstErrorElement = modalDesc;
            }

            if (!isValid) {
                if (firstErrorElement) firstErrorElement.focus();
                return;
            }

            // Show Loading State
            const origCtaText = modalSubmitBtn.querySelector('span').textContent;
            modalSubmitBtn.disabled = true;
            modalSubmitBtn.querySelector('span').textContent = 'Submitting Request...';

            // Simulate form submission
            setTimeout(() => {
                closeModal();
                showToast(
                    'Quote Request Submitted!',
                    'Thank you. Sanjay will review your requirements and provide a details estimate.'
                );
                modalSubmitBtn.disabled = false;
                modalSubmitBtn.querySelector('span').textContent = origCtaText;
            }, 1200);
        });
    }
});
