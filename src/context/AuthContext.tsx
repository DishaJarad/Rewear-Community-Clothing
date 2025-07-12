import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { useApp } from './AppContext';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const appContext = useApp();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('rewear_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, userType: 'user' | 'admin'): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Admin authentication check
    if (userType === 'admin') {
      if (email !== 'admin@gmail.com' || password !== 'admin') {
        setIsLoading(false);
        return false;
      }
      
      const adminUser: User = {
        id: 'admin-1',
        email: 'admin@gmail.com',
        firstName: 'Admin',
        lastName: 'User',
        profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
        points: 0,
        isAdmin: true,
        createdAt: new Date().toISOString(),
        status: 'active',
      };
      
      setUser(adminUser);
      localStorage.setItem('rewear_user', JSON.stringify(adminUser));
      setIsLoading(false);
      return true;
    }
    
    // User authentication - check for existing users
    let mockUser: User;
    
    if (email === 'priti.sharma@gmail.com' && password === '12345') {
      mockUser = {
        id: '2',
        email: 'priti.sharma@gmail.com',
        firstName: 'Priti',
        lastName: 'Sharma',
        profileImage: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
        points: 200,
        isAdmin: false,
        createdAt: '2024-01-15T10:30:00Z',
        status: 'active',
      };
    } else if (email === 'bhakti.jadhav@gmail.com' && password === '12345') {
      mockUser = {
        id: '4',
        email: 'bhakti.jadhav@gmail.com',
        firstName: 'Bhakti',
        lastName: 'Jadhav',
        profileImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
        points: 95,
        isAdmin: false,
        createdAt: '2024-01-13T09:15:00Z',
        status: 'active',
      };
    } else {
      // Default new user
      mockUser = {
        id: Date.now().toString(),
        email,
        firstName: 'John',
        lastName: 'Doe',
        profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
        points: 150,
        isAdmin: false,
        createdAt: new Date().toISOString(),
        status: 'active',
      };
    }
    
    // Add user to app context if it exists
    if (appContext) {
      appContext.addUser(mockUser);
    }
    
    setUser(mockUser);
    localStorage.setItem('rewear_user', JSON.stringify(mockUser));
    setIsLoading(false);
    return true;
  };

  const register = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      firstName,
      lastName,
      points: 50, // Welcome bonus
      isAdmin: false,
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    
    setUser(mockUser);
    localStorage.setItem('rewear_user', JSON.stringify(mockUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rewear_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};