import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Register from './components/Register';
import Login from './components/Login';

const App = () => {
  return (
    <AuthProvider>
      <div>
        <h1>HATS Frontend</h1>
        <Register />
        <Login />
      </div>
    </AuthProvider>
  );
};

export default App;
