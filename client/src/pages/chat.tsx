import { useState, useEffect } from "react";
import ChatInterface from "@/components/Chat/ChatInterface";
import CartSidebar from "@/components/Cart/CartSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ChatPage() {
  const [sessionId, setSessionId] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Generate session ID if not exists
    const storedSessionId = localStorage.getItem("partselect-session-id");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("partselect-session-id", newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-gray">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-partselect-blue mx-auto mb-4"></div>
          <p className="text-text-dark">Initializing chat session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-background-gray">
      <div className="flex h-full">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className="w-80 flex-shrink-0">
            <CartSidebar sessionId={sessionId} />
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChatInterface 
            sessionId={sessionId} 
            onToggleSidebar={toggleSidebar}
            isMobile={isMobile}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobile && isSidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white transform transition-transform duration-300">
              <CartSidebar 
                sessionId={sessionId} 
                onClose={() => setIsSidebarOpen(false)}
                isMobile={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
