
import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "athlete" | "scout" | "team" | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePic?: string;
  bio?: string;
  location?: string;
  sport?: string;
  position?: string;
  experience?: string;
  teamSize?: string;
  foundedYear?: string;
  homeVenue?: string;
  phone?: string;
  website?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  setRole: (role: UserRole) => void;
  updateUserProfile: (updatedProfile: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("sportlinked-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role?: UserRole) => {
    // Mock login functionality
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create mock user based on email
    const savedRole = user?.role || role || "athlete";
    
    // Ensure the user can't switch roles by logging in (they must register a new account)
    if (user && role && user.role !== role) {
      throw new Error("You cannot log in as a different role. Please create a new account.");
    }
    
    const mockUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name: email.split('@')[0],
      email,
      role: savedRole
    };
    
    setUser(mockUser);
    localStorage.setItem("sportlinked-user", JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      role
    };
    
    setUser(newUser);
    localStorage.setItem("sportlinked-user", JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sportlinked-user");
  };

  const setRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem("sportlinked-user", JSON.stringify(updatedUser));
    } else {
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name: "",
        email: "",
        role
      };
      setUser(newUser);
    }
  };

  const updateUserProfile = (updatedProfile: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updatedProfile };
      setUser(updatedUser);
      localStorage.setItem("sportlinked-user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        setRole,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
