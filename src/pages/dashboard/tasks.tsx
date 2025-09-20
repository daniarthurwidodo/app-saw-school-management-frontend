import React from 'react';
import Sidebar from '../../components/Sidebar';

const Tasks = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '20px', backgroundColor: '#f5f5f5' }}>
        <h1>Task Management</h1>
        <p>Manage tasks here.</p>
      </main>
    </div>
  );
};

export default Tasks;