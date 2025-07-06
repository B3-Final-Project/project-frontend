"use client";

import { ReactNode, createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";

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
      console.log('❌ Pas de token fourni pour la connexion WebSocket');
      return;
    }

    // Éviter de recréer la connexion si le token n'a pas changé
    if (tokenRef.current === token && socketRef.current?.connected) {
      console.log('✅ Token identique, connexion déjà établie');
      return;
    }

    // Déconnecter l'ancien socket s'il existe
    if (socketRef.current) {
      console.log('🔄 Déconnexion de l\'ancien socket');
      socketRef.current.disconnect();
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://holomatch.org';
    const namespace = '/api/ws/messages';

    // Decode JWT token to get userId and groups
    const decodeToken = (token: string) => {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
          userId: payload.sub || payload.userId || payload.user_id,
          groups: payload.groups || payload['cognito:groups'] || []
        };
      } catch (error) {
        console.error('❌ Erreur lors du décodage du token:', error);
        return { userId: null, groups: [] };
      }
    };

    const { userId, groups } = decodeToken(token);

    if (!userId) {
      console.error('❌ Impossible d\'extraire userId du token');
      return;
    }

    const fullUrl = `${baseUrl}${namespace}`;
    console.log('🔌 Tentative de connexion WebSocket:', {
      url: fullUrl,
      userId,
      groups,
      tokenLength: token.length,
      baseUrl,
      namespace
    });

    const socketInstance = io(
      fullUrl,
      {
        auth: { 
          userId,
          groups,
          token // Keep token for backward compatibility if needed
        },
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
        forceNew: true,
        withCredentials: true, // Important for CORS with credentials
      }
    );

    // Track connection state changes
    socketInstance.on('connect', () => {
      console.log('✅ WebSocket connecté avec succès');
      console.log('📊 Détails de connexion:', {
        id: socketInstance.id,
        connected: socketInstance.connected,
        transport: socketInstance.io.engine.transport.name
      });
      setIsConnected(true);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('❌ WebSocket déconnecté:', reason);
      console.log('📊 État de déconnexion:', {
        id: socketInstance.id,
        connected: socketInstance.connected
      });
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('❌ Erreur de connexion Socket.IO:', error);
      console.error('📊 Détails de l\'erreur:', {
        message: error.message,
        transport: socketInstance.io.engine.transport.name
      });
      setIsConnected(false);
    });

    socketInstance.on('error', (error) => {
      console.error('❌ Erreur Socket.IO:', error);
    });

    socketInstance.io.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Reconnexion réussie après ${attemptNumber} tentatives`);
    });

    socketInstance.io.on('reconnect_error', (error) => {
      console.error('❌ Erreur de reconnexion:', error);
    });

    socketInstance.io.on('reconnect_failed', () => {
      console.error('❌ Échec de toutes les tentatives de reconnexion');
    });

    socketRef.current = socketInstance;
    tokenRef.current = token;
    setSocket(socketInstance);

    return () => {
      console.log('🧹 Nettoyage du socket');
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
