// Projects management

// Load and display all projects
async function loadProjects() {
    const grid = document.getElementById('projectsGrid');

    try {
        grid.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Cargando proyectos...</p></div>';

        const response = await api.getProjects();

        if (response.success && response.data.length > 0) {
            grid.innerHTML = response.data.map(project => renderProjectCard(project)).join('');
        } else {
            grid.innerHTML = '<div class="empty-state"><p>No hay proyectos disponibles</p></div>';
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        grid.innerHTML = '<div class="empty-state"><p>Error al cargar proyectos</p></div>';
    }
}

// View project details
async function viewProject(id) {
    try {
        const response = await api.getProject(id);

        if (response.success) {
            const content = renderProjectDetail(response.data);
            showModal(content);
        }
    } catch (error) {
        console.error('Error loading project:', error);
        showToast('Error al cargar el proyecto', 'error');
    }
}

// Load admin projects
async function loadAdminProjects() {
    const list = document.getElementById('adminProjectsList');

    try {
        list.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Cargando proyectos...</p></div>';

        const response = await api.getProjects();

        if (response.success && response.data.length > 0) {
            list.innerHTML = response.data.map(project => renderAdminProjectCard(project)).join('');
        } else {
            list.innerHTML = '<div class="empty-state"><p>No hay proyectos. Crea uno nuevo para comenzar.</p></div>';
        }
    } catch (error) {
        console.error('Error loading admin projects:', error);
        list.innerHTML = '<div class="empty-state"><p>Error al cargar proyectos</p></div>';
    }
}

// Show new project form
function showNewProjectForm() {
    if (!auth.requireAuth()) return;

    const content = renderProjectForm();
    showModal(content);

    // Attach form submit handler
    setTimeout(() => {
        const form = document.getElementById('projectForm');
        form.addEventListener('submit', handleProjectSubmit);
    }, 100);
}

// Show edit project form
async function editProject(id) {
    if (!auth.requireAuth()) return;

    try {
        const response = await api.getProject(id);

        if (response.success) {
            const content = renderProjectForm(response.data);
            showModal(content);

            // Attach form submit handler
            setTimeout(() => {
                const form = document.getElementById('projectForm');
                form.addEventListener('submit', (e) => handleProjectSubmit(e, id));
            }, 100);
        }
    } catch (error) {
        console.error('Error loading project:', error);
        showToast('Error al cargar el proyecto', 'error');
    }
}

// Handle project form submission
async function handleProjectSubmit(e, projectId = null) {
    e.preventDefault();

    const title = document.getElementById('projectTitle').value;
    const description = document.getElementById('projectDescription').value;
    const technologies = document.getElementById('projectTechnologies').value;
    const files = document.getElementById('projectFiles').files;

    // Create FormData
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);

    if (technologies) {
        formData.append('technologies', technologies);
    }

    // Add files
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    try {
        let response;

        if (projectId) {
            response = await api.updateProject(projectId, formData);
            showToast('Proyecto actualizado exitosamente', 'success');
        } else {
            response = await api.createProject(formData);
            showToast('Proyecto creado exitosamente', 'success');
        }

        hideModal();

        // Reload projects (detectar si estamos en admin.html o en index.html)
        if (window.location.pathname.includes('admin')) {
            loadAdminProjects();
        } else if (document.getElementById('projectsGrid')) {
            loadProjects();
        }
    } catch (error) {
        console.error('Error saving project:', error);
        showToast(error.message || 'Error al guardar el proyecto', 'error');
    }
}

// Delete project with confirmation
function deleteProjectConfirm(id) {
    if (!auth.requireAuth()) return;

    const content = `
    <div style="padding: var(--spacing-2xl); text-align: center;">
      <h2 style="margin-bottom: var(--spacing-md);">¿Eliminar proyecto?</h2>
      <p style="margin-bottom: var(--spacing-xl); color: var(--text-secondary);">
        Esta acción no se puede deshacer. El proyecto y todos sus archivos serán eliminados permanentemente.
      </p>
      <div style="display: flex; gap: var(--spacing-md); justify-content: center;">
        <button class="btn btn-secondary" onclick="hideModal()">Cancelar</button>
        <button class="btn btn-primary" style="background: var(--gradient-accent);" onclick="deleteProject('${id}')">
          Eliminar
        </button>
      </div>
    </div>
  `;

    showModal(content);
}

// Delete project
async function deleteProject(id) {
    try {
        await api.deleteProject(id);
        showToast('Proyecto eliminado exitosamente', 'success');
        hideModal();
        loadAdminProjects();
    } catch (error) {
        console.error('Error deleting project:', error);
        showToast('Error al eliminar el proyecto', 'error');
    }
}
