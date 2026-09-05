import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { StudioProvider } from './context/StudioContext';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <StudioProvider>
        <App />
      </StudioProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
