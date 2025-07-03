"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
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

  useEffect(() => {
    if (!token) {
      console.log('❌ Pas de token, connexion WebSocket impossible');
      return;
    }

    // Éviter de recréer la connexion si on a déjà un socket connecté
    if (socket?.connected) {
      return;
    }

    console.log('🔌 Tentative de connexion WebSocket avec token:', token.substring(0, 20) + '...');

    const socketInstance = io(`${process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:8080/api'}/ws/messages`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socketInstance.on('connect', () => {
      console.log('✅ Socket.IO connecté ! ID:', socketInstance.id);
      setIsConnected(true);
    });
    
    socketInstance.on('disconnect', (reason) => {
      console.log('❌ Socket.IO déconnecté. Raison:', reason);
      setIsConnected(false);
    });
    
    socketInstance.on('connect_error', (error) => {
      console.error('❌ Erreur de connexion Socket.IO:', error);
      setIsConnected(false);
    });

    socketInstance.on('error', (error) => {
      console.error('❌ Erreur Socket.IO:', error);
    });

    setSocket(socketInstance);

    return () => {
      console.log('🔌 Déconnexion WebSocket');
      socketInstance.disconnect();
    };
  }, [token]); // Retirer socket des dépendances pour éviter la boucle infinie

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