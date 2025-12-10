// CV management functions

let currentCV = null;

// Load CV from API
async function loadCV() {
    try {
        const response = await api.getCV();
        
        if (response.success) {
            currentCV = response.data;
            return currentCV;
        }
        
        return null;
    } catch (error) {
        console.error('Error loading CV:', error);
        return null;
    }
}

// Render CV in cv.html
function renderCV(cv) {
    if (!cv) {
        // Show default/placeholder content
        return;
    }

    const container = document.querySelector('.cv-container');
    if (!container) return;

    // Personal Info
    if (cv.personalInfo) {
        const nameEl = container.querySelector('.cv-name');
        const titleEl = container.querySelector('.cv-title');
        const contactEl = container.querySelector('.cv-contact');
        
        if (nameEl && cv.personalInfo.name) nameEl.textContent = cv.personalInfo.name;
        if (titleEl && cv.personalInfo.title) titleEl.textContent = cv.personalInfo.title;
        
        if (contactEl) {
            const contactItems = [];
            if (cv.personalInfo.email) contactItems.push(`📧 ${cv.personalInfo.email}`);
            if (cv.personalInfo.phone) contactItems.push(`📱 ${cv.personalInfo.phone}`);
            if (cv.personalInfo.location) contactItems.push(`📍 ${cv.personalInfo.location}`);
            contactEl.innerHTML = contactItems.map(item => `<span>${item}</span>`).join('');
        }
    }

    // Summary
    const summaryEl = container.querySelector('.cv-section-block:first-of-type .cv-text');
    if (summaryEl && cv.summary) {
        summaryEl.textContent = cv.summary;
    }

    // Experience (optional - only show if there's data)
    const experienceBlock = container.querySelectorAll('.cv-section-block')[1];
    if (experienceBlock) {
        if (cv.experience && cv.experience.length > 0) {
            const experienceHTML = cv.experience.map(exp => `
                <div class="cv-item">
                    <div class="cv-item-header">
                        <h3 class="cv-item-title">${exp.position || ''}</h3>
                        <span class="cv-item-date">${exp.startDate || ''} ${exp.current ? '- Presente' : exp.endDate ? `- ${exp.endDate}` : ''}</span>
                    </div>
                    <p class="cv-item-company">${exp.company || ''}</p>
                    ${exp.description ? `<p class="cv-text" style="margin-top: var(--spacing-sm);">${exp.description}</p>` : ''}
                    ${exp.achievements && exp.achievements.length > 0 ? `
                        <ul class="cv-item-list">
                            ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            `).join('');
            experienceBlock.innerHTML = `
                <h2 class="cv-section-title">Experiencia Laboral</h2>
                ${experienceHTML}
            `;
            experienceBlock.style.display = 'block';
        } else {
            // Hide experience section if empty
            experienceBlock.style.display = 'none';
        }
    }

    // Education
    const educationBlocks = container.querySelectorAll('.cv-section-block');
    const educationBlock = Array.from(educationBlocks).find(block => 
        block.querySelector('.cv-section-title')?.textContent === 'Educación'
    );
    if (educationBlock && cv.education && cv.education.length > 0) {
        const educationHTML = cv.education.map(edu => `
            <div class="cv-item">
                <div class="cv-item-header">
                    <h3 class="cv-item-title">${edu.degree || ''}</h3>
                    <span class="cv-item-date">${edu.startDate || ''} ${edu.endDate ? `- ${edu.endDate}` : ''}</span>
                </div>
                <p class="cv-item-company">${edu.institution || ''}</p>
            </div>
        `).join('');
        educationBlock.innerHTML = `
            <h2 class="cv-section-title">Educación</h2>
            ${educationHTML}
        `;
    }

    // Skills
    const skillsBlock = Array.from(educationBlocks).find(block => 
        block.querySelector('.cv-section-title')?.textContent === 'Habilidades Técnicas'
    );
    if (skillsBlock && cv.skills && cv.skills.length > 0) {
        const skillsHTML = cv.skills.map(skill => `
            <div class="cv-skill-category">
                <h4 class="cv-skill-title">${skill.category || ''}</h4>
                <div class="cv-skill-tags">
                    ${skill.items.map(item => `<span class="cv-skill-tag">${item}</span>`).join('')}
                </div>
            </div>
        `).join('');
        skillsBlock.innerHTML = `
            <h2 class="cv-section-title">Habilidades Técnicas</h2>
            <div class="cv-skills">
                ${skillsHTML}
            </div>
        `;
    }

    // Certifications
    const certBlock = Array.from(educationBlocks).find(block => 
        block.querySelector('.cv-section-title')?.textContent === 'Certificaciones'
    );
    if (certBlock && cv.certifications && cv.certifications.length > 0) {
        const certHTML = cv.certifications.map(cert => `
            <div class="cv-item">
                <div class="cv-item-header">
                    <h3 class="cv-item-title">${cert.name || ''}</h3>
                    <span class="cv-item-date">${cert.date || ''}</span>
                </div>
                <p class="cv-item-company">${cert.institution || ''}</p>
            </div>
        `).join('');
        certBlock.innerHTML = `
            <h2 class="cv-section-title">Certificaciones</h2>
            ${certHTML}
        `;
    }

    // Languages
    const langBlock = Array.from(educationBlocks).find(block => 
        block.querySelector('.cv-section-title')?.textContent === 'Idiomas'
    );
    if (langBlock && cv.languages && cv.languages.length > 0) {
        const langHTML = cv.languages.map(lang => `
            <div class="cv-language-item">
                <span class="cv-language-name">${lang.name || ''}</span>
                <span class="cv-language-level">${lang.level || ''}</span>
            </div>
        `).join('');
        langBlock.innerHTML = `
            <h2 class="cv-section-title">Idiomas</h2>
            <div class="cv-languages">
                ${langHTML}
            </div>
        `;
    }

    // PDF URL
    if (cv.pdfUrl) {
        const downloadBtn = document.getElementById('cvDownloadBtn');
        if (downloadBtn) {
            downloadBtn.href = cv.pdfUrl;
            downloadBtn.style.display = 'inline-flex';
        }
    }
}

// Render CV form for editing
function renderCVForm(cv = null) {
    // Ensure cvData has all required fields even if cv is null or incomplete
    const cvData = {
        personalInfo: {
            name: cv?.personalInfo?.name || '',
            title: cv?.personalInfo?.title || '',
            email: cv?.personalInfo?.email || '',
            phone: cv?.personalInfo?.phone || '',
            location: cv?.personalInfo?.location || ''
        },
        summary: cv?.summary || '',
        experience: Array.isArray(cv?.experience) ? cv.experience : [],
        education: Array.isArray(cv?.education) ? cv.education : [],
        skills: Array.isArray(cv?.skills) ? cv.skills : [],
        certifications: Array.isArray(cv?.certifications) ? cv.certifications : [],
        languages: Array.isArray(cv?.languages) ? cv.languages : [],
        pdfUrl: cv?.pdfUrl || ''
    };

    return `
    <div style="padding: var(--spacing-lg); max-height: 90vh; overflow-y: auto;">
      <h2 style="margin-bottom: var(--spacing-xl);">Editar CV</h2>
      
      <form id="cvForm" class="form">
        <!-- Personal Info -->
        <div style="margin-bottom: var(--spacing-xl);">
          <h3 style="margin-bottom: var(--spacing-md); color: var(--text-primary);">Información Personal</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="cvName">Nombre *</label>
              <input type="text" id="cvName" required value="${cvData.personalInfo?.name || ''}" placeholder="Tu nombre completo">
            </div>
            <div class="form-group">
              <label for="cvTitle">Título Profesional *</label>
              <input type="text" id="cvTitle" required value="${cvData.personalInfo?.title || ''}" placeholder="Desarrollador Full Stack">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="cvEmail">Email</label>
              <input type="email" id="cvEmail" value="${cvData.personalInfo?.email || ''}" placeholder="tu@email.com">
            </div>
            <div class="form-group">
              <label for="cvPhone">Teléfono</label>
              <input type="text" id="cvPhone" value="${cvData.personalInfo?.phone || ''}" placeholder="+XX XXX XXX XXX">
            </div>
          </div>
          <div class="form-group">
            <label for="cvLocation">Ubicación</label>
            <input type="text" id="cvLocation" value="${cvData.personalInfo?.location || ''}" placeholder="Ciudad, País">
          </div>
        </div>

        <!-- Summary -->
        <div class="form-group" style="margin-bottom: var(--spacing-xl);">
          <label for="cvSummary">Resumen Profesional</label>
          <textarea id="cvSummary" rows="5" placeholder="Describe tu experiencia profesional...">${cvData.summary || ''}</textarea>
        </div>

        <!-- Experience -->
        <div style="margin-bottom: var(--spacing-xl);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
            <h3 style="color: var(--text-primary);">Experiencia Laboral</h3>
            <button type="button" class="btn btn-secondary" onclick="addExperienceItem()" style="padding: var(--spacing-xs) var(--spacing-md); font-size: 0.875rem;">
              + Agregar
            </button>
          </div>
          <div id="experienceItems">
            ${(cvData.experience || []).map((exp, idx) => renderExperienceItem(exp, idx)).join('')}
          </div>
        </div>

        <!-- Education -->
        <div style="margin-bottom: var(--spacing-xl);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
            <h3 style="color: var(--text-primary);">Educación</h3>
            <button type="button" class="btn btn-secondary" onclick="addEducationItem()" style="padding: var(--spacing-xs) var(--spacing-md); font-size: 0.875rem;">
              + Agregar
            </button>
          </div>
          <div id="educationItems">
            ${(cvData.education || []).map((edu, idx) => renderEducationItem(edu, idx)).join('')}
          </div>
        </div>

        <!-- Skills -->
        <div style="margin-bottom: var(--spacing-xl);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
            <h3 style="color: var(--text-primary);">Habilidades Técnicas</h3>
            <button type="button" class="btn btn-secondary" onclick="addSkillCategory()" style="padding: var(--spacing-xs) var(--spacing-md); font-size: 0.875rem;">
              + Agregar Categoría
            </button>
          </div>
          <div id="skillCategories">
            ${(cvData.skills || []).map((skill, idx) => renderSkillCategory(skill, idx)).join('')}
          </div>
        </div>

        <!-- Certifications -->
        <div style="margin-bottom: var(--spacing-xl);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
            <h3 style="color: var(--text-primary);">Certificaciones</h3>
            <button type="button" class="btn btn-secondary" onclick="addCertificationItem()" style="padding: var(--spacing-xs) var(--spacing-md); font-size: 0.875rem;">
              + Agregar
            </button>
          </div>
          <div id="certificationItems">
            ${(cvData.certifications || []).map((cert, idx) => renderCertificationItem(cert, idx)).join('')}
          </div>
        </div>

        <!-- Languages -->
        <div style="margin-bottom: var(--spacing-xl);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
            <h3 style="color: var(--text-primary);">Idiomas</h3>
            <button type="button" class="btn btn-secondary" onclick="addLanguageItem()" style="padding: var(--spacing-xs) var(--spacing-md); font-size: 0.875rem;">
              + Agregar
            </button>
          </div>
          <div id="languageItems">
            ${(cvData.languages || []).map((lang, idx) => renderLanguageItem(lang, idx)).join('')}
          </div>
        </div>

        <!-- PDF URL -->
        <div class="form-group" style="margin-bottom: var(--spacing-xl);">
          <label for="cvPdfUrl">URL del PDF (opcional)</label>
          <input type="url" id="cvPdfUrl" value="${cvData.pdfUrl || ''}" placeholder="https://ejemplo.com/cv.pdf">
        </div>

        <div style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-lg);">
          <button type="submit" class="btn btn-primary" style="flex: 1;">
            Guardar CV
          </button>
          <button type="button" class="btn btn-secondary" onclick="hideModal()">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `;
}

// Helper functions to render form items
function renderExperienceItem(exp = {}, idx) {
    return `
    <div class="cv-form-item" data-index="${idx}" style="background: var(--bg-card); padding: var(--spacing-md); border-radius: var(--radius-lg); margin-bottom: var(--spacing-md); border: 1px solid rgba(255, 255, 255, 0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-sm);">
        <h4 style="color: var(--text-primary); margin: 0;">Experiencia ${idx + 1}</h4>
        <button type="button" class="btn btn-secondary" onclick="removeExperienceItem(${idx})" style="padding: var(--spacing-xs) var(--spacing-sm); font-size: 0.75rem;">
          Eliminar
        </button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Puesto</label>
          <input type="text" name="exp-position-${idx}" value="${exp.position || ''}" placeholder="Desarrollador Full Stack">
        </div>
        <div class="form-group">
          <label>Empresa</label>
          <input type="text" name="exp-company-${idx}" value="${exp.company || ''}" placeholder="Nombre de la empresa">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Fecha Inicio</label>
          <input type="text" name="exp-start-${idx}" value="${exp.startDate || ''}" placeholder="2020">
        </div>
        <div class="form-group">
          <label>Fecha Fin</label>
          <input type="text" name="exp-end-${idx}" value="${exp.endDate || ''}" placeholder="2023">
        </div>
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" name="exp-current-${idx}" ${exp.current ? 'checked' : ''}> Trabajo Actual
        </label>
      </div>
      <div class="form-group">
        <label>Descripción</label>
        <textarea name="exp-description-${idx}" rows="3" placeholder="Describe tus responsabilidades...">${exp.description || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Logros (uno por línea)</label>
        <textarea name="exp-achievements-${idx}" rows="3" placeholder="Logro 1&#10;Logro 2">${(exp.achievements || []).join('\n')}</textarea>
      </div>
    </div>
  `;
}

function renderEducationItem(edu = {}, idx) {
    return `
    <div class="cv-form-item" data-index="${idx}" style="background: var(--bg-card); padding: var(--spacing-md); border-radius: var(--radius-lg); margin-bottom: var(--spacing-md); border: 1px solid rgba(255, 255, 255, 0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-sm);">
        <h4 style="color: var(--text-primary); margin: 0;">Educación ${idx + 1}</h4>
        <button type="button" class="btn btn-secondary" onclick="removeEducationItem(${idx})" style="padding: var(--spacing-xs) var(--spacing-sm); font-size: 0.75rem;">
          Eliminar
        </button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Título</label>
          <input type="text" name="edu-degree-${idx}" value="${edu.degree || ''}" placeholder="Ingeniería en Sistemas">
        </div>
        <div class="form-group">
          <label>Institución</label>
          <input type="text" name="edu-institution-${idx}" value="${edu.institution || ''}" placeholder="Universidad">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Fecha Inicio</label>
          <input type="text" name="edu-start-${idx}" value="${edu.startDate || ''}" placeholder="2014">
        </div>
        <div class="form-group">
          <label>Fecha Fin</label>
          <input type="text" name="edu-end-${idx}" value="${edu.endDate || ''}" placeholder="2018">
        </div>
      </div>
    </div>
  `;
}

function renderSkillCategory(skill = {}, idx) {
    return `
    <div class="cv-form-item" data-index="${idx}" style="background: var(--bg-card); padding: var(--spacing-md); border-radius: var(--radius-lg); margin-bottom: var(--spacing-md); border: 1px solid rgba(255, 255, 255, 0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-sm);">
        <h4 style="color: var(--text-primary); margin: 0;">Categoría ${idx + 1}</h4>
        <button type="button" class="btn btn-secondary" onclick="removeSkillCategory(${idx})" style="padding: var(--spacing-xs) var(--spacing-sm); font-size: 0.75rem;">
          Eliminar
        </button>
      </div>
      <div class="form-group">
        <label>Nombre de la Categoría</label>
        <input type="text" name="skill-category-${idx}" value="${skill.category || ''}" placeholder="Lenguajes de Programación">
      </div>
      <div class="form-group">
        <label>Habilidades (separadas por coma)</label>
        <input type="text" name="skill-items-${idx}" value="${(skill.items || []).join(', ')}" placeholder="JavaScript, Python, Node.js">
      </div>
    </div>
  `;
}

function renderCertificationItem(cert = {}, idx) {
    return `
    <div class="cv-form-item" data-index="${idx}" style="background: var(--bg-card); padding: var(--spacing-md); border-radius: var(--radius-lg); margin-bottom: var(--spacing-md); border: 1px solid rgba(255, 255, 255, 0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-sm);">
        <h4 style="color: var(--text-primary); margin: 0;">Certificación ${idx + 1}</h4>
        <button type="button" class="btn btn-secondary" onclick="removeCertificationItem(${idx})" style="padding: var(--spacing-xs) var(--spacing-sm); font-size: 0.75rem;">
          Eliminar
        </button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Nombre</label>
          <input type="text" name="cert-name-${idx}" value="${cert.name || ''}" placeholder="Nombre de la certificación">
        </div>
        <div class="form-group">
          <label>Institución</label>
          <input type="text" name="cert-institution-${idx}" value="${cert.institution || ''}" placeholder="Institución emisora">
        </div>
      </div>
      <div class="form-group">
        <label>Fecha</label>
        <input type="text" name="cert-date-${idx}" value="${cert.date || ''}" placeholder="2023">
      </div>
    </div>
  `;
}

function renderLanguageItem(lang = {}, idx) {
    return `
    <div class="cv-form-item" data-index="${idx}" style="background: var(--bg-card); padding: var(--spacing-md); border-radius: var(--radius-lg); margin-bottom: var(--spacing-md); border: 1px solid rgba(255, 255, 255, 0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-sm);">
        <h4 style="color: var(--text-primary); margin: 0;">Idioma ${idx + 1}</h4>
        <button type="button" class="btn btn-secondary" onclick="removeLanguageItem(${idx})" style="padding: var(--spacing-xs) var(--spacing-sm); font-size: 0.75rem;">
          Eliminar
        </button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Idioma</label>
          <input type="text" name="lang-name-${idx}" value="${lang.name || ''}" placeholder="Español">
        </div>
        <div class="form-group">
          <label>Nivel</label>
          <select name="lang-level-${idx}">
            <option value="Básico" ${lang.level === 'Básico' ? 'selected' : ''}>Básico</option>
            <option value="Intermedio" ${lang.level === 'Intermedio' ? 'selected' : ''}>Intermedio</option>
            <option value="Avanzado" ${lang.level === 'Avanzado' ? 'selected' : ''}>Avanzado</option>
            <option value="Nativo" ${lang.level === 'Nativo' ? 'selected' : ''}>Nativo</option>
          </select>
        </div>
      </div>
    </div>
  `;
}

// Functions to add/remove items dynamically
let experienceIndex = 0;
let educationIndex = 0;
let skillIndex = 0;
let certIndex = 0;
let langIndex = 0;

function addExperienceItem() {
    const container = document.getElementById('experienceItems');
    if (!container) return;
    
    const idx = experienceIndex++;
    const item = renderExperienceItem({}, idx);
    container.insertAdjacentHTML('beforeend', item);
}

function removeExperienceItem(idx) {
    const item = document.querySelector(`#experienceItems .cv-form-item[data-index="${idx}"]`);
    if (item) item.remove();
}

function addEducationItem() {
    const container = document.getElementById('educationItems');
    if (!container) return;
    
    const idx = educationIndex++;
    const item = renderEducationItem({}, idx);
    container.insertAdjacentHTML('beforeend', item);
}

function removeEducationItem(idx) {
    const item = document.querySelector(`#educationItems .cv-form-item[data-index="${idx}"]`);
    if (item) item.remove();
}

function addSkillCategory() {
    const container = document.getElementById('skillCategories');
    if (!container) return;
    
    const idx = skillIndex++;
    const item = renderSkillCategory({}, idx);
    container.insertAdjacentHTML('beforeend', item);
}

function removeSkillCategory(idx) {
    const item = document.querySelector(`#skillCategories .cv-form-item[data-index="${idx}"]`);
    if (item) item.remove();
}

function addCertificationItem() {
    const container = document.getElementById('certificationItems');
    if (!container) return;
    
    const idx = certIndex++;
    const item = renderCertificationItem({}, idx);
    container.insertAdjacentHTML('beforeend', item);
}

function removeCertificationItem(idx) {
    const item = document.querySelector(`#certificationItems .cv-form-item[data-index="${idx}"]`);
    if (item) item.remove();
}

function addLanguageItem() {
    const container = document.getElementById('languageItems');
    if (!container) return;
    
    const idx = langIndex++;
    const item = renderLanguageItem({}, idx);
    container.insertAdjacentHTML('beforeend', item);
}

function removeLanguageItem(idx) {
    const item = document.querySelector(`#languageItems .cv-form-item[data-index="${idx}"]`);
    if (item) item.remove();
}

// Handle CV form submission
async function handleCVSubmit(e) {
    e.preventDefault();
    
    if (!auth.requireAuth()) return;

    // Collect form data
    const cvData = {
        personalInfo: {
            name: document.getElementById('cvName').value,
            title: document.getElementById('cvTitle').value,
            email: document.getElementById('cvEmail').value,
            phone: document.getElementById('cvPhone').value,
            location: document.getElementById('cvLocation').value
        },
        summary: document.getElementById('cvSummary').value,
        experience: collectExperienceData(),
        education: collectEducationData(),
        skills: collectSkillsData(),
        certifications: collectCertificationsData(),
        languages: collectLanguagesData(),
        pdfUrl: document.getElementById('cvPdfUrl').value || undefined
    };

    try {
        const response = await api.updateCV(cvData);
        
        if (response.success) {
            showToast('CV actualizado exitosamente', 'success');
            hideModal();
            currentCV = response.data;
        }
    } catch (error) {
        console.error('Error saving CV:', error);
        showToast(error.message || 'Error al guardar el CV', 'error');
    }
}

// Helper functions to collect form data
function collectExperienceData() {
    const items = [];
    const containers = document.querySelectorAll('#experienceItems .cv-form-item');
    
    containers.forEach((container) => {
        const idx = container.getAttribute('data-index');
        items.push({
            position: container.querySelector(`input[name="exp-position-${idx}"]`)?.value || '',
            company: container.querySelector(`input[name="exp-company-${idx}"]`)?.value || '',
            startDate: container.querySelector(`input[name="exp-start-${idx}"]`)?.value || '',
            endDate: container.querySelector(`input[name="exp-end-${idx}"]`)?.value || '',
            current: container.querySelector(`input[name="exp-current-${idx}"]`)?.checked || false,
            description: container.querySelector(`textarea[name="exp-description-${idx}"]`)?.value || '',
            achievements: container.querySelector(`textarea[name="exp-achievements-${idx}"]`)?.value.split('\n').filter(a => a.trim())
        });
    });
    
    return items;
}

function collectEducationData() {
    const items = [];
    const containers = document.querySelectorAll('#educationItems .cv-form-item');
    
    containers.forEach((container) => {
        const idx = container.getAttribute('data-index');
        items.push({
            degree: container.querySelector(`input[name="edu-degree-${idx}"]`)?.value || '',
            institution: container.querySelector(`input[name="edu-institution-${idx}"]`)?.value || '',
            startDate: container.querySelector(`input[name="edu-start-${idx}"]`)?.value || '',
            endDate: container.querySelector(`input[name="edu-end-${idx}"]`)?.value || ''
        });
    });
    
    return items;
}

function collectSkillsData() {
    const items = [];
    const containers = document.querySelectorAll('#skillCategories .cv-form-item');
    
    containers.forEach((container) => {
        const idx = container.getAttribute('data-index');
        const itemsStr = container.querySelector(`input[name="skill-items-${idx}"]`)?.value || '';
        items.push({
            category: container.querySelector(`input[name="skill-category-${idx}"]`)?.value || '',
            items: itemsStr.split(',').map(item => item.trim()).filter(item => item)
        });
    });
    
    return items;
}

function collectCertificationsData() {
    const items = [];
    const containers = document.querySelectorAll('#certificationItems .cv-form-item');
    
    containers.forEach((container) => {
        const idx = container.getAttribute('data-index');
        items.push({
            name: container.querySelector(`input[name="cert-name-${idx}"]`)?.value || '',
            institution: container.querySelector(`input[name="cert-institution-${idx}"]`)?.value || '',
            date: container.querySelector(`input[name="cert-date-${idx}"]`)?.value || ''
        });
    });
    
    return items;
}

function collectLanguagesData() {
    const items = [];
    const containers = document.querySelectorAll('#languageItems .cv-form-item');
    
    containers.forEach((container) => {
        const idx = container.getAttribute('data-index');
        items.push({
            name: container.querySelector(`input[name="lang-name-${idx}"]`)?.value || '',
            level: container.querySelector(`select[name="lang-level-${idx}"]`)?.value || ''
        });
    });
    
    return items;
}

// Show CV edit form
async function showCVForm() {
    console.log('showCVForm called');
    
    if (!auth || !auth.requireAuth()) {
        console.error('Auth not available or not authenticated');
        return;
    }

    try {
        console.log('Loading CV from API...');
        const response = await api.getCV();
        console.log('CV API response:', response);
        
        // Handle case when CV doesn't exist (null or empty)
        const cv = response.success && response.data ? response.data : null;
        console.log('CV data:', cv);
        
        console.log('Rendering CV form...');
        const formHTML = renderCVForm(cv);
        
        if (!formHTML) {
            console.error('renderCVForm returned empty');
            showToast('Error al generar el formulario', 'error');
            return;
        }
        
        const modalBody = document.getElementById('modalBody');
        if (!modalBody) {
            console.error('Modal body not found');
            showToast('Error: no se encontró el modal', 'error');
            return;
        }
        
        if (typeof showModal !== 'function') {
            console.error('showModal is not a function');
            showToast('Error: función showModal no disponible', 'error');
            return;
        }
        
        console.log('Showing modal with content...');
        // Pass the HTML content to showModal
        showModal(formHTML);
        
        // Reset indices to continue from existing items
        const existingExp = (cv?.experience?.length || 0);
        const existingEdu = (cv?.education?.length || 0);
        const existingSkill = (cv?.skills?.length || 0);
        const existingCert = (cv?.certifications?.length || 0);
        const existingLang = (cv?.languages?.length || 0);
        
        experienceIndex = existingExp;
        educationIndex = existingEdu;
        skillIndex = existingSkill;
        certIndex = existingCert;
        langIndex = existingLang;
        
        // Wait for DOM to update before attaching form handler
        setTimeout(() => {
            const form = document.getElementById('cvForm');
            if (form) {
                form.addEventListener('submit', handleCVSubmit);
                console.log('CV form ready');
            } else {
                console.error('CV form not found after rendering');
                console.log('Modal body content:', document.getElementById('modalBody')?.innerHTML?.substring(0, 200));
            }
        }, 100);
    } catch (error) {
        console.error('Error loading CV for editing:', error);
        showToast(error.message || 'Error al cargar el CV', 'error');
    }
}

// Make functions available globally for inline event handlers
window.addExperienceItem = addExperienceItem;
window.removeExperienceItem = removeExperienceItem;
window.addEducationItem = addEducationItem;
window.removeEducationItem = removeEducationItem;
window.addSkillCategory = addSkillCategory;
window.removeSkillCategory = removeSkillCategory;
window.addCertificationItem = addCertificationItem;
window.removeCertificationItem = removeCertificationItem;
window.addLanguageItem = addLanguageItem;
window.removeLanguageItem = removeLanguageItem;
window.showCVForm = showCVForm;

