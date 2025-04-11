/**
 * Handle page transitions using Barba.js
 * This file manages the smooth transitions between pages
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Barba with transitions
    barba.init({
        sync: true,
        transitions: [{
            name: 'default-transition',
            once(data) {
                // This runs once on initial page load
                initPage(data.next.container);
            },
            leave(data) {
                // Exit animation
                return gsap.to(data.current.container, {
                    opacity: 0,
                    duration: 0.5
                });
            },
            enter(data) {
                // Entry animation
                return gsap.from(data.next.container, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => initPage(data.next.container)
                });
            },
            afterEnter(data) {
                // This runs after the enter transition
                // Initialize page-specific styles and scripts
                loadPageSpecificScripts(data.next.namespace);
            },
        }]
    });
});

function initPage(container) {
    // Initialize any components and animations
    initParticles();
    setupCustomCursor();
    
    // Apply any needed inline styles from style tags immediately
    const inlineStyles = container.querySelectorAll('style');
    if (inlineStyles) {
        inlineStyles.forEach(styleElement => {
            // Force style reapplication
            const parent = styleElement.parentNode;
            parent.removeChild(styleElement);
            parent.appendChild(styleElement);
        });
    }
    
    // Initialize scrolling animations
    initScrollAnimations();
    
    // Reinitialize specific page components
    document.dispatchEvent(new CustomEvent('page-loaded'));
}

function loadPageSpecificScripts(namespace) {
    // Handle page-specific initializations based on namespace
    switch (namespace) {
        case 'home':
            initTyped();
            initHomeAnimations();
            break;
        case 'about':
            initAboutPage();
            break;
        case 'contact':
            initContactPage();
            break;
        case 'resume':
            initResumePage();
            break;
        case 'project':
            initProjectPage();
            break;
    }
}

function initAboutPage() {
    console.log('About page initialized');
    
    // Apply styles immediately
    applyInlineStyles();
    
    // Animate fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements) {
        fadeElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('active');
            }, index * 100);
        });
    }
    
    // Initialize any about-page specific components
    const projectCards = document.querySelectorAll('.about-content .project-card');
    if (projectCards) {
        projectCards.forEach((card) => {
            // Ensure cards are visible
            card.style.opacity = '1';
            card.style.transform = 'none';
        });
    }
}

function initContactPage() {
    console.log('Contact page initialized');
    
    // Apply styles immediately
    applyInlineStyles();
    
    // Initialize contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formDone = document.querySelector('.w-form-done');
            if (formDone) {
                formDone.style.display = 'block';
                setTimeout(() => {
                    contactForm.reset();
                }, 2000);
            }
        });
    }
    
    // Animate project cards
    const projectCards = document.querySelectorAll('.contact-projects .project-card');
    if (projectCards) {
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
            }, index * 150);
        });
    }
}

function initResumePage() {
    console.log('Resume page initialized');
    
    // Apply styles immediately
    applyInlineStyles();
    
    // Animate skill bars
    setTimeout(() => {
        const skillBars = document.querySelectorAll('.skill-progress');
        if (skillBars) {
            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
            });
        }
    }, 300);
    
    // Animate elements when they enter viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.animate-in').forEach(item => {
        observer.observe(item);
    });
}

function initProjectPage() {
    console.log('Project page initialized');
    
    // Apply styles immediately
    applyInlineStyles();
    
    // Initialize project filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const category = this.getAttribute('data-filter');
                filterProjects(category);
                
                // Update active class
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // Show projects with animation
    const projects = document.querySelectorAll('.project-card');
    if (projects) {
        projects.forEach((project, index) => {
            setTimeout(() => {
                project.style.opacity = '1';
                project.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}

function applyInlineStyles() {
    // Force browser to reapply styles by toggling a class
    document.body.classList.add('styles-refresh');
    setTimeout(() => {
        document.body.classList.remove('styles-refresh');
    }, 10);
    
    // Also manually apply any inline styles from style tags
    const inlineStyles = document.querySelectorAll('style');
    if (inlineStyles) {
        inlineStyles.forEach(styleElement => {
            // Force style reapplication
            const parent = styleElement.parentNode;
            const clone = styleElement.cloneNode(true);
            parent.removeChild(styleElement);
            parent.appendChild(clone);
        });
    }
}

// Other helper functions for transitions
function initParticles() {
    // Initialize background particles if needed
}

function setupCustomCursor() {
    // Setup custom cursor behavior
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1
            });
            
            gsap.to(follower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3
            });
        });
        
        const hoverElements = document.querySelectorAll('a, button, .w-button, .project-card, .filter-btn');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-active');
                follower.classList.add('cursor-active');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-active');
                follower.classList.remove('cursor-active');
            });
        });
    }
}

function initScrollAnimations() {
    // Animation for elements when they come into viewport
}

function initTyped() {
    // Initialize typed.js for animated typing effect on home page
    const typedEl = document.getElementById('typed-strings');
    if (typedEl) {
        new Typed('#typed-strings', {
            strings: ['build AI solutions', 'craft ML applications', 'design neural networks', 'develop NLP systems'],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 1500,
            startDelay: 500,
            loop: true
        });
    }
}

function initHomeAnimations() {
    // Special animations for home page
}
