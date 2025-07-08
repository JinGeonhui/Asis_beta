// ✅ 커스텀 훅 수정 (null 허용)
// src/hooks/useSSE.ts
import { useEffect, useRef } from "react";

interface SSEOptions {
  url: string;
  onMessage: (data: any) => void;
  event?: string;
  onError?: (err: Event) => void;
}

export function useSSE(options: SSEOptions | null) {
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!options) return;

    const { url, onMessage, event = "message", onError } = options;
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
      es.close();
    };

    return () => {
      es.close();
    };
  }, [options]);
}
