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
import {
  useConfirmAccountMutation,
  useLoginMutation,
  useRegisterMutation
} from "@/hooks/react-query/auth";
import { RegisterDto } from "@/lib/routes/auth/dto/register.dto";
import { UserData } from "@/lib/routes/auth/types/UserData";

// Define the shape of your authentication context
interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  userData?: UserData;
  login: (credentials: LoginDto) => Promise<void>;
  register: (credentials: RegisterDto) => Promise<void>;
  confirm: (code: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<Readonly<AuthContextType> | undefined>(undefined);

export function AuthProvider({ children }: { children: Readonly<ReactNode> }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData>()
  const loginMutation = useLoginMutation()
  const registerMutation = useRegisterMutation()
  const confirmMutation = useConfirmAccountMutation()

  useEffect(() => {
    setAccessTokenHeaders(accessToken)
  }, [accessToken])

  useEffect(() =>{
    if (loginMutation.data?.AccessToken)
      setAccessToken(loginMutation.data?.AccessToken)
  }, [loginMutation.data])

  const login = async (credentials: LoginDto): Promise<void> => {
    loginMutation.mutate(credentials)
  };

  const logout = () => {
    setAccessToken(null);
  };

  const register = async (credentials: RegisterDto): Promise<void> => {
    setUserData({email: credentials.email})
    registerMutation.mutate(credentials)
  }

  const confirm = async (code: string): Promise<void> => {
    confirmMutation.mutate({username: userData?.email || '', code})
  }

  const memoizedObject = useMemo(() => {
    return {
    accessToken, setAccessToken, userData, login, register, confirm, logout }
  }, [accessToken, userData])

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
