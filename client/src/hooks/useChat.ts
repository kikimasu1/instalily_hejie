import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ChatMessage } from "@shared/schema";

interface ChatData {
  messages: ChatMessage[];
}

export function useChat(sessionId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  // Fetch existing messages
  const { data: chatData } = useQuery<ChatData>({
    queryKey: ["/api/chat", sessionId],
    enabled: !!sessionId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, imageData }: { message: string, imageData?: {dataUrl: string, name: string} }) => {
      const requestBody: any = {
        message,
        sessionId,
      };
      
      if (imageData) {
        requestBody.imageUrl = imageData.dataUrl;
        requestBody.imageName = imageData.name;
      }
      
      const response = await apiRequest("POST", "/api/chat", requestBody);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat", sessionId] });
    },
  });

  // WebSocket connection
  useEffect(() => {
    if (!sessionId) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      ws.send(JSON.stringify({
        type: "join",
        sessionId,
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === "message") {
          setMessages(prev => [...prev, data.message]);
        }
        
        if (data.type === "typing") {
          setIsTyping(data.isTyping);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, [sessionId]);

  // Update messages when chat data changes
  useEffect(() => {
    if (chatData?.messages) {
      setMessages(chatData.messages);
    }
  }, [chatData]);

  const sendMessage = async (message: string, imageData?: {dataUrl: string, name: string}) => {
    // Always use HTTP API for image uploads, use WebSocket for text-only messages
    if (imageData) {
      await sendMessageMutation.mutateAsync({ message, imageData });
    } else {
      // Send via WebSocket for real-time experience
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: "message",
          content: message,
          sessionId,
        }));
      } else {
        // Fallback to HTTP API
        await sendMessageMutation.mutateAsync({ message });
      }
    }
  };

  const sendTyping = (isTyping: boolean) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "typing",
        isTyping,
        sessionId,
      }));
    }
  };

  return {
    messages,
    sendMessage,
    sendTyping,
    isLoading: sendMessageMutation.isPending,
    isTyping,
  };
}
