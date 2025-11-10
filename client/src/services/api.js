const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Nossa API retorna { success, data, message }
      if (!data.success) {
        throw new Error(data.message || 'Erro na API');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(error.message || 'Erro na conexão com o servidor');
    }
  }

  // Companies
  async getCompanies() {
    const response = await this.request('/companies');
    return response.data; // ← Retorna o array de empresas
  }

  async getCompanyBySlug(slug) {
    const response = await this.request(`/companies/${slug}`);
    return response.data; // ← Retorna UM objeto empresa
  }
}

export default new ApiService();
