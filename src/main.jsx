import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

import { LanguageProvider } from './context/LanguageContext';
import { StoreSettingsProvider } from './context/StoreSettingsContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <StoreSettingsProvider>
          <CustomerAuthProvider>
            <ProductProvider>
              <CartProvider>
                <OrderProvider>
                  <App />
                </OrderProvider>
              </CartProvider>
            </ProductProvider>
          </CustomerAuthProvider>
        </StoreSettingsProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
