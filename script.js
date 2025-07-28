
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
        anchor.addEventListener('click', function (e) {
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
    consultationForm?.addEventListener('submit', function(e) {
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
        showAIConsultation(data);
    });

    // AI Consultation Response
    function showAIConsultation(data) {
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
        
        // Simulate AI processing (in real app, this would be an API call)
        setTimeout(() => {
            const aiAnalysis = generateAIResponse(data);
            aiContent.innerHTML = aiAnalysis;
        }, 3000);
    }

    // Generate AI Response (simulated)
    function generateAIResponse(data) {
        const conditions = {
            'back': ['lumbar', 'spine', 'lower back', 'upper back'],
            'knee': ['knee', 'kneecap', 'patella'],
            'neck': ['neck', 'cervical', 'stiff neck'],
            'shoulder': ['shoulder', 'rotator cuff', 'arm'],
            'ankle': ['ankle', 'foot', 'heel'],
            'hip': ['hip', 'groin', 'pelvis']
        };
        
        let detectedCondition = 'general';
        const conditionText = data.condition.toLowerCase();
        
        for (const [key, keywords] of Object.entries(conditions)) {
            if (keywords.some(keyword => conditionText.includes(keyword))) {
                detectedCondition = key;
                break;
            }
        }
        
        const responses = {
            back: {
                assessment: "Based on your description, here are some gentle exercises and wellness tips that may help support your lower back comfort. Remember, this is guidance only - consult a healthcare professional for proper assessment.",
                exercises: [
                    "Cat-Cow Stretches - 10 repetitions, 2 sets",
                    "Knee-to-Chest Stretches - Hold 30 seconds each leg",
                    "Pelvic Tilts - 15 repetitions, 2 sets",
                    "Modified Plank - Hold 20-30 seconds, 3 sets"
                ],
                precautions: "These are general wellness suggestions. Always consult a physiotherapist for proper assessment and treatment."
            },
            knee: {
                assessment: "Here are some gentle exercises that may help support knee wellness. This guidance is for motivational support only - seek professional evaluation for any ongoing concerns.",
                exercises: [
                    "Straight Leg Raises - 10 repetitions, 3 sets",
                    "Wall Sits - Hold 20-30 seconds, 3 sets",
                    "Calf Raises - 15 repetitions, 2 sets",
                    "Gentle Knee Bends - 10 repetitions, 2 sets"
                ],
                precautions: "These suggestions are for general wellness support. Consult a healthcare professional for proper evaluation."
            },
            general: {
                assessment: "Based on your information, here are some general wellness exercises that may support your fitness journey. This is motivational guidance only.",
                exercises: [
                    "Gentle Range of Motion Exercises - 10 repetitions each direction",
                    "Walking - 15-20 minutes daily",
                    "Basic Stretching Routine - Hold 30 seconds each",
                    "Core Strengthening - 10 repetitions, 2 sets"
                ],
                precautions: "These are general wellness suggestions. Always consult healthcare professionals for personalized treatment."
            }
        };
        
        const response = responses[detectedCondition] || responses.general;
        const painLevel = parseInt(data['pain-level']) || 5;
        
        return `
            <div class="recommendation-card">
                <h4><i class="fas fa-stethoscope"></i> AI Assessment</h4>
                <p><strong>Patient:</strong> ${data.name}, ${data.age} years old</p>
                <p><strong>Pain Level:</strong> ${painLevel}/10</p>
                <p>${response.assessment}</p>
            </div>
            
            <div class="protocol-section">
                <h4><i class="fas fa-dumbbell"></i> Suggested Wellness Exercises</h4>
                <ul class="exercise-list">
                    ${response.exercises.map(exercise => `<li><i class="fas fa-play-circle"></i> ${exercise}</li>`).join('')}
                </ul>
            </div>
            
            <div class="protocol-section">
                <h4><i class="fas fa-clock"></i> General Guidelines</h4>
                <p><strong>Suggested Frequency:</strong> ${painLevel > 7 ? 'Gentle movements 2-3 times daily' : 'Once daily'}</p>
                <p><strong>General Timeframe:</strong> ${painLevel > 7 ? 'Gentle approach for 2-3 weeks' : '1-2 weeks of gradual progression'}</p>
                <p><strong>Motivation:</strong> Track your progress and celebrate small improvements!</p>
            </div>
            
            <div class="warning-box">
                <i class="fas fa-exclamation-triangle"></i>
                <strong>Disclaimer:</strong> ${response.precautions}
                ${painLevel > 8 ? ' Your discomfort level is high - please consult a healthcare professional immediately.' : ' Remember, this is motivational guidance, not medical treatment.'}
            </div>
            
            <div style="text-align: center; margin-top: 2rem;">
                <button onclick="window.print()" class="btn-secondary" style="margin-right: 1rem;">
                    <i class="fas fa-print"></i> Print Guidance
                </button>
                <button onclick="startNewGuidance()" class="btn-primary">
                    <i class="fas fa-redo"></i> Get New Guidance
                </button>
            </div>
        `;
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
