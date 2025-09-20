import React from 'react';

const Header = () => {
  return (
    <header style={{ 
      textAlign: 'center', 
      padding: '20px', 
      backgroundColor: '#f5f5f5',
      marginBottom: '20px'
    }}>
      <h1>My Next.js App with TanStack</h1>
      <p>Using TanStack Table and TanStack Query</p>
    </header>
  );
};

export default Header;