import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';
import Loading from '../components/Loading';

const HomePage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setLoading(true);
        const companiesData = await apiService.getCompanies();
        setCompanies(companiesData);
      } catch (err) {
        setError('Erro ao carregar estabelecimentos');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="error-page">
        <h1>Erro ao carregar</h1>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="back-home">
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="logo">FlashMenu</h1>
            <p className="tagline">Cardápios digitais inteligentes</p>
          </div>
          <div className="header-actions">
            <button className="partner-btn">Seja um parceiro</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2>Peça direto pelo WhatsApp</h2>
          <p>Escolha um estabelecimento e faça seu pedido em poucos cliques</p>
          <div className="hero-features">
            <div className="feature">
              <span>🚀</span>
              <p>Rápido</p>
            </div>
            <div className="feature">
              <span>💬</span>
              <p>Via WhatsApp</p>
            </div>
            <div className="feature">
              <span>📱</span>
              <p>Simples</p>
            </div>
          </div>
        </div>
      </section>

      {/* Lista de Empresas - AGORA COM DADOS REAIS DO BACKEND */}
      <section className="companies-section">
        <h3>Estabelecimentos Parceiros</h3>
        <div className="companies-grid">
          {companies.map(company => (
            <Link key={company._id} to={`/${company.slug}`} className="company-card">
              <div className="company-image">
                <img src={company.logo || '/default-logo.jpg'} alt={company.name} />
              </div>
              <div className="company-info">
                <h4>{company.name}</h4>
                <p>{company.description}</p>
                <span className="company-category">{company.category}</span>
              </div>
              <div className="card-arrow">→</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>FlashMenu</h3>
            <p>Revolucionando a forma de fazer pedidos</p>
          </div>
          <div className="footer-links">
            <a href="#">Sobre</a>
            <a href="#">Contato</a>
            <a href="#">Seja um parceiro</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
