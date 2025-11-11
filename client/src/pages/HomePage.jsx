import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';
import Loading from '../components/Loading';
import images from '../assets/assets.js';

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
      {/* NAVBAR */}
      <header className="navbar">
        <div className="container content">
          <div className="logo-section">
            <img src={images.text_logo} className="logo" />
          </div>
          <nav>
            <ul className='links'>
              <li className='link'>Painel</li>
              <li className='link'>Sobre nós</li>
              <li className='link'>Fale conosco</li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className='container'>
          <div className='content'>
            <img
              src={images.hero_title}
              className='title floating'
              alt="Seu negócio mais fácil!"
            />
            <img
              src={images.hero_mockup}
              className='mockup floating'
              alt="cellphone mockup"
            />
          </div>
          <button className='btn'>Seja um parceiro</button>
        </div>
      </section >

      {/* Lista de Empresas - AGORA COM DADOS REAIS DO BACKEND */}
      < section className="companies-section" >
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
      </section >

      {/* Seção "É intuitivo e fácil pedir!" */}
      < section className="features-section" >
        <div className="container">
          <div className="section-header">
            <h2>É intuitivo e fácil pedir!</h2>
            <p>Conectamos você à seus clientes de forma simples e amigável.</p>
          </div>

          <div className="features-content">
            <div className="features-cards">
              {/* Card 1 - Ativo por padrão */}
              <div className="feature-card active">
                <h3>Agilize seu Atendimento</h3>
                <p>O cliente chama no WhatsApp ou nas Redes Sociais e recebe o link com seu belo cardápio.</p>
                <div className="feature-divider"></div>
                <h4>Sem baixar aplicativos e sem cadastros</h4>
                <p>O cliente pode fazer seu pedido utilizando qualquer dispositivo que esteja conectado à Internet.</p>
              </div>

              {/* Card 2 */}
              <div className="feature-card">
                <h3>Valoriza seu Tempo</h3>
                <p>O pedido é enviado via WhatsApp, permitindo manter um relacionamento em tempo real com seu cliente.</p>
                <div className="feature-divider"></div>
                <h4>Plenamente Integrado</h4>
                <p>Os pedidos podem ser impressos via aplicativo Android, pelo WhatsApp Web ou através do nosso sistema web.</p>
              </div>
            </div>

            <div className="features-visual">
              <img
                src={images.feature1}
                alt="Agilize seu Atendimento"
                className="feature-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      < footer className="footer">
        <div className="container content">
          <div className="brand">
            <img src={images.text_logo} className='logo' />
            <p>Revolucionando a forma de fazer pedidos</p>
          </div>
          <div className="links">
            <a href="#">Sobre nós</a>
            <a href="#">Fale conosco</a>
            <a href="#">Seja um parceiro</a>
          </div>
        </div>
      </footer>
    </div >
  );
};

export default HomePage;
