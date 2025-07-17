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
      <div className="bg-white border-b border-border-light p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="text-partselect-blue"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-partselect-blue rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-text-dark">PartSelect AI Assistant</h1>
              <p className="text-xs text-gray-600">Online • Specializing in Refrigerator & Dishwasher Parts</p>
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
            className="text-gray-500 hover:text-gray-700"
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
            className="text-gray-500 hover:text-gray-700"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-white border-b border-border-light p-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('find-parts')}
            className="bg-blue-50 text-partselect-blue border-blue-200 hover:bg-blue-100"
          >
            <Search className="h-4 w-4 mr-1" />
            Find Parts
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('installation-help')}
            className="bg-green-50 text-success-green border-green-200 hover:bg-green-100"
          >
            <Bolt className="h-4 w-4 mr-1" />
            Installation Help
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('troubleshooting')}
            className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
          >
            <Wrench className="h-4 w-4 mr-1" />
            Troubleshooting
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('check-compatibility')}
            className="bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Check Compatibility
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-partselect-blue rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-border-light max-w-md">
                <p className="text-text-dark">Hi! I'm your PartSelect AI assistant. I can help you find refrigerator and dishwasher parts, check compatibility, provide installation guidance, and troubleshoot appliance issues.</p>
                <p className="text-text-dark mt-2">What can I help you with today?</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Just now</p>
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
      <div className="bg-white border-t border-border-light p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyPress}
                placeholder="Ask about refrigerator or dishwasher parts, installation, troubleshooting..."
                className="pr-24 resize-none min-h-[48px] max-h-[120px]"
                rows={1}
              />
              <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFileUpload}
                  className="h-8 w-8 text-gray-400 hover:text-gray-600"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFileUpload}
                  className="h-8 w-8 text-gray-400 hover:text-gray-600"
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
            className="bg-partselect-blue hover:bg-partselect-dark text-white p-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Sample Queries */}
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertSampleQuery("I need a door seal for my Whirlpool dishwasher model WDT780SAEM1")}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 h-auto"
          >
            "I need a door seal for my dishwasher"
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertSampleQuery("My ice maker isn't working, what could be wrong?")}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 h-auto"
          >
            "My ice maker isn't working"
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertSampleQuery("Is part PS11770274 compatible with my WRS325SDHZ?")}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 h-auto"
          >
            "Check part compatibility"
          </Button>
        </div>
      </div>
    </div>
  );
}
