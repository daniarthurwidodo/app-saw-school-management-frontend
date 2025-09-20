import React from 'react';
import Head from 'next/head';
import { Login } from '../components/ui/Login';
import Link from 'next/link';

export default function Home() {
  const handleLoginSuccess = () => {
    // For now, just redirect to about page
    window.location.href = '/about';
  };

  return (
    <>
      <Head>
        <title>Login - School Management System</title>
        <meta name="description" content="Login to School Management System" />
      </Head>
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <Login onLoginSuccess={handleLoginSuccess} />
              <div className="text-center mt-3">
                <p>Don't have an account? <Link href="/register">Register here</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}