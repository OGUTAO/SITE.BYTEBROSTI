const API_BASE_URL = 'http://localhost:8080/api';

async function apiRequest(endpoint, method = 'GET', data = null, needsAuth = false) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
    };

    if (needsAuth) {
        const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
        if (!token) {
            console.error('Token de autenticação não encontrado para requisição protegida:', endpoint);
            throw new Error('Não autenticado. Por favor, faça login.');
        }
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ erro: 'Erro desconhecido na resposta' }));
            throw new Error(errorData.erro || `Erro na API: ${response.status} ${response.statusText}`);
        }

        if (response.status === 204 || response.headers.get('Content-Length') === '0') {
            return {};
        }

        return await response.json();
    } catch (error) {
        console.error(`Erro na requisição ${method} ${endpoint}:`, error);
        throw error;
    }
}

export const authService = {
    registerUser: (userData) => apiRequest('/auth/registrar', 'POST', userData),
    loginUser: (credentials) => apiRequest('/auth/login', 'POST', credentials),
    registerFuncionario: (userData) => apiRequest('/auth/funcionarios/registrar', 'POST', userData),
    loginFuncionario: (credentials) => apiRequest('/auth/funcionarios/login', 'POST', credentials),
    loginAdmin: (credentials) => apiRequest('/api/admin/login', 'POST', credentials),
    getProfile: () => apiRequest('/perfil', 'GET', null, true),
    createAdmin: (adminData) => apiRequest('/admin/administradores', 'POST', adminData, true),
};

export const productService = {
    getProducts: () => apiRequest('/produtos'),
    getProductById: (id) => apiRequest(`/produtos/${id}`),
    createProduct: (productData) => apiRequest('/produtos', 'POST', productData, true),
    updateProduct: (id, productData) => apiRequest(`/produtos/${id}`, 'PUT', productData, true),
    deleteProduct: (id) => apiRequest(`/produtos/${id}`, 'DELETE', null, true),
    getOfferProducts: () => apiRequest('/produtos?ofertas=true'),
};

export const newsService = {
    getNews: () => apiRequest('/noticias'),
    getNewsById: (id) => apiRequest(`/noticias/${id}`),
    createNews: (newsData) => apiRequest('/noticias', 'POST', newsData, true),
    updateNews: (id, newsData) => apiRequest(`/noticias/${id}`, 'PUT', newsData, true),
    deleteNews: (id) => apiRequest(`/noticias/${id}`, 'DELETE', null, true),
};

export const serviceService = {
    getServices: () => apiRequest('/servicos'),
    getServiceById: (id) => apiRequest(`/servicos/${id}`),
    createService: (serviceData) => apiRequest('/servicos', 'POST', serviceData, true), 
    updateService: (id, serviceData) => apiRequest(`/servicos/${id}`, 'PUT', serviceData, true), 
    deleteService: (id) => apiRequest(`/servicos/${id}`, 'DELETE', null, true), 
    getOfferServices: () => apiRequest('/servicos?ofertas=true'),
};

export const supportService = {
    createMessage: (messageData) => apiRequest('/suporte', 'POST', messageData),
    getMessages: (status = '') => {
        let endpoint = '/suporte';
        if (status) {
            endpoint += `?status=${status}`;
        }
        return apiRequest(endpoint, 'GET', null, true); 
    },
    getMessageById: (id) => apiRequest(`/suporte/${id}`, 'GET', null, true),
    updateMessageStatus: (id, statusData) => apiRequest(`/suporte/${id}/status`, 'PUT', statusData, true), 
};

export const userService = {
    getFuncionarios: () => apiRequest('/admin/funcionarios', 'GET', null, true),
};

export const adminDashboardService = {
    getDashboardInfo: () => apiRequest('/admin/dashboard', 'GET', null, true),
};