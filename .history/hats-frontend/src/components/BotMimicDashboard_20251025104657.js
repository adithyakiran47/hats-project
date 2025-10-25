import React, { useState } from 'react';
import api from '../api/api';

export default function BotMimicDashboard() {
  const [result, setResult] = useState('');

  const testAutomation = async () => {
    console.log('Button clicked!');
    setResult('Testing...');
    
    try {
      const res = await api.post('/automation/run');
      console.log('Success:', res.data);
      setResult(JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.error('Error:', err);
      setResult('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="container my-4">
      <h2>Bot Mimic Dashboard - Test Version</h2>
      <button className="btn btn-primary btn-lg" onClick={testAutomation}>
        Test Automation
      </button>
      {result && (
        <pre className="mt-3 p-3 bg-light border">
          {result}
        </pre>
      )}
    </div>
  );
}
