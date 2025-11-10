import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, company }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, items } = useCart();

  // Verifica quantos deste produto já estão no carrinho
  const getCurrentCartQuantity = () => {
    const existingItem = items.find(
      item => item.product._id === product._id && item.company.slug === company.slug
    );
    return existingItem ? existingItem.quantity : 0;
  };

  const currentCartQuantity = getCurrentCartQuantity();

  const handleAddToCart = () => {
    addToCart(product, company, quantity);
    setQuantity(1); // Reseta a quantidade após adicionar
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, value));
  };

  return (
    <div className="product-card-modern">
      <div className="product-image">
        <img src={product.image || '/vite.svg'} alt={product.name} />
        <div className="product-overlay">
          <button className="quick-view-btn">👀</button>
        </div>
      </div>

      <div className="product-content">
        <div className="product-header">
          <h3>{product.name}</h3>
          <div className="product-price">R$ {product.price.toFixed(2)}</div>
        </div>

        <p className="product-description">{product.description}</p>

        <div className="product-category">
          <span>{product.category}</span>
        </div>

        {/* Indicador de quantos já estão no carrinho */}
        {currentCartQuantity > 0 && (
          <div className="cart-indicator">
            🛒 {currentCartQuantity} no carrinho
          </div>
        )}

        <div className="product-actions-modern">
          <div className="quantity-selector-product">
            <button
              className="quantity-btn-product minus"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              −
            </button>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="quantity-input-product"
            />

            <button
              className="quantity-btn-product plus"
              onClick={incrementQuantity}
            >
              +
            </button>
          </div>

          <button className="order-btn-modern" onClick={handleAddToCart}>
            <span>Adicionar ({quantity})</span>
          </button>
        </div>

        <div className="product-subtotal">
          Subtotal: R$ {(product.price * quantity).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
