import React, { createContext, useState, useContext } from 'react';
import { supabase } from '../lib/supabase';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

type AuthContextType = {
  currentUser: UserProfile | null;
  login: (email: string, phone: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const login = async (email: string, phone: string, password: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, phone')
      .eq('email', email)
      .eq('phone', phone)
      .eq('password', password);

    if (error) return false;
    if (!data || data.length === 0) return false;

    setCurrentUser(data[0]);
    return true;
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email);

    if (existing && existing.length > 0) return false;

    const { error } = await supabase
      .from('profiles')
      .insert({ name, email, phone, password });

    return !error;
  };

  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
