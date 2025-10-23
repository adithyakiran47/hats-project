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
      <div className="container mt-4">
        <h1 className="mb-4">HATS Frontend</h1>
        <div className="row">
          <div className="col-md-6">
            <Register />
            <Login />
          </div>
          <div className="col-md-6">
            <ApplicationCreate onAppCreated={triggerRefresh} />
          </div>
        </div>
        <hr />
        <ApplicationList key={refresh} />
      </div>
    </AuthProvider>
  );
}

export default App;
