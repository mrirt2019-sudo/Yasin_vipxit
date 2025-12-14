class PortfolioAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.animateStats();
        this.setupScrollAnimations();
        this.setupServiceInteractions();
        this.setupFormAnimations();
    }

    animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current);
            }, 16);
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all service cards and gallery items
        document.querySelectorAll('.service-card, .gallery-item, .contact-method').forEach(el => {
            observer.observe(el);
        });
    }

    setupServiceInteractions() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCardHover(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCardLeave(card);
            });
            
            const button = card.querySelector('.service-btn');
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleServiceRequest(card);
            });
        });
    }

    animateCardHover(card) {
        gsap.to(card, {
            y: -10,
            rotationY: 5,
            duration: 0.3,
            ease: "power2.out"
        });
        
        const icon = card.querySelector('.service-icon i');
        gsap.to(icon, {
            scale: 1.2,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
    }

    animateCardLeave(card) {
        gsap.to(card, {
            y: 0,
            rotationY: 0,
            duration: 0.3,
            ease: "power2.out"
        });
        
        const icon = card.querySelector('.service-icon i');
        gsap.to(icon, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    }

    handleServiceRequest(card) {
        const service = card.getAttribute('data-service');
        const serviceName = card.querySelector('h3').textContent;
        
        // Create notification
        this.showNotification(`Request sent for: ${serviceName}`, 'success');
        
        // Animate button
        const button = card.querySelector('.service-btn');
        const originalText = button.textContent;
        
        button.innerHTML = '<i class="fas fa-check"></i> Requested!';
        button.style.background = '#00ff88';
        button.style.color = '#0a0a0f';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
            button.style.color = '';
        }, 2000);
    }

    setupFormAnimations() {
        const form = document.getElementById('contactForm');
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                this.animateInputFocus(input);
            });
            
            input.addEventListener('blur', () => {
                this.animateInputBlur(input);
            });
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(form);
        });
    }

    animateInputFocus(input) {
        gsap.to(input, {
            borderColor: '#00ff88',
            boxShadow: '0 0 10px #00ff88',
            duration: 0.3,
            ease: "power2.out"
        });
    }

    animateInputBlur(input) {
        gsap.to(input, {
            borderColor: 'rgba(0, 255, 136, 0.3)',
            boxShadow: 'none',
            duration: 0.3,
            ease: "power2.out"
        });
    }

    handleFormSubmit(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00ff88' : '#ff0088'};
            color: #0a0a0f;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 0 20px ${type === 'success' ? '#00ff88' : '#ff0088'};
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            font-weight: 600;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
}

// Add CSS for animations
const animationStyles = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .service-card, .gallery-item, .contact-method {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioAnimations();
});