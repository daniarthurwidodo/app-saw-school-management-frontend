import React from 'react';
import Sidebar from '../../components/Sidebar';

const Documents = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '20px', backgroundColor: '#f5f5f5' }}>
        <h1>Documents Management</h1>
        <p>Manage documents here.</p>
      </main>
    </div>
  );
};

export default Documents;