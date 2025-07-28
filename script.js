document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger?.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Pain level slider
    const painSlider = document.querySelector('#pain-level');
    const painValue = document.querySelector('#pain-value');

    painSlider?.addEventListener('input', function() {
        painValue.textContent = this.value;
    });

    // AI Consultation Form submission handling
    const consultationForm = document.querySelector('#ai-consultation-form');
    consultationForm?.addEventListener('submit', async function(e) { // <-- Added 'async'
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        // Basic validation
        if (!data.name || !data.age || !data.gender || !data.condition) {
            alert('कृपया सभी आवश्यक फील्ड भरें / Please fill all required fields');
            return;
        }

        // Show loading and get AI consultation
        await showAIConsultation(data); // <-- Added 'await'
    });

    // AI Consultation Response - Now makes a real API call
    async function showAIConsultation(data) { // <-- Added 'async'
        const aiResponse = document.querySelector('#ai-response');
        const aiContent = document.querySelector('#ai-content');

        // Show response section and loading
        aiResponse.style.display = 'block';
        aiContent.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div class="loading-spinner"></div>
                <p style="margin-top: 1rem;">AI Wellness Guide is analyzing your information...</p>
            </div>
        `;

        // Scroll to response
        aiResponse.scrollIntoView({ behavior: 'smooth' });

        // --- API CALL TO BACKEND ---
        try {
            const response = await fetch('https://bce241b3-5cf7-4975-ad16-7d14985e94d3-00-380eir4uynk8l.pike.replit.dev/consult', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    age: data.age,
                    gender: data.gender,
                    occupation: data.occupation,
                    lifestyle: data.lifestyle,
                    weight: data.weight,
                    injury: data.condition,
                    painLevel: data['pain-level'],
                    activityLevel: data['activity-level'],
                    medicalHistory: data['medical-history']
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                aiContent.innerHTML = result.output;
            } else {
                aiContent.innerHTML = `<p>Error from server: ${result.error}</p>`;
            }
        } catch (error) {
            console.error('Fetch error:', error);
            aiContent.innerHTML = '<p>Sorry, a network error occurred. Please check your connection and try again.</p>';
        }
        // --- END OF API CALL ---
    }

    // Start new guidance session
    function startNewGuidance() {
        document.querySelector('#ai-consultation-form').reset();
        document.querySelector('#ai-response').style.display = 'none';
        document.querySelector('#consultation').scrollIntoView({ behavior: 'smooth' });
        document.querySelector('#pain-value').textContent = '5';
    }

    // Navbar background change on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#FFFFFF';
            header.style.backdropFilter = 'none';
        }
    });

    // Animate stats counter
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + '+';
        }, 20);
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate stat numbers
                if (entry.target.classList.contains('stat-number')) {
                    const target = parseInt(entry.target.textContent);
                    animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }

                // Add animation classes for other elements
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.stat-number, .service-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // Add ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    }

    // Add ripple effect styles
    const style = document.createElement('style');
    style.textContent = `
        .btn-primary, .btn-secondary {
            position: relative;
            overflow: hidden;
        }
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
        }
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Apply ripple effect to buttons
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
        button.addEventListener('click', createRipple);
    });
});

// NOTE: The old 'generateAIResponse' function from your previous code has been removed.
// The new code relies on the actual AI backend to generate the response.