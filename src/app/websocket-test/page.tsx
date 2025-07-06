"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "react-oidc-context";
import { useSocket } from "@/providers/SocketProvider";

export default function WebSocketTestPage() {
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();
  const [connectionLog, setConnectionLog] = useState<string[]>([]);
  const [testMessage, setTestMessage] = useState("");
  const [apiStatus, setApiStatus] = useState<string>("Unknown");

  const addLog = (message: string) => {
    setConnectionLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Test API connectivity
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://holomatch.org';
        const response = await fetch(`${baseUrl}/api/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          setApiStatus("Connected");
          addLog(`✅ API health check successful: ${response.status}`);
        } else {
          setApiStatus("Error");
          addLog(`❌ API health check failed: ${response.status}`);
        }
      } catch (error) {
        setApiStatus("Failed");
        addLog(`❌ API connection failed: ${error}`);
      }
    };

    testApiConnection();
  }, []);

  useEffect(() => {
    addLog(`Socket connected: ${isConnected}`);
  }, [isConnected]);

  useEffect(() => {
    if (socket) {
      addLog(`Socket instance created with ID: ${socket.id}`);
      
      // Listen for test responses
      socket.on('messageSent', (data) => {
        addLog(`Message sent successfully: ${JSON.stringify(data)}`);
      });

      socket.on('error', (error) => {
        addLog(`Socket error: ${error.message}`);
      });

      return () => {
        socket.off('messageSent');
        socket.off('error');
      };
    }
  }, [socket, isConnected]);

  const sendTestMessage = () => {
    if (socket && isConnected && testMessage.trim()) {
      addLog(`Sending custom message: ${testMessage}`);
      socket.emit('sendMessage', {
        conversation_id: 'test-conversation',
        content: testMessage
      });
      setTestMessage("");
    }
  };

  const getOnlineUsers = () => {
    if (socket && isConnected) {
      addLog("Requesting online users...");
      socket.emit('getOnlineUsers');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>WebSocket Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Connection Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div>
              <strong>API Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                apiStatus === 'Connected' ? 'bg-green-100 text-green-800' : 
                apiStatus === 'Error' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {apiStatus}
              </span>
            </div>
            <div>
              <strong>Socket ID:</strong> {socket?.id || 'N/A'}
            </div>
            <div>
              <strong>User ID:</strong> {user?.profile?.sub || 'N/A'}
            </div>
            <div>
              <strong>Transport:</strong> {socket?.io?.engine?.transport?.name || 'N/A'}
            </div>
          </div>

          <div className="space-y-2">
            <strong>Environment Variables:</strong>
            <div className="text-sm bg-gray-100 p-2 rounded">
              <div>NEXT_PUBLIC_BASE_URL: {process.env.NEXT_PUBLIC_BASE_URL || 'Not set'}</div>
              <div>Connection URL: {process.env.NEXT_PUBLIC_BASE_URL || 'https://holomatch.org'}/api/ws/messages</div>
            </div>
          </div>

          <div className="space-y-2">
            <strong>Actions:</strong>
            <div className="flex gap-2">
              <Button onClick={getOnlineUsers} disabled={!isConnected}>
                Get Online Users
              </Button>
              <Button 
                onClick={sendTestMessage} 
                disabled={!isConnected || !testMessage.trim()}
              >
                Send Test Message
              </Button>
            </div>
            <input
              type="text"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Enter test message..."
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="space-y-2">
            <strong>Connection Log:</strong>
            <div className="bg-black text-green-400 p-4 rounded h-64 overflow-y-auto font-mono text-sm">
              {connectionLog.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 