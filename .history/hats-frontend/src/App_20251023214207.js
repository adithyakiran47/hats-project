import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Register from './components/Register';
import Login from './components/Login';
import ApplicationList from './components/ApplicationList';

function App() {
  return (
    <AuthProvider>
      <div>
        <h1>HATS Frontend</h1>
        <Register />
        <Login />
        <ApplicationList />
      </div>
    </AuthProvider>
  );
}

export default App;
