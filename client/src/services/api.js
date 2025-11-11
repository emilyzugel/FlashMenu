// ✅ CORRIGIDO: Usa caminho relativo para o proxy do Vite
const API_BASE_URL = '/api';

class ApiService {
  // No ApiService, adicione:
  async updateCompanyLogo(slug, logoUrl) {
    const response = await this.request(`/companies/${slug}/logo`, {
      method: 'PUT',
      body: JSON.stringify({ logo: logoUrl })
    });
    return response.data;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    console.log('🔄 Fazendo requisição para:', url);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      console.log('📡 Resposta status:', response.status, 'para', url);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Se não conseguir parsear JSON, usa status
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Erro na API');
      }

      return data;
    } catch (error) {
      console.error('❌ API Error para', url, ':', error);
      throw new Error(error.message || 'Erro na conexão com o servidor');
    }
  }

  // Companies
  async getCompanies() {
    const response = await this.request('/companies');
    return response.data;
  }

  async getCompanyBySlug(slug) {
    const response = await this.request(`/companies/${slug}`);
    return response.data;
  }

  // Produtos
  async getCompanyProducts(slug) {
    const company = await this.getCompanyBySlug(slug);
    return company.products || [];
  }

  async createProduct(slug, productData) {
    const response = await this.request(`/companies/${slug}/products`, {
      method: 'POST',
      body: JSON.stringify(productData)
    });
    return response.data;
  }

  async updateProduct(companySlug, productId, productData) {
    const response = await this.request(`/companies/${companySlug}/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
    return response.data;
  }

  async deleteProduct(companySlug, productId) {
    const response = await this.request(`/companies/${companySlug}/products/${productId}`, {
      method: 'DELETE'
    });
    return response.data;
  }

  // Upload de imagem - CORRIGIDO para usar proxy
  async uploadImage(formData) {
    const url = `${API_BASE_URL}/upload`;
    console.log('📤 Fazendo upload para:', url);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      console.log('📡 Upload response status:', response.status);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) { }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Upload response data:', data);

      if (!data.success) {
        throw new Error(data.message || 'Erro no upload');
      }

      return data.imageUrl;
    } catch (error) {
      console.error('❌ Upload error:', error);
      throw new Error('Erro ao fazer upload: ' + error.message);
    }
  }
}

export default new ApiService();
