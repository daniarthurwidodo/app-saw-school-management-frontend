import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useDebug } from '../../components/debug';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setDebugInfo } = useDebug();

  // Check if user is already logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      setDebugInfo('auth', { 
        status: 'authenticated', 
        token: token.substring(0, 10) + '...',
        timestamp: new Date().toISOString()
      });
    } else {
      setDebugInfo('auth', { 
        status: 'not_authenticated', 
        timestamp: new Date().toISOString()
      });
    }
    setIsLoading(false);
  }, [setDebugInfo]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Use MirageJS API in development, mock in production
    if (process.env.NODE_ENV === 'development') {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          localStorage.setItem('authToken', data.token);
          setIsAuthenticated(true);
          setDebugInfo('auth_login_success', { 
            email, 
            user: data.user,
            timestamp: new Date().toISOString()
          });
          return true;
        } else {
          setDebugInfo('auth_login_failed', { 
            email, 
            reason: data.error,
            timestamp: new Date().toISOString()
          });
          return false;
        }
      } catch (error) {
        console.error('Login error:', error);
        setDebugInfo('auth_login_error', { 
          email, 
          error: error.message,
          timestamp: new Date().toISOString()
        });
        return false;
      }
    } else {
      // Simple validation for demo purposes
      setDebugInfo('auth_login_attempt', { 
        email, 
        timestamp: new Date().toISOString()
      });
      
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simple validation for demo purposes
          if (email && password) {
            localStorage.setItem('authToken', 'demo-token');
            setIsAuthenticated(true);
            setDebugInfo('auth_login_success', { 
              email, 
              timestamp: new Date().toISOString()
            });
            resolve(true);
          } else {
            setDebugInfo('auth_login_failed', { 
              email, 
              reason: 'Invalid credentials',
              timestamp: new Date().toISOString()
            });
            resolve(false);
          }
        }, 1000);
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setDebugInfo('auth_logout', { 
      timestamp: new Date().toISOString()
    });
    
    // Use MirageJS API in development
    if (process.env.NODE_ENV === 'development') {
      fetch('/api/auth/logout', {
        method: 'POST',
      }).catch(console.error);
    }
    
    // Redirect to login page
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};