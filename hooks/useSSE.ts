import { useEffect, useRef, useCallback } from "react";

interface SSEOptions {
  url: string;
  onMessage: (data: any) => void;
  event?: string;
  onError?: (err: Event) => void;
}

export function useSSE({ url, onMessage, event = "message", onError }: SSEOptions) {
  const eventSourceRef = useRef<EventSource | null>(null);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    disconnect();

    const es = new EventSource(url, { withCredentials: true });
    eventSourceRef.current = es;

    es.addEventListener(event, (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        onMessage(data);
      } catch (err) {
        console.error("SSE 메시지 파싱 실패", err);
      }
    });

    es.onerror = (e) => {
      console.error("SSE 연결 오류", e);
      if (onError) onError(e);
      disconnect();
    };
  }, [url, event, onMessage, onError, disconnect]);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { disconnect, reconnect: connect };
}
