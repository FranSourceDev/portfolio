// UI Components and utilities

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
        : '/placeholder.jpg';

    return `
    <div class="project-card" onclick="viewProject('${project._id}')">
      <img src="${imageUrl}" alt="${project.title}" class="project-image" onerror="this.src='/placeholder.jpg'">
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
        <div>
          <h3 style="margin-bottom: var(--spacing-sm); font-size: 1.25rem;">Tecnologías</h3>
          <div class="project-technologies">
            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
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
        : '/placeholder.jpg';

    return `
    <div class="admin-project-card">
      <img src="${imageUrl}" alt="${project.title}" class="admin-project-image" onerror="this.src='/placeholder.jpg'">
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
