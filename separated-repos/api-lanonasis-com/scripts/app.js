// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('nav-menu--open');

            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('nav-menu--open')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu when clicking on a navigation link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (navMenu.classList.contains('nav-menu--open')) {
                navMenu.classList.remove('nav-menu--open');

                // Reset hamburger menu
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });

    // Smooth scrolling for navigation links
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerOffset = 80; // Account for fixed header
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header background opacity on scroll
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function () {
            const scrollTop = window.pageYOffset;
            const opacity = Math.min(0.95, 0.8 + (scrollTop / 200) * 0.15);
            header.style.background = `rgba(19, 52, 59, ${opacity})`;
        });
    }

    // Add scroll reveal animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Elements to animate on scroll
    const animateElements = document.querySelectorAll(`
        .vision-card,
        .platform-card,
        .feature-card,
        .market-card,
        .pricing-card,
        .differentiator,
        .gateway-feature,
        .service-category
    `);

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // CTA Button Actions using data-action attributes
    const ctaButtons = document.querySelectorAll('.btn--primary');
    if (ctaButtons && ctaButtons.length > 0) {
        ctaButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                // Get action from data attribute or fallback to text content
                const action = this.dataset.action || this.textContent.trim();
                
                // Handle different CTA actions
                switch (action) {
                    case 'get-started':
                    case 'start-trial':
                        handleGetStarted();
                        break;
                    case 'request-demo':
                        handleRequestDemo();
                        break;
                    case 'contact-sales':
                    case 'contact-us':
                        handleContactSales();
                        break;
                    default:
                        handleGetStarted();
                }
            });
        });
    }

    // Outline button actions using data-action attributes
    const outlineButtons = document.querySelectorAll('.btn--outline');
    if (outlineButtons && outlineButtons.length > 0) {
        outlineButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                // Get action from data attribute or fallback to text content
                const action = this.dataset.action || this.textContent.trim();
                
                switch (action) {
                    case 'learn-more':
                        handleLearnMore();
                        break;
                    case 'contact-sales':
                    case 'contact-us':
                        handleContactSales();
                        break;
                    default:
                        handleGetStarted();
                }
            });
        });
    }

    // CTA Handler Functions
    function handleGetStarted() {
        // Scroll to pricing section
        const pricingSection = document.querySelector('.pricing');
        if (pricingSection) {
            const headerOffset = 80;
            const elementPosition = pricingSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }

        // Show notification
        showNotification('Welcome! Choose your plan to get started with LAN Onasis.', 'success');
    }

    function handleRequestDemo() {
        // Simulate demo request
        showNotification('Demo request submitted! Our team will contact you within 24 hours.', 'success');

        // In a real application, this would open a form or redirect to a demo page
        setTimeout(() => {
            // Use notification system instead of alert for better UX
            showNotification('Thank you for your interest! Please email us at demo@lanonasis.com to schedule your personalized demo.', 'info');
        }, 1000);
    }

    function handleContactSales() {
        // Scroll to contact section
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            const headerOffset = 80;
            const elementPosition = contactSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }

        showNotification('Contact our sales team at info@lanonasis.com', 'info');
    }

    function handleLearnMore() {
        // Scroll to company vision section
        const visionSection = document.querySelector('.vision');
        if (visionSection) {
            const headerOffset = 80;
            const elementPosition = visionSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Notification System
    function showNotification(message, type = 'info') {
        if (!message || !document.body) return;
        
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        if (existingNotifications) {
            existingNotifications.forEach(notification => notification.remove());
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        // Fix CSS template string - use proper variable interpolation
        const borderColor = type === 'success' ? 'success' : 
                           type === 'info' ? 'info' : 
                           type === 'warning' ? 'warning' : 'primary';
                           
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--color-surface);
            color: var(--color-text);
            padding: 16px 24px;
            border-radius: 8px;
            border-left: 4px solid var(--color-${borderColor});
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            backdrop-filter: blur(10px);
            z-index: 1001;
            max-width: 300px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-size: 14px;
            line-height: 1.4;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        // Add notification to DOM
        document.body.appendChild(notification);
        
        // Animate in (use requestAnimationFrame for better performance)
        requestAnimationFrame(() => {
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 10);
        });

        // Auto remove after 5 seconds
        const removeTimeout = setTimeout(() => {
            if (notification) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);

        // Click to dismiss
        notification.addEventListener('click', () => {
            clearTimeout(removeTimeout);
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }

    // Platform cards hover effects
    const platformCards = document.querySelectorAll('.platform-card');
    if (platformCards && platformCards.length > 0) {
        platformCards.forEach(card => {
            card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-6px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Pricing cards interaction
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('click', function (e) {
            // Don't trigger if clicking on a button
            if (e.target.tagName === 'BUTTON') return;

            // Remove active state from all cards
            pricingCards.forEach(c => c.classList.remove('pricing-card--active'));

            // Add active state to clicked card
            this.classList.add('pricing-card--active');

            // Add active state styles
            this.style.borderColor = 'var(--color-primary)';
            this.style.boxShadow = '0 8px 24px rgba(33, 128, 141, 0.2)';
        });
    });

    // Stats counter animation
    function animateCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');

        statNumbers.forEach(stat => {
            const finalValue = stat.textContent;
            const numericValue = parseInt(finalValue.replace(/\D/g, ''));
            const suffix = finalValue.replace(/\d/g, '');

            if (numericValue) {
                let currentValue = 0;
                const increment = numericValue / 30; // Animation duration
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= numericValue) {
                        stat.textContent = finalValue;
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(currentValue) + suffix;
                    }
                }, 50);
            }
        });
    }

    // Trigger counter animation when hero section is visible
    const heroSection = document.querySelector('.hero');
    if (heroSection && 'IntersectionObserver' in window) {
        const heroObserver = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    heroObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        heroObserver.observe(heroSection);
    }

    // Add loading state management
    window.addEventListener('load', function () {
        document.body.classList.add('loaded');

        // Trigger initial animations
        setTimeout(() => {
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }
        }, 100);
    });

    // Add CSS for loading state
    if (!document.querySelector('#loading-styles')) {
        const loadingStyles = document.createElement('style');
        loadingStyles.id = 'loading-styles';
        loadingStyles.textContent = `
            .hero-content {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.8s ease, transform 0.8s ease;
            }
            
            .pricing-card--active {
                border-color: var(--color-primary) !important;
                box-shadow: 0 8px 24px rgba(33, 128, 141, 0.2) !important;
            }
            
            .notification {
                cursor: pointer;
            }
            
            .notification:hover {
                opacity: 0.9;
            }
        `;
        document.head.appendChild(loadingStyles);
    }
});