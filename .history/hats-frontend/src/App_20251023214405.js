import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Register from './components/Register';
import Login from './components/Login';
import ApplicationCreate from './components/ApplicationCreate';
import ApplicationList from './components/ApplicationList';

function App() {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => setRefresh(r => !r);

  return (
    <AuthProvider>
      <div>
        <h1>HATS Frontend</h1>
        <Register />
        <Login />
        <ApplicationCreate onAppCreated={triggerRefresh} />
        <ApplicationList key={refresh} />
      </div>
    </AuthProvider>
  );
}

export default App;
