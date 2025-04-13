/**
 * Handle page transitions using Barba.js
 * This file manages the smooth transitions between pages
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Barba with transitions
    barba.init({
        debug: true, // Enable debug to see what's happening
        sync: true,
        preventRunning: true,
        transitions: [{
            name: 'default-transition',
            once(data) {
                // This runs once on initial page load
                return new Promise(resolve => {
                    // Ensure styles are applied immediately
                    forceStylesRefresh(data.next.container);
                    initPage(data.next.container, data.next.namespace);
                    setTimeout(resolve, 100);
                });
            },
            leave(data) {
                // Exit animation
                return gsap.to(data.current.container, {
                    opacity: 0,
                    duration: 0.5
                });
            },
            beforeEnter(data) {
                // Before entering new page
                // Force style reprocessing before animation starts
                forceStylesRefresh(data.next.container);
                window.scrollTo(0, 0);
            },
            enter(data) {
                // Entry animation
                return gsap.from(data.next.container, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => initPage(data.next.container, data.next.namespace)
                });
            }
        }]
    });
});

// Force CSS reprocessing to ensure styles are applied
function forceStylesRefresh(container) {
    // Get all stylesheets
    const styles = document.querySelectorAll('link[rel="stylesheet"], style');
    styles.forEach(style => {
        // Temporarily disable and re-enable to force browser to reprocess
        style.disabled = true;
        style.disabled = false;
    });

    // Force inline styles to be reprocessed
    const inlineStyles = container.querySelectorAll('style');
    if (inlineStyles.length > 0) {
        inlineStyles.forEach(style => {
            const parent = style.parentNode;
            const clone = style.cloneNode(true);
            parent.removeChild(style);
            parent.appendChild(clone);
        });
    }

    // Apply critical styles immediately for all page types
    const namespace = container.dataset.barbaNamespace;
    applyPageSpecificStyles(namespace, container);

    // Force a browser reflow to ensure styles are applied
    void container.offsetWidth;
}

function initPage(container, namespace) {
    // Initialize any components and animations
    setupCustomCursor();

    // Apply page-specific initializations
    switch (namespace) {
        case 'home':
            initTyped();
            animateProjects();
            break;
        case 'about':
            initAboutPage(container);
            break;
        case 'resume':
            initResumePage(container);
            break;
        case 'contact':
            initContactForm();
            animateContactProjects();
            break;
        case 'project':
            initProjectFilters();
            break;
    }

    // This helps ensure any animations or transitions are properly initialized
    document.dispatchEvent(new CustomEvent('page-loaded', {
        detail: {
            namespace: namespace
        }
    }));
}

// Page-specific style applications
function applyPageSpecificStyles(namespace) {
    if (namespace === 'about') {
        const projectCards = document.querySelectorAll('.about-content .project-card');
        if (projectCards) {
            projectCards.forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'none';
                card.style.perspective = 'none';
                card.style.visibility = 'visible';
            });
        }

        const fadeElements = document.querySelectorAll('.fade-in');
        if (fadeElements) {
            setTimeout(() => {
                fadeElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('active');
                    }, index * 100);
                });
            }, 200);
        }
    } else if (namespace === 'resume') {
        // Fix resume page specific styles
        setTimeout(() => {
            const skillBars = document.querySelectorAll('.skill-progress');
            if (skillBars) {
                skillBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width;
                });
            }

            // Make sure animate-in elements are visible
            const animateElements = document.querySelectorAll('.animate-in');
            if (animateElements) {
                animateElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('animate');
                    }, index * 100);
                });
            }
        }, 200);
    }
}

// Initialize About page
function initAboutPage(container) {
    console.log('Initializing About page');
    // Force project cards to be visible on the about page
    const projectCards = document.querySelectorAll('.about-content .project-card');
    if (projectCards) {
        projectCards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'none';
            card.style.perspective = 'none';
            card.style.visibility = 'visible';
        });
    }

    // Ensure fade-in elements are visible
    const fadeElements = container.querySelectorAll('.fade-in');
    if (fadeElements) {
        setTimeout(() => {
            fadeElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('active');
                }, index * 100);
            });
        }, 200);
    }
}

// Initialize Resume page
function initResumePage(container) {
    console.log('Initializing Resume page');
    // Animate skill bars
    setTimeout(() => {
        const skillBars = container.querySelectorAll('.skill-progress');
        if (skillBars) {
            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
            });
        }
    }, 200);

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

    container.querySelectorAll('.animate-in').forEach(item => {
        observer.observe(item);
        // Also add the animate class immediately to ensure styles are applied
        setTimeout(() => {
            item.classList.add('animate');
        }, 200);
    });
}

// More helper functions
function setupCustomCursor() {
    // Custom cursor code here
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

function initTyped() {
    // Initialize typed.js for home page
    const typedEl = document.getElementById('typed-strings');
    if (typedEl) {
        new Typed('#typed-strings', {
            strings: ['build responsive web applications', 'create elegant user experiences', 'solve complex problems', 'turn ideas into reality'],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 1500,
            startDelay: 500,
            loop: true
        });
    }
}

function animateProjects() {
    // Animate project cards
    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards) {
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
            }, index * 150);
        });
    }
}

function initContactForm() {
    // Initialize contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
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
}

function animateContactProjects() {
    // Animate project cards on contact page
    const projectCards = document.querySelectorAll('.contact-projects .project-card');
    if (projectCards) {
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
            }, index * 150);
        });
    }
}

function initProjectFilters() {
    // Initialize project filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const category = this.getAttribute('data-filter');
                filterProjects(category);

                // Update active class
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Trigger the "all" filter by default
        document.querySelector('.filter-btn[data-filter="all"]')?.click();
    }
}

function filterProjects(category) {
    const projects = document.querySelectorAll('.project-item');
    projects.forEach(project => {
        const projectCategory = project.getAttribute('data-category');
        if (category === 'all' || category === projectCategory) {
            project.style.display = 'flex';
            setTimeout(() => {
                project.style.opacity = '1';
                project.style.transform = 'translateY(0)';
            }, 10);
        } else {
            project.style.opacity = '0';
            project.style.transform = 'translateY(20px)';
            setTimeout(() => {
                project.style.display = 'none';
            }, 300);
        }
    });
}

// Immediate style application for about page
(function () {
    // Force project cards to be visible immediately
    const projectCards = document.querySelectorAll('.about-content .project-card');
    if (projectCards) {
        projectCards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'none';
            card.style.perspective = 'none';
            card.style.visibility = 'visible';
        });
    }

    // Ensure fade-in elements become visible
    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements) {
        setTimeout(() => {
            fadeElements.forEach((el, index) => {
                el.classList.add('active');
            }, 50);
        });
    }
})();

// Immediate style application for resume page
(function () {
    // Apply skill bar widths immediately
    setTimeout(function () {
        const skillBars = document.querySelectorAll('.skill-progress');
        if (skillBars) {
            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
            });
        }

        // Ensure animate-in elements become visible
        const animateElements = document.querySelectorAll('.animate-in');
        if (animateElements) {
            animateElements.forEach(el => {
                el.classList.add('animate');
            });
        }
    }, 50);
})();
