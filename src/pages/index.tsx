import React from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';

const Home = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/dashboard');
  };

  return (
    <div>
      <Header />
      <main style={{ textAlign: 'center', padding: '20px' }}>
        <h2>Welcome to My Next.js App</h2>
        <p>This is a default Next.js application with TanStack Table and Query.</p>
        <button 
          onClick={handleLogin}
          style={{ 
            padding: '10px 20px', 
            fontSize: '16px',
            marginTop: '20px'
          }}
        >
          Go to Dashboard
        </button>
      </main>
    </div>
  );
};

export default Home;