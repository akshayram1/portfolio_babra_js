// Global function needed by transitions.js
window.updatePageContent = function () {
    // This function will be called after each page transition
    updateActiveNavItem();
    initWebflow();

    // Scroll to top on page change
    window.scrollTo(0, 0);
};

document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen
    hideLoadingScreen();

    // Initialize page transitions
    const pageTransitions = new PageTransitions();

    // Initialize other app functionality
    initApp();
});

function hideLoadingScreen() {
    // Hide the loading screen with a fade-out animation
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            gsap.to(loadingScreen, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    loadingScreen.style.display = 'none';
                }
            });
        }, 500); // Short delay to ensure everything is loaded
    }
}

function initApp() {
    // Add active class to current navigation item
    updateActiveNavItem();

    // Initialize any other global app functionality
    initEventListeners();

    // Initialize webflow interactions that might be needed after Barba transitions
    initWebflow();
}

function initWebflow() {
    // Re-initialize Webflow interactions if they exist
    if (window.Webflow && window.Webflow.destroy) {
        window.Webflow.destroy();
    }
    if (window.Webflow && window.Webflow.ready) {
        window.Webflow.ready();
    }
    if (window.Webflow && window.Webflow.require) {
        const interact = window.Webflow.require('ix2');
        if (interact) {
            interact.init();
        }
    }
}

function updateActiveNavItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.w-nav-link');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath.includes(linkPath) && linkPath !== '/' && linkPath !== 'index.html') {
            link.classList.add('w--current');
        } else if ((currentPath === '/' || currentPath.includes('index.html')) && (linkPath === '/' || linkPath === 'index.html')) {
            link.classList.add('w--current');
        } else {
            link.classList.remove('w--current');
        }
    });
}

function initEventListeners() {
    // Form submission handling
    const contactForm = document.querySelector('.w-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Project filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', handleProjectFilter);
        });
    }

    // Mode toggle (dark/light)
    const modeToggle = document.querySelector('.mode-toggle');
    if (modeToggle) {
        modeToggle.addEventListener('click', toggleDarkMode);
    }
}

function toggleDarkMode() {
    // Toggle the light-mode class instead of dark-mode (since dark is default)
    document.body.classList.toggle('light-mode');

    const icon = document.querySelector('.mode-toggle i');
    if (icon) {
        // Update icon based on the current mode
        if (document.body.classList.contains('light-mode')) {
            // In light mode, show the moon (to switch to dark)
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            // In dark mode, show the sun (to switch to light)
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    // Store preference in localStorage
    const isLightMode = document.body.classList.contains('light-mode');
    localStorage.setItem('lightMode', isLightMode);
}

function handleFormSubmit(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());

    // Here you would typically send the data to your server
    console.log('Form submitted with values:', formValues);

    // Show success message using Webflow classes
    const formBlock = e.target.closest('.w-form');
    const successBlock = formBlock.querySelector('.w-form-done');
    const errorBlock = formBlock.querySelector('.w-form-fail');

    if (successBlock) {
        formBlock.style.display = 'none';
        successBlock.style.display = 'block';

        // Reset form
        e.target.reset();

        // Hide success message after a few seconds
        setTimeout(() => {
            formBlock.style.display = 'block';
            successBlock.style.display = 'none';
        }, 5000);
    }
}

function handleProjectFilter(e) {
    const filter = e.target.dataset.filter;
    const projects = document.querySelectorAll('.w-dyn-item');

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('w--current');
    });
    e.target.classList.add('w--current');

    // Filter projects
    projects.forEach(project => {
        if (filter === 'all' || project.dataset.category === filter) {
            gsap.to(project, { opacity: 1, scale: 1, duration: 0.5, display: 'block' });
        } else {
            gsap.to(project, {
                opacity: 0,
                scale: 0.9,
                duration: 0.5,
                onComplete: () => {
                    project.style.display = 'none';
                }
            });
        }
    });
}
