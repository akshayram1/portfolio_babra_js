/**
 * Main entry point for the application
 * Coordinates the loading and initialization of different modules
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize custom cursor if present
    initCursor();

    // Preload critical images
    preloadImages('img.project-image');

    // Setup smooth scrolling for anchor links
    setupSmoothScroll();

    // Ensure site is always in dark mode
    setupDarkMode();

    // Ensure CSS is properly applied
    ensureCssIsApplied();

    // Fix navigation links to prevent the need for double-clicking
    fixNavigationLinks();

    console.log('Main.js loaded');
});

function initCursor() {
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

        // Change cursor style on hoverable elements
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

function setupSmoothScroll() {
    // Get all anchor links that point to ID elements
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            smoothScroll(targetId);
        });
    });
}

function setupDarkMode() {
    // Always enforce dark mode
    document.body.classList.remove('light-mode');

    // Clear any stored theme preference
    localStorage.removeItem('lightMode');
}

function ensureCssIsApplied() {
    // This function helps ensure that CSS is properly applied
    // especially for pages with inline styles
    const pages = ['about', 'contact', 'resume'];

    // Get current page from URL
    const currentUrl = window.location.pathname;
    const currentPage = currentUrl.split('/').pop().split('.')[0];

    if (pages.includes(currentPage)) {
        // Force reapplication of styles for current page
        document.body.classList.add('styles-refresh');
        setTimeout(() => {
            document.body.classList.remove('styles-refresh');
        }, 50);

        // Apply page-specific style initializations
        switch (currentPage) {
            case 'about':
                initPageStyles('about');
                break;
            case 'contact':
                initPageStyles('contact');
                break;
            case 'resume':
                initPageStyles('resume');
                break;
        }
    }
}

function initPageStyles(pageName) {
    console.log(`Initializing styles for ${pageName} page`);

    // Apply inline styles immediately
    const inlineStyles = document.querySelectorAll('style');
    if (inlineStyles.length > 0) {
        inlineStyles.forEach(styleElement => {
            // Force browser to reprocess the styles
            styleElement.disabled = true;
            setTimeout(() => {
                styleElement.disabled = false;
            }, 10);
        });
    }

    // Page-specific initializations
    if (pageName === 'about') {
        const projectCards = document.querySelectorAll('.about-content .project-card');
        if (projectCards.length > 0) {
            projectCards.forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'none';
            });
        }
    } else if (pageName === 'contact') {
        const contactProjects = document.querySelectorAll('.contact-projects .project-card');
        if (contactProjects.length > 0) {
            contactProjects.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                }, index * 150);
            });
        }
    } else if (pageName === 'resume') {
        // Initialize skill bars
        setTimeout(() => {
            const skillBars = document.querySelectorAll('.skill-progress');
            if (skillBars.length > 0) {
                skillBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width;
                });
            }
        }, 300);
    }
}

// Fix navigation links
function fixNavigationLinks() {
    const navLinks = document.querySelectorAll('.w-nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default navigation

            const href = this.getAttribute('href');
            const currentPath = window.location.pathname;

            // If we're already on this page, force a reload
            if (currentPath.endsWith(href)) {
                location.reload();
                return;
            }

            // Show loading indicator
            document.querySelector('.loading-screen').style.display = 'flex';

            // Navigate to the page directly rather than letting Barba handle it
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
}

// Add CSS to ensure styles are applied properly
const styleFixElement = document.createElement('style');
styleFixElement.textContent = `
    .styles-refresh { opacity: 0.99; }
    .about-content .project-card {
        opacity: 1 !important;
        transform: none !important;
        perspective: none !important;
    }
`;
document.head.appendChild(styleFixElement);
