import { useEffect, useRef, useState } from 'react';
import { useAuth } from './useAuth';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return; // Don't connect if not logged in

    // Build ws url based on current protocol and host
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      // Authenticate with the server upon connection
      ws.send(JSON.stringify({
        type: 'AUTH',
        userId: user.id,
        role: user.role
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
      } catch (e) {
        console.error('Error parsing WS message', e);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      wsRef.current = null;
    };

    ws.onerror = (error) => {
      console.error('WebSocket error', error);
      ws.close();
    };

    return () => {
      ws.close();
    };
  }, [user]);

  const sendLocation = (employeeId: string, latitude: number, longitude: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'LOCATION_UPDATE',
        payload: { employeeId, latitude, longitude }
      }));
    }
  };

  return { isConnected, lastMessage, sendLocation };
}
