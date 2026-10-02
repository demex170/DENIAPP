import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register' | 'forgot';
  openAuthModal: (tab?: 'login' | 'register' | 'forgot') => void;
  closeAuthModal: () => void;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string; phone: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'forgot'>('login');

  const refreshUser = async () => {
    try {
      const currentUser = await api.getMe();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const openAuthModal = (tab: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (data: { email: string; password: string }) => {
    const res = await api.login(data);
    setUser(res.user);
    closeAuthModal();
  };

  const register = async (data: { email: string; password: string; firstName: string; lastName: string; phone: string }) => {
    const res = await api.register(data);
    setUser(res.user);
    closeAuthModal();
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    const res = await api.updateProfile(data);
    setUser(prev => prev ? { ...prev, ...res.user } : res.user);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
