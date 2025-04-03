'use client'
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo, useCallback
} from "react";
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

  const logout = () => {
    setAccessToken(null);
  };

  const login = useCallback(async (credentials: LoginDto): Promise<void> => {
    await loginMutation.mutateAsync(credentials);
  }, [loginMutation]);

  const register = useCallback(async (credentials: RegisterDto): Promise<void> => {
    setUserData({ email: credentials.email });
    await registerMutation.mutateAsync(credentials);
  }, [registerMutation]);

  const confirm = useCallback(async (code: string): Promise<void> => {
    await confirmMutation.mutateAsync({ username: userData?.email || '', code });
  }, [confirmMutation, userData?.email]);

  const memoizedObject = useMemo(() => {
    return {
      accessToken, setAccessToken, userData, login, register, confirm, logout
    }
  }, [accessToken, confirm, login, register, userData])

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
