import React from 'react';
import Head from 'next/head';
import { Register } from '../components/ui/Register';

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>Register - School Management System</title>
        <meta name="description" content="Register for School Management System" />
      </Head>
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <Register />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}