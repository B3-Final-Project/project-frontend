'use client'
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo
} from "react";
import { setAccessTokenHeaders } from "@/lib/utils";
import { LoginDto } from "@/lib/routes/auth/dto/login.dto";
import { useLoginMutation } from "@/hooks/react-query/auth";

// Define the shape of your authentication context
interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<Readonly<AuthContextType> | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const loginMutation = useLoginMutation()

  useEffect(() => {
    setAccessTokenHeaders(accessToken)
  }, [accessToken])

  useEffect(() =>{
    if (loginMutation.data?.AccessToken)
      setAccessToken(loginMutation.data?.AccessToken)
  }, [loginMutation.data])

  useEffect(() =>{
    if (loginMutation.data?.AccessToken) {
      setAccessToken(loginMutation.data?.AccessToken)
    }
  }, [loginMutation.data])

  const login = async (credentials: LoginDto): Promise<void> => {
    loginMutation.mutate(credentials)
  };

  const logout = () => {
    setAccessToken(null);
  };

  const memoizedObject = useMemo(() => {
    return {
    accessToken, setAccessToken, login, logout }
  }, [])

  return (
    <AuthContext.Provider value={memoizedObject}>
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
