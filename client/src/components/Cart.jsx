import React from 'react';
import { useCart } from '../context/CartContext';

const Cart = ({ isOpen, onClose }) => {
  const { items, company, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  const handleWhatsAppOrder = () => {
    if (!company || items.length === 0) return;

    let message = `*Pedido para ${company.name}*\n\n`;

    items.forEach((item, index) => {
      message += `*${index + 1}. ${item.product.name}*\n`;
      message += `   Quantidade: ${item.quantity}\n`;
      message += `   Valor unitário: R$ ${item.product.price.toFixed(2)}\n`;
      message += `   Subtotal: R$ ${(item.product.price * item.quantity).toFixed(2)}\n\n`;
    });

    message += `*TOTAL: R$ ${getTotalPrice().toFixed(2)}*\n\n`;
    message += `_Pedido gerado via FlashMenu_`;

    const whatsappUrl = `https://wa.me/55${company.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    clearCart();
    onClose();
  };

  const incrementItem = (cartItemId, currentQuantity) => {
    updateQuantity(cartItemId, currentQuantity + 1);
  };

  const decrementItem = (cartItemId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(cartItemId, currentQuantity - 1);
    }
  };

  const handleItemQuantityChange = (cartItemId, value) => {
    const quantity = parseInt(value) || 1;
    updateQuantity(cartItemId, Math.max(1, quantity));
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay">
      <div className="cart-modal">
        <div className="cart-header">
          <h3>Seu Carrinho - {company?.name}</h3>
          <button className="close-cart" onClick={onClose}>×</button>
        </div>

        <div className="cart-content">
          {items.length === 0 ? (
            <div className="empty-cart">
              <p>Seu carrinho está vazio</p>
              <span>Adicione itens para continuar</span>
              <button
                className="continue-shopping-btn empty"
                onClick={onClose}
              >
                ← Continuar Comprando
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.cartItemId} className="cart-item">
                    <div className="item-info">
                      <h4>{item.product.name}</h4>
                      <p className="item-description">{item.product.description}</p>
                      <p className="item-price">R$ {item.product.price.toFixed(2)} un.</p>
                    </div>

                    <div className="item-controls">
                      <div className="quantity-selector-cart">
                        <button
                          onClick={() => decrementItem(item.cartItemId, item.quantity)}
                          className="quantity-btn-cart minus"
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>

                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemQuantityChange(item.cartItemId, e.target.value)}
                          className="quantity-input-cart"
                        />

                        <button
                          onClick={() => incrementItem(item.cartItemId, item.quantity)}
                          className="quantity-btn-cart plus"
                        >
                          +
                        </button>
                      </div>

                      <div className="item-total-section">
                        <div className="item-total">
                          R$ {(item.product.price * item.quantity).toFixed(2)}
                        </div>

                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="remove-btn"
                          title="Remover item"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-summary">
                  <div className="cart-total">
                    <strong>Total: R$ {getTotalPrice().toFixed(2)}</strong>
                  </div>
                  <div className="total-items">
                    {items.reduce((sum, item) => sum + item.quantity, 0)} itens no total
                  </div>
                </div>

                <div className="cart-actions">
                  <button
                    onClick={onClose}
                    className="continue-shopping-btn"
                  >
                    ← Continuar Comprando
                  </button>

                  <button onClick={clearCart} className="clear-cart-btn">
                    🗑️ Limpar Carrinho
                  </button>

                  <button onClick={handleWhatsAppOrder} className="finish-order-btn">
                    💬 Finalizar Pedido
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
