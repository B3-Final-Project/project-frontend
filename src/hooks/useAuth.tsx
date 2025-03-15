import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { setAccessTokenHeaders } from "@/lib/utils";
import { LoginDto } from "@/lib/routes/auth/dto/login.dto";
import {
  useLoginMutation,
  useRefreshTokenMutation, useRegisterMutation
} from "@/hooks/react-query/auth";
import { cookies } from 'next/headers'

// Define the shape of your authentication context
interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const loginMutation = useLoginMutation()
  const refreshMutation = useRefreshTokenMutation()
  const registerMutation = useRegisterMutation()

  useEffect(() => {
    setAccessTokenHeaders(accessToken)
  }, [accessToken])

  useEffect(() =>{
    if (loginMutation.data?.AccessToken)
      setAccessToken(loginMutation.data?.AccessToken)
  }, [loginMutation.data])

  useEffect(() =>{
    if (refreshMutation.data?.AccessToken)
      setAccessToken(refreshMutation.data?.AccessToken)
  }, [refreshMutation.data])

  const login = async (credentials: LoginDto) => {
    loginMutation.mutate(credentials)
  };

  const logout = () => {
    setAccessToken(null);
  };

  const refresh = async () => {
    const cookieStore = await cookies()
    refreshMutation.mutate()
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy access to the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
