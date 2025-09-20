import React from 'react';
import Sidebar from '../../components/Sidebar';

const Settings = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '20px', backgroundColor: '#f5f5f5' }}>
        <h1>Settings</h1>
        <p>Configure application settings here.</p>
      </main>
    </div>
  );
};

export default Settings;