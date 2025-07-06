"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useMemo, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

interface SocketProviderProps {
  readonly children: ReactNode;
  readonly token: string;
}

export function SocketProvider({ children, token }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    // Éviter de recréer la connexion si le token n'a pas changé
    if (tokenRef.current === token && socketRef.current?.connected) {
      return;
    }

    // Déconnecter l'ancien socket s'il existe
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const socketInstance = io(`${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://holomatch.org/api'}/ws/messages`, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('❌ Erreur de connexion Socket.IO:', error);
      setIsConnected(false);
    });

    socketRef.current = socketInstance;
    tokenRef.current = token;
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  const contextValue = useMemo(() => ({
    socket,
    isConnected
  }), [socket, isConnected]);

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
