'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  creditsRemaining: number;
  creditsLimit: number;
  subscriptionPlan: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  loginCustomer: (email: string, password?: string) => Promise<User>;
  loginAdmin: (email: string, password?: string, adminKey?: string) => Promise<User>;
  registerCustomer: (name: string, email: string, password?: string) => Promise<User>;
  registerAdmin: (name: string, email: string, password?: string, adminKey?: string) => Promise<User>;
  login: (role: UserRole, email: string, name?: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  upgradePlan: (planName: string, creditsLimit: number) => void;
  deductCredit: () => boolean;
}

const DEFAULT_ADMIN: User = {
  id: 'usr_admin_01',
  name: 'System Admin',
  email: 'admin@auraspace.ai',
  role: 'admin',
  createdAt: '2026-01-01',
  creditsRemaining: 9999,
  creditsLimit: 9999,
  subscriptionPlan: 'Enterprise Admin',
};

const DEFAULT_CUSTOMER: User = {
  id: 'usr_cust_01',
  name: 'Alex Johnson',
  email: 'customer@auraspace.ai',
  role: 'customer',
  createdAt: '2026-02-15',
  creditsRemaining: 3,
  creditsLimit: 3,
  subscriptionPlan: 'Free Trial',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'auraspace_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(DEFAULT_CUSTOMER);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CUSTOMER));
      }
    } catch (e) {
      console.error('Failed to restore auth session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUserSession = (newUser: User) => {
    setUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } catch (e) {
      console.error('Failed to save auth session:', e);
    }
  };

  const loginCustomer = async (email: string, password?: string): Promise<User> => {
    const res = await fetch('/api/auth/customer/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Customer login failed');
    }

    const customerUser: User = {
      ...data.user,
      creditsRemaining: 3,
      creditsLimit: 3,
      subscriptionPlan: 'Free Trial',
    };

    saveUserSession(customerUser);
    return customerUser;
  };

  const loginAdmin = async (email: string, password?: string, adminKey?: string): Promise<User> => {
    const res = await fetch('/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, adminKey }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Admin login failed');
    }

    const adminUser: User = {
      ...data.user,
      creditsRemaining: 9999,
      creditsLimit: 9999,
      subscriptionPlan: 'Enterprise Admin',
    };

    saveUserSession(adminUser);
    return adminUser;
  };

  const registerCustomer = async (name: string, email: string, password?: string): Promise<User> => {
    const res = await fetch('/api/auth/customer/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Customer registration failed');
    }

    const customerUser: User = {
      ...data.user,
      creditsRemaining: 3,
      creditsLimit: 3,
      subscriptionPlan: 'Free Trial',
    };

    saveUserSession(customerUser);
    return customerUser;
  };

  const registerAdmin = async (name: string, email: string, password?: string, adminKey?: string): Promise<User> => {
    const res = await fetch('/api/auth/admin/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, adminKey }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Admin registration failed');
    }

    const adminUser: User = {
      ...data.user,
      creditsRemaining: 9999,
      creditsLimit: 9999,
      subscriptionPlan: 'Enterprise Admin',
    };

    saveUserSession(adminUser);
    return adminUser;
  };

  const login = (role: UserRole, email: string, name?: string) => {
    const newUser: User = {
      id: role === 'admin' ? 'usr_admin_' + Date.now() : 'usr_cust_' + Date.now(),
      name: name || (role === 'admin' ? 'Admin User' : email.split('@')[0] || 'Customer User'),
      email: email,
      role: role,
      createdAt: new Date().toISOString().split('T')[0],
      creditsRemaining: role === 'admin' ? 9999 : 3,
      creditsLimit: role === 'admin' ? 9999 : 3,
      subscriptionPlan: role === 'admin' ? 'Enterprise Admin' : 'Free Trial',
    };
    saveUserSession(newUser);
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear auth session:', e);
    }
  };

  const switchRole = (role: UserRole) => {
    if (role === 'admin') {
      saveUserSession(DEFAULT_ADMIN);
    } else {
      saveUserSession(DEFAULT_CUSTOMER);
    }
  };

  const upgradePlan = (planName: string, creditsLimit: number) => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      subscriptionPlan: planName,
      creditsLimit: creditsLimit,
      creditsRemaining: creditsLimit, // Refreshes credits on upgrade
    };
    saveUserSession(updatedUser);
  };

  const deductCredit = (): boolean => {
    if (!user) return false;
    if (user.creditsRemaining <= 0) return false;

    const updatedUser: User = {
      ...user,
      creditsRemaining: user.creditsRemaining - 1,
    };
    saveUserSession(updatedUser);
    return true;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer',
    loginCustomer,
    loginAdmin,
    registerCustomer,
    registerAdmin,
    login,
    logout,
    switchRole,
    upgradePlan,
    deductCredit,
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950"></div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
