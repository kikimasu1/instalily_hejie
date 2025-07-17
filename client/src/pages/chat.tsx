import { useState, useEffect } from "react";
import ChatInterface from "@/components/Chat/ChatInterface";
import CartSidebar from "@/components/Cart/CartSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/hooks/useCart";

export default function ChatPage() {
  const [sessionId, setSessionId] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { cartData } = useCart(sessionId);

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
      <div className="min-h-screen flex items-center justify-center bg-background-gradient">
        <div className="text-center bg-white p-8 rounded-2xl shadow-custom-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-partselect-blue mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-text-dark mb-2">Initializing PartSelect AI</h2>
          <p className="text-gray-600">Setting up your chat session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-background-gradient">
      <div className="flex h-full">
        {/* Desktop Sidebar - Only show when cart has items */}
        {!isMobile && cartData && cartData.items.length > 0 && (
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
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300">
            <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white transform transition-transform duration-300 shadow-custom-lg">
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
