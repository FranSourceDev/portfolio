// Projects page application logic

// Initialize projects page
async function initProjectsPage() {
    // Initialize auth
    await auth.init();

    // Load projects
    loadProjects();

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    mobileMenuBtn?.addEventListener('click', () => {
        navLinks?.classList.toggle('active');
        mobileMenuBtn?.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks?.classList.remove('active');
            mobileMenuBtn?.classList.remove('active');
        });
    });

    // Navbar scroll effect
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
    });
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectsPage);
} else {
    initProjectsPage();
}


