// API Base URL
const API_URL = '/api';

// API Client with JWT token handling
class APIClient {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    // Set authorization token
    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    // Clear authorization token
    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
    }

    // Get authorization headers
    getHeaders(includeAuth = false) {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (includeAuth && this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    // Generic request handler
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, options);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(userData),
        });
    }

    async login(credentials) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(credentials),
        });

        if (data.success && data.data.token) {
            this.setToken(data.data.token);
        }

        return data;
    }

    async getMe() {
        return this.request('/auth/me', {
            method: 'GET',
            headers: this.getHeaders(true),
        });
    }

    // Project endpoints
    async getProjects() {
        return this.request('/projects', {
            method: 'GET',
            headers: this.getHeaders(),
        });
    }

    async getProject(id) {
        return this.request(`/projects/${id}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });
    }

    async createProject(formData) {
        // For FormData, don't set Content-Type header (browser will set it with boundary)
        const headers = {};
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: headers,
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create project');
        }

        return data;
    }

    async updateProject(id, formData) {
        const headers = {};
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${API_URL}/projects/${id}`, {
            method: 'PUT',
            headers: headers,
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to update project');
        }

        return data;
    }

    async deleteProject(id) {
        return this.request(`/projects/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(true),
        });
    }

    // CV endpoints
    async getCV() {
        return this.request('/cv', {
            method: 'GET',
            headers: this.getHeaders(),
        });
    }

    async updateCV(cvData, profileImageFile = null) {
        // If there's a profile image file, use FormData
        if (profileImageFile) {
            const formData = new FormData();
            formData.append('cvData', JSON.stringify(cvData));
            formData.append('profileImage', profileImageFile);

            const headers = {};
            if (this.token) {
                headers['Authorization'] = `Bearer ${this.token}`;
            }

            const response = await fetch(`${API_URL}/cv`, {
                method: 'PUT',
                headers: headers,
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update CV');
            }

            return data;
        } else {
            // No file, use JSON as before
            return this.request('/cv', {
                method: 'PUT',
                headers: this.getHeaders(true),
                body: JSON.stringify(cvData),
            });
        }
    }
}

// Export API client instance
const api = new APIClient();
