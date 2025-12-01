// Authentication state management
const auth = {
    isAuthenticated: false,
    user: null,

    // Initialize auth state
    async init() {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await api.getMe();
                if (response.success) {
                    this.isAuthenticated = true;
                    this.user = response.data;
                    this.updateUI();
                }
            } catch (error) {
                console.error('Auth initialization failed:', error);
                this.logout();
            }
        }
    },

    // Login
    async login(email, password) {
        try {
            const response = await api.login({ email, password });

            if (response.success) {
                this.isAuthenticated = true;
                this.user = response.data;
                this.updateUI();
                showToast('Inicio de sesión exitoso', 'success');
                return true;
            }
        } catch (error) {
            showToast(error.message || 'Error al iniciar sesión', 'error');
            return false;
        }
    },

    // Logout
    logout() {
        this.isAuthenticated = false;
        this.user = null;
        api.clearToken();
        this.updateUI();
        showToast('Sesión cerrada', 'success');
        navigateTo('home');
    },

    // Update UI based on auth state
    updateUI() {
        const adminLink = document.getElementById('adminLink');

        if (this.isAuthenticated) {
            adminLink.textContent = 'Dashboard';
        } else {
            adminLink.textContent = 'Admin';
        }
    },

    // Check if user is authenticated
    requireAuth() {
        if (!this.isAuthenticated) {
            showToast('Debes iniciar sesión para acceder', 'warning');
            return false;
        }
        return true;
    }
};
