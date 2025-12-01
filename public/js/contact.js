// Load recent projects for home page
async function loadRecentProjects() {
    const grid = document.getElementById('recentProjectsGrid');

    if (!grid) return;

    try {
        grid.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Cargando proyectos...</p></div>';

        const response = await api.getProjects();

        if (response.success && response.data.length > 0) {
            // Get only the last 2 projects
            const recentProjects = response.data.slice(0, 2);
            grid.innerHTML = recentProjects.map(project => renderProjectCard(project)).join('');
        } else {
            grid.innerHTML = '<div class="empty-state"><p>Aún no hay proyectos. ¡Pronto habrá novedades!</p></div>';
        }
    } catch (error) {
        console.error('Error loading recent projects:', error);
        grid.innerHTML = '<div class="empty-state"><p>Error al cargar proyectos</p></div>';
    }
}

// Handle contact form submission
async function handleContactFormSubmit(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('contactSubmitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    // Get form data
    const formData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value
    };

    try {
        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';

        // Send contact form
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            showToast(data.message || 'Mensaje enviado exitosamente', 'success');
            // Reset form
            document.getElementById('contactForm').reset();
        } else {
            showToast(data.message || 'Error al enviar el mensaje', 'error');
        }
    } catch (error) {
        console.error('Contact form error:', error);
        showToast('Error al enviar el mensaje. Por favor intenta de nuevo.', 'error');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}
