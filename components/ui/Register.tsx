import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from './Button';
import { Input } from './input';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { useAuth } from '../auth';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simple validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    try {
      // In a real application, you would call a registration API here
      // For this demo, we'll simulate registration and then log the user in
      setTimeout(() => {
        // Simulate successful registration
        setSuccess(true);
        setIsLoading(false);
        
        // Automatically log in the user after registration
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      }, 1000);
    } catch (err) {
      setError('An error occurred during registration');
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="text-center pt-6">
          <CardTitle className="mb-2">Registration Successful!</CardTitle>
          <p className="text-muted-foreground">You will be redirected to the dashboard shortly...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Register</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium leading-none">First Name</label>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium leading-none">Last Name</label>
              <Input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john.doe@example.com"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium leading-none">Password</label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">Confirm Password</label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>
          <Button
            type="submit"
            variant="default"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-primary hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Register;