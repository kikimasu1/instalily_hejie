import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@/hooks/useChat";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { 
  ShoppingCart, 
  Search, 
  Wrench, 
  Bolt, 
  CheckCircle, 
  Send, 
  Paperclip, 
  Camera,
  Trash2,
  Download,
  Bot
} from "lucide-react";

interface ChatInterfaceProps {
  sessionId: string;
  onToggleSidebar: () => void;
  isMobile: boolean;
}

export default function ChatInterface({ sessionId, onToggleSidebar, isMobile }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, isLoading } = useChat(sessionId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const messageToSend = message.trim();
    setMessage("");
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    await sendMessage(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  const insertSampleQuery = (query: string) => {
    setMessage(query);
    textareaRef.current?.focus();
  };

  const handleQuickAction = (action: string) => {
    const actionMessages = {
      'find-parts': 'I need help finding parts for my appliance',
      'installation-help': 'I need installation instructions for a part',
      'troubleshooting': 'I\'m having issues with my appliance and need troubleshooting help',
      'check-compatibility': 'I need to check if a part is compatible with my appliance'
    };
    
    const actionMessage = actionMessages[action as keyof typeof actionMessages];
    if (actionMessage) {
      insertSampleQuery(actionMessage);
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Implement file upload functionality
      console.log("File selected:", file.name);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-border-light p-6 flex items-center justify-between shadow-custom-sm">
        <div className="flex items-center space-x-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="text-partselect-blue hover:bg-blue-50 transition-smooth"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-partselect-blue to-partselect-dark rounded-full flex items-center justify-center shadow-custom-md">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-text-dark">PartSelect AI Assistant</h1>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success-green rounded-full animate-pulse"></div>
                <p className="text-sm text-gray-600 font-medium">Online • Refrigerator & Dishwasher Parts Expert</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              // TODO: Clear chat with confirmation
              console.log("Clear chat");
            }}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-smooth"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              // TODO: Download chat history
              console.log("Download history");
            }}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-smooth"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-white border-b border-border-light p-6">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('find-parts')}
            className="bg-gradient-to-r from-blue-50 to-blue-100 text-partselect-blue border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-smooth hover-lift shadow-custom-sm font-medium px-4 py-2 rounded-lg"
          >
            <Search className="h-4 w-4 mr-2" />
            Find Parts
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('installation-help')}
            className="bg-gradient-to-r from-green-50 to-green-100 text-success-green border-green-200 hover:from-green-100 hover:to-green-200 transition-smooth hover-lift shadow-custom-sm font-medium px-4 py-2 rounded-lg"
          >
            <Bolt className="h-4 w-4 mr-2" />
            Installation Help
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('troubleshooting')}
            className="bg-gradient-to-r from-orange-50 to-orange-100 text-orange-600 border-orange-200 hover:from-orange-100 hover:to-orange-200 transition-smooth hover-lift shadow-custom-sm font-medium px-4 py-2 rounded-lg"
          >
            <Wrench className="h-4 w-4 mr-2" />
            Troubleshooting
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('check-compatibility')}
            className="bg-gradient-to-r from-purple-50 to-purple-100 text-purple-600 border-purple-200 hover:from-purple-100 hover:to-purple-200 transition-smooth hover-lift shadow-custom-sm font-medium px-4 py-2 rounded-lg"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Check Compatibility
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-partselect-blue to-partselect-dark rounded-full flex items-center justify-center flex-shrink-0 shadow-custom-md">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-2xl rounded-tl-sm p-6 shadow-custom-md border border-border-light max-w-lg">
                <p className="text-text-dark text-base leading-relaxed">Hi! I'm your PartSelect AI assistant. I can help you find refrigerator and dishwasher parts, check compatibility, provide installation guidance, and troubleshoot appliance issues.</p>
                <p className="text-text-dark mt-3 text-base leading-relaxed">What can I help you with today?</p>
              </div>
              <p className="text-xs text-gray-400 mt-2 font-medium">Just now</p>
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-border-light p-6 shadow-custom-sm">
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyPress}
                placeholder="Ask about refrigerator or dishwasher parts, installation, troubleshooting..."
                className="pr-24 resize-none min-h-[52px] max-h-[120px] text-base border-2 border-gray-200 focus:border-partselect-blue rounded-xl transition-smooth shadow-custom-sm"
                rows={1}
              />
              <div className="absolute right-3 bottom-3 flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFileUpload}
                  className="h-8 w-8 text-gray-400 hover:text-partselect-blue transition-smooth hover:bg-blue-50 rounded-lg"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFileUpload}
                  className="h-8 w-8 text-gray-400 hover:text-partselect-blue transition-smooth hover:bg-blue-50 rounded-lg"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            className="bg-gradient-to-r from-partselect-blue to-partselect-dark hover:from-partselect-dark hover:to-partselect-blue text-white px-6 py-3 rounded-xl transition-smooth shadow-custom-md hover-lift font-medium"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>

        {/* Sample Queries */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertSampleQuery("I need a door seal for my Whirlpool dishwasher model WDT780SAEM1")}
            className="px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-sm hover:bg-gray-100 transition-smooth border border-gray-200 font-medium"
          >
            "I need a door seal for my dishwasher"
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertSampleQuery("My ice maker isn't working, what could be wrong?")}
            className="px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-sm hover:bg-gray-100 transition-smooth border border-gray-200 font-medium"
          >
            "My ice maker isn't working"
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertSampleQuery("Is part PS11770274 compatible with my WRS325SDHZ?")}
            className="px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-sm hover:bg-gray-100 transition-smooth border border-gray-200 font-medium"
          >
            "Check part compatibility"
          </Button>
        </div>
      </div>
    </div>
  );
}
