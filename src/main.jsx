import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux';
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { NotificationProvider } from './context/NotificationContext';
import { LoaderProvider } from './context/LoaderContext';

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <LoaderProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </LoaderProvider>
    </PersistGate>
  </Provider>
</React.StrictMode>
)