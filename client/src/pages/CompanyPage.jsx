import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../services/api';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import Loading from '../components/Loading';

const CompanyPage = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const loadCompany = async () => {
      try {
        setLoading(true);
        const companyData = await apiService.getCompanyBySlug(companyId);
        setCompany(companyData);
      } catch (err) {
        setError('Empresa não encontrada');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, [companyId]);

  if (loading) {
    return <Loading />;
  }

  if (error || !company) {
    return (
      <div className="error-page">
        <h1>Empresa não encontrada</h1>
        <p>{error || 'A empresa não está cadastrada em nosso sistema.'}</p>
        <Link to="/" className="back-home">Voltar para início</Link>
      </div>
    );
  }

  const categories = ['Todos', ...new Set(company.products.map(product => product.category))];
  const filteredProducts = selectedCategory === 'Todos'
    ? company.products
    : company.products.filter(product => product.category === selectedCategory);

  return (
    <div className="company-page">
      {/* Header com navegação */}
      <div className="company-header-nav">
        <div className="container">
          <Link to="/" className="back-button">
            ← Voltar para estabelecimentos
          </Link>
          <div className="header-brand">
            <span>FlashMenu</span>
          </div>
        </div>
      </div>

      <Header company={company} onOpenCart={() => setIsCartOpen(true)} />

      <div className="container">
        {/* Filtros modernos */}
        <div className="categories-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Info da empresa */}
        <div className="company-stats">
          <div className="stat">
            <span className="stat-number">{company.products.length}</span>
            <span className="stat-label">itens no cardápio</span>
          </div>
          <div className="stat">
            <span className="stat-number">🛵</span>
            <span className="stat-label">delivery</span>
          </div>
        </div>

        {/* Lista de produtos */}
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} company={company} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-products">
            <p>Nenhum produto encontrado nesta categoria.</p>
          </div>
        )}
      </div>

      {/* Carrinho */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default CompanyPage;
