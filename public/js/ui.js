// UI Components and utilities

// Placeholder image (SVG inline para evitar errores de carga)
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTI0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSIjNmI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U2luIGltYWdlbjwvdGV4dD48L3N2Zz4=';

// Show toast notification
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
    <div>${message}</div>
  `;

    container.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Show/hide modal
function showModal(content) {
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = content;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on overlay click
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('projectModal');
    const closeBtn = document.getElementById('closeModal');

    closeBtn?.addEventListener('click', hideModal);

    modal?.querySelector('.modal-overlay')?.addEventListener('click', hideModal);
});

// Render project card
function renderProjectCard(project) {
    const imageUrl = project.images && project.images.length > 0
        ? project.images[0]
        : PLACEHOLDER_IMAGE;

    return `
    <div class="project-card" onclick="viewProject('${project._id}')">
      <img src="${imageUrl}" alt="${project.title}" class="project-image" onerror="this.onerror=null; this.src='${PLACEHOLDER_IMAGE}'">
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        ${project.technologies && project.technologies.length > 0 ? `
          <div class="project-technologies">
            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// Render project detail modal
function renderProjectDetail(project) {
    const mediaGallery = [];

    if (project.images && project.images.length > 0) {
        project.images.forEach(img => {
            mediaGallery.push(`<img src="${img}" alt="${project.title}" style="width: 100%; border-radius: var(--radius-lg); margin-bottom: var(--spacing-md);">`);
        });
    }

    if (project.videos && project.videos.length > 0) {
        project.videos.forEach(video => {
            mediaGallery.push(`<video controls style="width: 100%; border-radius: var(--radius-lg); margin-bottom: var(--spacing-md);"><source src="${video}"></video>`);
        });
    }

    return `
    <div style="padding: var(--spacing-lg);">
      <h2 style="margin-bottom: var(--spacing-md);">${project.title}</h2>
      
      ${mediaGallery.length > 0 ? `
        <div style="margin-bottom: var(--spacing-lg);">
          ${mediaGallery.join('')}
        </div>
      ` : ''}
      
      <div style="margin-bottom: var(--spacing-lg);">
        <h3 style="margin-bottom: var(--spacing-sm); font-size: 1.25rem;">Descripción</h3>
        <p style="line-height: 1.7;">${project.description}</p>
      </div>
      
      ${project.technologies && project.technologies.length > 0 ? `
        <div style="margin-bottom: var(--spacing-lg);">
          <h3 style="margin-bottom: var(--spacing-sm); font-size: 1.25rem;">Tecnologías</h3>
          <div class="project-technologies">
            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>
        </div>
      ` : ''}
      
      ${(project.deployUrl || project.githubUrl) ? `
        <div style="margin-top: var(--spacing-xl); padding-top: var(--spacing-lg); border-top: 1px solid rgba(255, 255, 255, 0.1);">
          <div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap;">
            ${project.deployUrl ? `
              <a href="${project.deployUrl}" target="_blank" rel="noopener noreferrer" class="project-link-btn project-link-deploy">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V9m-4-4h4m-4-4v4m4-4l-8 8"/>
                </svg>
                Ver Demo
              </a>
            ` : ''}
            ${project.githubUrl ? `
              <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link-btn project-link-github">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Ver Código
              </a>
            ` : ''}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// Render admin project card
function renderAdminProjectCard(project) {
    const imageUrl = project.images && project.images.length > 0
        ? project.images[0]
        : PLACEHOLDER_IMAGE;

    return `
    <div class="admin-project-card">
      <img src="${imageUrl}" alt="${project.title}" class="admin-project-image" onerror="this.onerror=null; this.src='${PLACEHOLDER_IMAGE}'">
      <div class="admin-project-info">
        <h3>${project.title}</h3>
        <p style="color: var(--text-secondary); margin-bottom: var(--spacing-sm);">${project.description.substring(0, 150)}${project.description.length > 150 ? '...' : ''}</p>
        ${project.technologies && project.technologies.length > 0 ? `
          <div class="project-technologies">
            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>
        ` : ''}
      </div>
      <div class="admin-project-actions">
        <button class="btn-icon" onclick="editProject('${project._id}')" title="Editar">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M14 2l4 4-10 10H4v-4L14 2z" stroke-width="2"/>
          </svg>
        </button>
        <button class="btn-icon btn-danger" onclick="deleteProjectConfirm('${project._id}')" title="Eliminar">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M3 6h14M8 6V4h4v2m1 0v10a2 2 0 01-2 2H7a2 2 0 01-2-2V6h8z" stroke-width="2"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}

// Render project form
function renderProjectForm(project = null) {
    const isEdit = project !== null;

    return `
    <div style="padding: var(--spacing-lg);">
      <h2 style="margin-bottom: var(--spacing-xl);">${isEdit ? 'Editar' : 'Nuevo'} Proyecto</h2>
      
      <form id="projectForm" class="form">
        <div class="form-group">
          <label for="projectTitle">Título *</label>
          <input type="text" id="projectTitle" required value="${isEdit ? project.title : ''}" placeholder="Nombre del proyecto">
        </div>
        
        <div class="form-group">
          <label for="projectDescription">Descripción *</label>
          <textarea id="projectDescription" required placeholder="Describe tu proyecto...">${isEdit ? project.description : ''}</textarea>
        </div>
        
        <div class="form-group">
          <label for="projectTechnologies">Tecnologías (separadas por coma)</label>
          <input type="text" id="projectTechnologies" value="${isEdit && project.technologies ? project.technologies.join(', ') : ''}" placeholder="Python, Node.js, React">
        </div>
        
        <div class="form-group">
          <label for="projectDeployUrl">URL del Deploy (opcional)</label>
          <input type="url" id="projectDeployUrl" value="${isEdit && project.deployUrl ? project.deployUrl : ''}" placeholder="https://mi-proyecto.railway.app">
          <p style="font-size: 0.875rem; color: var(--text-tertiary); margin-top: var(--spacing-xs);">
            Enlace a la versión en vivo del proyecto
          </p>
        </div>
        
        <div class="form-group">
          <label for="projectGithubUrl">URL del Repositorio GitHub (opcional)</label>
          <input type="url" id="projectGithubUrl" value="${isEdit && project.githubUrl ? project.githubUrl : ''}" placeholder="https://github.com/usuario/repositorio">
          <p style="font-size: 0.875rem; color: var(--text-tertiary); margin-top: var(--spacing-xs);">
            Enlace al repositorio del código fuente
          </p>
        </div>
        
        <div class="form-group">
          <label for="projectFiles">Imágenes y Videos</label>
          <input type="file" id="projectFiles" multiple accept="image/*,video/*" style="padding: var(--spacing-sm);">
          <p style="font-size: 0.875rem; color: var(--text-tertiary); margin-top: var(--spacing-xs);">
            Puedes seleccionar múltiples archivos (imágenes y videos)
          </p>
        </div>
        
        ${isEdit && (project.images?.length > 0 || project.videos?.length > 0) ? `
          <div class="form-group">
            <label>Archivos actuales</label>
            <div style="display: flex; gap: var(--spacing-sm); flex-wrap: wrap;">
              ${project.images?.map(img => `
                <img src="${img}" alt="Preview" style="width: 100px; height: 100px; object-fit: cover; border-radius: var(--radius-md);">
              `).join('') || ''}
              ${project.videos?.map(video => `
                <video style="width: 100px; height: 100px; object-fit: cover; border-radius: var(--radius-md);"><source src="${video}"></video>
              `).join('') || ''}
            </div>
          </div>
        ` : ''}
        
        <div style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-lg);">
          <button type="submit" class="btn btn-primary" style="flex: 1;">
            ${isEdit ? 'Actualizar' : 'Crear'} Proyecto
          </button>
          <button type="button" class="btn btn-secondary" onclick="hideModal()">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `;
}
