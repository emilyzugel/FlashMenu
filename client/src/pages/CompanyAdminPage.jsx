import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import Loading from '../components/Loading';

const CompanyAdminPage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showLogoForm, setShowLogoForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  console.log('🔍 CompanyAdminPage - companyId:', companyId);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    available: true
  });

  const [logoData, setLogoData] = useState({
    logo: ''
  });

  useEffect(() => {
    console.log('🔄 useEffect executando');
    loadCompanyData();
  }, [companyId]);

  const loadCompanyData = async () => {
    try {
      console.log('🚀 Iniciando loadCompanyData');
      setLoading(true);

      console.log('📞 Chamando getCompanyBySlug com:', companyId);
      const companyData = await apiService.getCompanyBySlug(companyId);
      console.log('✅ Company data recebida:', companyData);

      // Os produtos já vêm dentro da company
      if (companyData.products) {
        console.log('📦 Produtos encontrados:', companyData.products);
        setProducts(companyData.products);
      } else {
        console.log('⚠️ Nenhum produto encontrado na company');
        setProducts([]);
      }

      setCompany(companyData);
      setLogoData({ logo: companyData.logo || '' });
      console.log('🎉 Dados carregados com sucesso');

    } catch (error) {
      console.error('❌ Erro COMPLETO ao carregar dados:', error);
      console.error('❌ Mensagem do erro:', error.message);
      alert('Erro ao carregar dados: ' + error.message);
      navigate('/');
    } finally {
      setLoading(false);
      console.log('🏁 Loading finalizado');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogoInputChange = (e) => {
    const { name, value } = e.target;
    setLogoData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('📁 File selected:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Validação básica
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida (JPEG, PNG, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Imagem muito grande. Máximo 5MB');
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('image', file);

      console.log('📤 Iniciando upload...');
      const imageUrl = await apiService.uploadImage(formData);
      console.log('✅ Upload successful:', imageUrl);

      setFormData(prev => ({ ...prev, image: imageUrl }));

    } catch (error) {
      console.error('❌ Upload error:', error);
      alert('Erro ao fazer upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('📁 Logo file selected:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida para a logo');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Imagem muito grande. Máximo 5MB');
      return;
    }

    try {
      setUploadingLogo(true);

      const formData = new FormData();
      formData.append('image', file);

      console.log('📤 Iniciando upload da logo...');
      const imageUrl = await apiService.uploadImage(formData);
      console.log('✅ Logo upload successful:', imageUrl);

      setLogoData(prev => ({ ...prev, logo: imageUrl }));

    } catch (error) {
      console.error('❌ Logo upload error:', error);
      alert('Erro ao fazer upload da logo: ' + error.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleLogoSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.updateCompanyLogo(companyId, logoData.logo);
      await loadCompanyData(); // Recarrega os dados para atualizar a logo
      setShowLogoForm(false);
      alert('✅ Logo atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar logo:', error);
      alert('Erro ao atualizar logo: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await apiService.updateProduct(companyId, editingProduct._id, formData);
      } else {
        await apiService.createProduct(companyId, formData);
      }

      resetForm();
      await loadCompanyData();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      available: true
    });
    setEditingProduct(null);
    setShowProductForm(false);
    setUploading(false);
  };

  const resetLogoForm = () => {
    setLogoData({ logo: company?.logo || '' });
    setShowLogoForm(false);
    setUploadingLogo(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      available: product.available
    });
    setShowProductForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await apiService.deleteProduct(companyId, productId);
        await loadCompanyData();
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('Erro ao excluir produto: ' + error.message);
      }
    }
  };

  const toggleAvailability = async (productId, currentStatus) => {
    try {
      await apiService.updateProduct(companyId, productId, { available: !currentStatus });
      await loadCompanyData();
    } catch (error) {
      console.error('Erro ao alterar disponibilidade:', error);
      alert('Erro ao alterar disponibilidade: ' + error.message);
    }
  };

  // Função para lidar com imagens quebradas
  const handleImageError = (e) => {
    console.log('🖼️ Image failed to load, using placeholder');
    e.target.src = '/vite.svg';
    e.target.style.opacity = '0.7';
  };

  if (loading) {
    console.log('🔄 Renderizando Loading component');
    return <Loading />;
  }

  if (!company) {
    console.log('❌ Renderizando Empresa não encontrada');
    return (
      <div className="error-page">
        <h1>Empresa não encontrada</h1>
        <p>A empresa "{companyId}" não foi encontrada.</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Voltar para Home
        </button>
      </div>
    );
  }

  console.log('🎨 Renderizando página normal');

  return (
    <div className="company-admin-page">
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <div className="company-info">
            <div className="company-logo-section">
              <img
                src={company.logo || '/vite.svg'}
                alt={`Logo ${company.name}`}
                className="company-logo"
                onError={handleImageError}
              />
              <div>
                <h1>{company.name} - Painel Administrativo</h1>
                <p>Gerencie seus produtos e configurações</p>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button
              className="btn-secondary"
              onClick={() => setShowLogoForm(true)}
            >
              🖼️ Alterar Logo
            </button>
            <button
              className="btn-primary"
              onClick={() => setShowProductForm(true)}
            >
              + Novo Produto
            </button>
          </div>
        </div>
      </header>

      <div className="admin-container">
        {/* Modal para alterar logo */}
        {showLogoForm && (
          <div className="product-form-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Alterar Logo da Empresa</h2>
                <button className="close-btn" onClick={resetLogoForm}>×</button>
              </div>

              <form onSubmit={handleLogoSubmit} className="product-form">
                <div className="form-group">
                  <label>Logo da Empresa</label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo}
                    className="file-input"
                  />

                  {uploadingLogo && (
                    <div className="upload-loading">
                      <p>📤 Fazendo upload da logo...</p>
                    </div>
                  )}

                  {logoData.logo && (
                    <div className="image-preview">
                      <img
                        src={logoData.logo}
                        alt="Preview da logo"
                        className="preview-image"
                        onError={handleImageError}
                      />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => setLogoData(prev => ({ ...prev, logo: '' }))}
                      >
                        ✕ Remover logo
                      </button>
                    </div>
                  )}

                  <div style={{ marginTop: '1rem' }}>
                    <small>Ou cole uma URL da logo:</small>
                    <input
                      type="url"
                      name="logo"
                      value={logoData.logo}
                      onChange={handleLogoInputChange}
                      placeholder="https://exemplo.com/logo.jpg"
                      style={{ marginTop: '0.5rem' }}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={resetLogoForm}>
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={uploadingLogo || !logoData.logo}
                  >
                    {uploadingLogo ? 'Enviando...' : 'Atualizar Logo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Formulário de Produto (existente) */}
        {showProductForm && (
          <div className="product-form-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
                <button className="close-btn" onClick={resetForm}>×</button>
              </div>

              <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                  <label>Nome do Produto *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Descrição</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Preço *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Categoria</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Imagem do Produto</label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="file-input"
                  />

                  {uploading && (
                    <div className="upload-loading">
                      <p>📤 Fazendo upload da imagem...</p>
                    </div>
                  )}

                  {formData.image && (
                    <div className="image-preview">
                      <img
                        src={formData.image}
                        alt="Preview do produto"
                        className="preview-image"
                        onError={handleImageError}
                      />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      >
                        ✕ Remover imagem
                      </button>
                    </div>
                  )}

                  <div style={{ marginTop: '1rem' }}>
                    <small>Ou cole uma URL da imagem:</small>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="https://exemplo.com/imagem.jpg"
                      style={{ marginTop: '0.5rem' }}
                    />
                  </div>
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="available"
                      checked={formData.available}
                      onChange={handleInputChange}
                    />
                    Produto disponível
                  </label>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={resetForm}>
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={uploading}
                  >
                    {uploading ? 'Enviando...' : (editingProduct ? 'Atualizar' : 'Criar')} Produto
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de Produtos (existente) */}
        <div className="products-section">
          <h2>Produtos ({products.length})</h2>

          {products.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum produto cadastrado</p>
              <button
                className="btn-primary"
                onClick={() => setShowProductForm(true)}
              >
                Criar Primeiro Produto
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <div key={product._id} className={`product-card ${!product.available ? 'unavailable' : ''}`}>
                  <div className="product-image">
                    <img
                      src={product.image || '/vite.svg'}
                      alt={product.name}
                      onError={handleImageError}
                    />
                    {!product.available && (
                      <div className="unavailable-overlay">Indisponível</div>
                    )}
                  </div>

                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-meta">
                      <span className="product-price">R$ {parseFloat(product.price).toFixed(2)}</span>
                      {product.category && (
                        <span className="product-category">{product.category}</span>
                      )}
                    </div>
                  </div>

                  <div className="product-actions">
                    <button
                      className={`availability-btn ${product.available ? 'available' : 'unavailable'}`}
                      onClick={() => toggleAvailability(product._id, product.available)}
                    >
                      {product.available ? 'Disponível' : 'Indisponível'}
                    </button>

                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(product)}
                      >
                        Editar
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(product._id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyAdminPage;
