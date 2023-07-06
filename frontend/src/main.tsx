import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import './index.css';

import App from './App';
import { store, persistor } from './state/Store';
import { PersistGate } from 'redux-persist/integration/react';

ReactDOM.createRoot( document.getElementById( 'root' ) as HTMLElement ).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
