document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for reveal animations
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Dynamic Header Background
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '16px 40px';
            header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        } else {
            header.style.padding = '24px 40px';
            header.style.borderBottom = 'none';
        }
    });

    // Parallax effect for floating orbs
    window.addEventListener('mousemove', (e) => {
        const orbs = document.querySelectorAll('.glass-orb');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            const xOffset = (x - 0.5) * speed;
            const yOffset = (y - 0.5) * speed;
            orb.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });

    // Contact Form Logic
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnContent = submitBtn.innerHTML;

            // Loading State
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span><i data-lucide="loader-2" class="animate-spin"></i>';
            lucide.createIcons();

            const formData = {
                name: contactForm.name.value,
                email: contactForm.email.value,
                message: contactForm.message.value
            };

            try {
                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                console.error('Submission Error:', error);
                formStatus.textContent = 'Something went wrong. Please try again later.';
                formStatus.className = 'form-status error';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                lucide.createIcons();

                // Clear status after 5 seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 5000);
            }
        });
    }
});
