import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import FirebaseService, { User } from '@/lib/firebaseService';

interface UserContextType {
  user: User | null;
  userId: string | null;
  isLoading: boolean;
  login: (email: string, name: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from localStorage on app start
  useEffect(() => {
    const savedUserId = localStorage.getItem('paysafe_user_id');
    if (savedUserId) {
      setUserId(savedUserId);
      loadUser(savedUserId);
    } else {
      // Auto-create a guest user if none exists
      (async () => {
        setIsLoading(true);
        const guestUid = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const guestUser: User = {
          id: guestUid,
          email: 'guest@paysafe.app',
          name: 'Guest',
          riskProfile: 'low',
          createdAt: Date.now(),
          lastLogin: Date.now()
        };
        await FirebaseService.saveUser(guestUser);
        setUser(guestUser);
        setUserId(guestUid);
        localStorage.setItem('paysafe_user_id', guestUid);
        setIsLoading(false);
      })();
    }
  }, []);

  const loadUser = async (uid: string) => {
    try {
      const userData = await FirebaseService.getUser(uid);
      if (userData) {
        setUser(userData);
      } else {
        // Create default user if not exists
        const defaultUser: User = {
          id: uid,
          email: 'user@example.com',
          name: 'User',
          riskProfile: 'low',
          createdAt: Date.now(),
          lastLogin: Date.now()
        };
        await FirebaseService.saveUser(defaultUser);
        setUser(defaultUser);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, name: string) => {
    try {
      setIsLoading(true);
      // Generate a simple user ID (in a real app, you'd use Firebase Auth)
      const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newUser: User = {
        id: uid,
        email,
        name,
        riskProfile: 'low',
        createdAt: Date.now(),
        lastLogin: Date.now()
      };

      await FirebaseService.saveUser(newUser);
      
      setUser(newUser);
      setUserId(uid);
      localStorage.setItem('paysafe_user_id', uid);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setUserId(null);
    localStorage.removeItem('paysafe_user_id');
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...updates };
      await FirebaseService.saveUser(updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const value: UserContextType = {
    user,
    userId,
    isLoading,
    login,
    logout,
    updateUserProfile
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 