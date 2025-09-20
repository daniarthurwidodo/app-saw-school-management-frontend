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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About School Management System</h1>
          <p className="text-lg text-muted-foreground mb-6">
            This is a comprehensive school management system designed to help educational institutions manage their operations efficiently.
          </p>
          <Link href="/">
            <Button variant="default">Back to Home</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}