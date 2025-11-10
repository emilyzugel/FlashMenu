import React from 'react';
import { useCart } from '../context/CartContext';

const Header = ({ company, onOpenCart }) => {
  const { getTotalItems } = useCart();

  return (
    <header className="company-hero">
      <div className="container">
        <div className="company-profile">
          <div className="company-avatar">
            <img src={company.logo} alt={company.name} />
          </div>
          <div className="company-details">
            <h1>{company.name}</h1>
            <p className="company-description">{company.description}</p>
            <div className="company-meta">
              <span className="category-badge">{company.category}</span>
              <span className="rating">⭐ 4.8</span>
            </div>
          </div>
          <div className="company-actions">
            <button className="whatsapp-btn-large" onClick={onOpenCart}>
              <span className="cart-icon">🛒</span>
              Carrinho ({getTotalItems()})
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
