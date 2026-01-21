// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        const mobileLinks = mobileNav.querySelectorAll('.nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = mobileNav.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);

            if (!isClickInsideNav && !isClickOnHamburger && mobileNav.classList.contains('active')) {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
            }
        });
    }
});

// Contact Form Handling (Formspree + Fetch)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formNote = document.getElementById('formNote');
        const submitBtn = contactForm.querySelector('button[type="submit"]');

        // Basic client-side validation
        const name = contactForm.querySelector('#name');
        const email = contactForm.querySelector('#email');
        const message = contactForm.querySelector('#message');

        if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
            formNote.style.display = 'block';
            formNote.textContent = 'Please fill out the required fields.';
            return;
        }

        // Disable button while submitting
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';

        // Prepare form data
        const data = new FormData(contactForm);

        try {
            const action = contactForm.getAttribute('action');
            const resp = await fetch(action, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (resp.ok) {
                formNote.style.display = 'block';
                formNote.textContent = 'Thanks -- I\'ll get back to you soon!';
                contactForm.reset();
            } else {
                const result = await resp.json().catch(() => ({}));
                formNote.style.display = 'block';
                formNote.textContent = result.error || 'There was a problem sending your message. Please try again later.';
            }
        } catch (err) {
            formNote.style.display = 'block';
            formNote.textContent = 'Network error. Please check your connection and try again.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Generic Modal Handler
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Handle all data-modal buttons (open modal)
document.querySelectorAll('[data-modal]').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const modalId = this.getAttribute('data-modal');
        // Support both direct modal IDs and legacy format (e.g., "script-request" -> "scriptModal")
        const resolvedModalId = modalId === 'script-request' ? 'scriptModal' : (modalId + '-modal');
        openModal(resolvedModalId);
    });
});

// Handle all modal close buttons (via data-close-modal)
document.querySelectorAll('[data-close-modal]').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        const modalId = this.getAttribute('data-close-modal');
        closeModal(modalId);
    });
});

// Legacy support: handle old closeModal ID buttons
const legacyCloseModal = document.getElementById('closeModal');
if (legacyCloseModal) {
    legacyCloseModal.addEventListener('click', function() {
        closeModal('scriptModal');
    });
}

// Close modal when clicking outside
document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal(this.id);
        }
    });
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            closeModal(modal.id);
        });
    }
});
