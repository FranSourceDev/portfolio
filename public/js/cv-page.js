// CV page application logic

// Initialize CV page
async function initCVPage() {
    // Initialize auth
    await auth.init();

    // Check if PDF exists and show download button
    checkPDFExists();

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

// Check if PDF file exists
function checkPDFExists() {
    const downloadBtn = document.getElementById('cvDownloadBtn');
    if (!downloadBtn) return;

    fetch('/cv.pdf', { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                downloadBtn.style.display = 'inline-flex';
            }
        })
        .catch(() => {
            // PDF doesn't exist, button stays hidden
        });
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCVPage);
} else {
    initCVPage();
}

