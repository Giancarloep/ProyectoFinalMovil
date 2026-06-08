import React, { createContext, useState, useContext } from 'react';

type User = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

type AuthContextType = {
  currentUser: Omit<User, 'password'> | null;
  login: (email: string, phone: string, password: string) => boolean;
  register: (name: string, email: string, phone: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<Omit<User, 'password'> | null>(null);

  const login = (email: string, phone: string, password: string) => {
    const user = users.find(u => u.email === email && u.phone === phone && u.password === password);
    if (user) {
      setCurrentUser({ name: user.name, email: user.email, phone: user.phone });
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, phone: string, password: string) => {
    const exists = users.some(u => u.email === email);
    if (exists) return false;
    setUsers(prev => [...prev, { name, email, phone, password }]);
    return true;
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
