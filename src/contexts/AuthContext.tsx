import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Get users from localStorage or initialize empty object
const getStoredUsers = () => {
  const storedUsers = localStorage.getItem('users');
  return storedUsers ? JSON.parse(storedUsers) : {};
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<{ [key: string]: { name: string; email: string; password: string } }>(getStoredUsers());

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Update localStorage whenever users change
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const register = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      
      // Check if user already exists
      if (users[email]) {
        throw new Error('User already exists');
      }

      // Store user data
      const newUsers = { ...users, [email]: { name, email, password } };
      setUsers(newUsers);
      
      // Create user session
      const newUser = { id: Date.now().toString(), name, email };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      
      // Check if user exists
      const userData = users[email];
      if (!userData) {
        throw new Error('User not found. Please sign up first.');
      }

      // Verify password
      if (userData.password !== password) {
        throw new Error('Invalid password');
      }

      // Create user session
      const user = { id: Date.now().toString(), name: userData.name, email: userData.email };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Logout failed');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 