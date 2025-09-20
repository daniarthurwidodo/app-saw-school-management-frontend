import React from 'react';
import Sidebar from '../../components/Sidebar';

const Users = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '20px', backgroundColor: '#f5f5f5' }}>
        <h1>Users Management</h1>
        <p>Manage users here.</p>
      </main>
    </div>
  );
};

export default Users;