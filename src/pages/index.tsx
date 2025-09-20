import React from 'react';
import Header from '../components/Header';
import TanstackExample from '../components/TanstackExample';

const Home = () => {
  return (
    <div>
      <Header />
      <main>
        <h2>Welcome to My Next.js App</h2>
        <p>This is a default Next.js application with TanStack Table and Query.</p>
        <TanstackExample />
      </main>
    </div>
  );
};

export default Home;