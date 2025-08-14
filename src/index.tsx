import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store';
import ErrorBoundary from './components/common/ErrorBoundary';

console.log("🚀 1. Starting React application...");
console.log("🔧 2. Creating React root...");

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

console.log("🎯 3. Rendering App component...");

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();