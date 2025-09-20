import React from 'react';
import Head from 'next/head';
import { Navigation, Footer } from './index';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'School Management System',
  description = 'School Management System'
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <div className="d-flex flex-column min-vh-100">
        <Navigation />
        <main className="flex-grow-1">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;