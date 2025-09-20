import React from 'react';
import Sidebar from '../../components/Sidebar';
import TanstackExample from '../../components/TanstackExample';

const Dashboard = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '20px',}}>
        <h1>Dashboard</h1>
        <p>Welcome to the dashboard page with sidebar!</p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px',
          marginTop: '20px'
        }}>
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '20px',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2>Statistics</h2>
            <p>Overview of key metrics</p>
          </div>
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '20px',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2>Recent Activity</h2>
            <p>Latest user actions</p>
          </div>
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '20px',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2>Tasks</h2>
            <p>Pending items</p>
          </div>
        </div>
        <div style={{ marginTop: '30px' }}>
          <h2>TanStack Table and Query Example</h2>
          <TanstackExample />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;