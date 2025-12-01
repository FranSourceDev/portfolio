// Main application logic

// Lista de secciones principales (IDs válidos para navegación de secciones)
const MAIN_SECTIONS = ['home', 'projects', 'contact'];

// Navigation
function navigateTo(sectionId) {
    // Si no es una sección principal, hacer scroll al elemento dentro de la sección actual
    if (!MAIN_SECTIONS.includes(sectionId)) {
        const targetElement = document.getElementById(sectionId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
        return;
    }

    // Remove active class from all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Add active class to target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        // Scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    const activeLink = document.querySelector(`[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Load section-specific content
    if (sectionId === 'projects') {
        loadProjects();
    }

    // Close mobile menu
    const navLinks = document.getElementById('navLinks');
    navLinks?.classList.remove('active');
}

// Handle hash navigation
function handleHashChange() {
    const hash = window.location.hash.slice(1) || 'home';
    
    // Si es un anchor interno (no una sección principal), asegurarse de que home esté activo
    if (!MAIN_SECTIONS.includes(hash)) {
        // Activar la sección home si no hay ninguna sección activa
        const activeSection = document.querySelector('.section.active');
        if (!activeSection) {
            const homeSection = document.getElementById('home');
            if (homeSection) {
                homeSection.classList.add('active');
            }
        }
    }
    
    navigateTo(hash);
}

// Initialize app
async function initApp() {
    // Initialize auth
    await auth.init();

    // Setup navigation (solo para enlaces con hash #)
    document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            window.location.hash = href;
        });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    mobileMenuBtn?.addEventListener('click', () => {
        navLinks?.classList.toggle('active');
    });

    // Contact form handler
    const contactForm = document.getElementById('contactForm');
    contactForm?.addEventListener('submit', handleContactFormSubmit);

    // Load recent projects on home page
    loadRecentProjects();

    // Handle hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Initial navigation
    handleHashChange();

    // Setup ALL anchor links with hash navigation (including hero buttons)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                window.location.hash = href;
            }
        });
    });

    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.8)';
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
