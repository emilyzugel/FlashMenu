import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

// Gerar ID único para cada item do carrinho
const generateCartItemId = (product, company) => {
  return `${company.slug}-${product._id}-${Date.now()}`;
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      // Verifica se já existe um item IDÊNTICO (mesmo produto, mesma empresa)
      const existingItemIndex = state.items.findIndex(
        item =>
          item.product._id === action.payload.product._id &&
          item.company.slug === action.payload.company.slug
      );

      if (existingItemIndex > -1) {
        // Se já existe, aumenta a quantidade
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity
        };

        return {
          ...state,
          items: updatedItems
        };
      } else {
        // Se é um item novo, adiciona com ID único
        const newItem = {
          ...action.payload,
          cartItemId: generateCartItemId(action.payload.product, action.payload.company)
        };

        return {
          ...state,
          items: [...state.items, newItem]
        };
      }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.cartItemId !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.cartItemId === action.payload.cartItemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'CLEAR_COMPANY_CART':
      return {
        ...state,
        items: state.items.filter(item => item.company.slug !== action.payload)
      };

    case 'SET_COMPANY':
      return {
        ...state,
        company: action.payload
      };

    default:
      return state;
  }
};

const initialState = {
  items: [],
  company: null
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (product, company, quantity = 1) => {
    // Se tentar adicionar item de empresa diferente, limpa o carrinho primeiro
    if (state.company && state.company.slug !== company.slug) {
      dispatch({ type: 'CLEAR_COMPANY_CART', payload: state.company.slug });
    }

    dispatch({
      type: 'ADD_ITEM',
      payload: { product, company, quantity }
    });

    // Se for a primeira vez adicionando um item, seta a empresa
    if (!state.company) {
      dispatch({ type: 'SET_COMPANY', payload: company });
    }
  };

  const removeFromCart = (cartItemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: cartItemId });
  };

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { cartItemId, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const clearCompanyCart = (companySlug) => {
    dispatch({ type: 'CLEAR_COMPANY_CART', payload: companySlug });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCompanyItems = (companySlug) => {
    return state.items.filter(item => item.company.slug === companySlug);
  };

  const value = {
    items: state.items,
    company: state.company,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearCompanyCart,
    getTotalItems,
    getTotalPrice,
    getCompanyItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
