import React from 'react';
import Link from 'next/link';
import { Button } from '../components/ui';
import { Layout } from '../components/layout';

export default function About() {
  return (
    <Layout 
      title="About - School Management System" 
      description="About School Management System"
    >
      <div className="container mt-5">
        <div className="row">
          <div className="col-12">
            <h1>About School Management System</h1>
            <p className="lead">
              This is a comprehensive school management system designed to help educational institutions manage their operations efficiently.
            </p>
            <Link href="/">
              <Button variant="primary">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}