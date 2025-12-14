class PortfolioApp {
    constructor() {
        this.currentSection = 'home';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupSmoothScrolling();
        this.setupPageTransitions();
        this.setupFloatingElements();
        this.setupTypewriterEffect();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('href').substring(1);
                this.navigateToSection(targetSection);
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            });
        });

        // Mobile menu toggle
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    setupSmoothScrolling() {
        // Add smooth scrolling to all links
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
    }

    setupPageTransitions() {
        // Observe section changes for single-page app behavior
        const sections = document.querySelectorAll('.section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.setActiveSection(sectionId);
                }
            });
        }, {
            threshold: 0.5
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    setActiveSection(sectionId) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        document.querySelector(`.nav-link[href="#${sectionId}"]`).classList.add('active');

        // Update sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        document.getElementById(sectionId).classList.add('active');
        
        this.currentSection = sectionId;
    }

    navigateToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            // Scroll to section
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            this.setActiveSection(sectionId);
        }
    }

    setupFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating-element');
        
        floatingElements.forEach((element, index) => {
            // Randomize initial positions and animations
            gsap.to(element, {
                y: `+=${20 + index * 5}`,
                rotation: 360,
                duration: 3 + index,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });
    }

    setupTypewriterEffect() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;

        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing after a short delay
        setTimeout(typeWriter, 1000);
    }

    // Utility method for external navigation
    navigateToExternal(url) {
        window.open(url, '_blank');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
    
    // Add any global event listeners
    document.addEventListener('keydown', (e) => {
        // ESC key to show all sections (for debugging)
        if (e.key === 'Escape') {
            document.querySelectorAll('.section').forEach(section => {
                section.style.display = 'block';
            });
        }
    });
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}