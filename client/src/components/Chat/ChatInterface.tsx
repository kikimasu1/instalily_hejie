import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@/hooks/useChat";
import { useCart } from "@/hooks/useCart";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import ChatDownloadModal from "./ChatDownloadModal";
import {
  ShoppingCart,
  Search,
  Wrench,
  Bolt,
  CheckCircle,
  Send,
  Paperclip,
  Download,
  Bot,
  BarChart3,
  X,
} from "lucide-react";
import { Link } from "wouter";

interface ChatInterfaceProps {
  sessionId: string;
  onToggleSidebar: () => void;
  isMobile: boolean;
}

export default function ChatInterface({
  sessionId,
  onToggleSidebar,
  isMobile,
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, isLoading } = useChat(sessionId);
  const { cartData } = useCart(sessionId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if ((!message.trim() && !uploadedImage) || isLoading) return;

    const messageToSend = message.trim() || `📷 Uploaded image: ${uploadedImage?.name}`;
    setMessage("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    await sendMessage(messageToSend, uploadedImage);
    
    // Clear uploaded image after sending
    setUploadedImage(null);
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
      "find-parts": "I need help finding parts for my appliance",
      "installation-help": "I need installation instructions for a part",
      troubleshooting:
        "I'm having issues with my appliance and need troubleshooting help",
      "check-compatibility":
        "I need to check if a part is compatible with my appliance",
    };

    const actionMessage = actionMessages[action as keyof typeof actionMessages];
    if (actionMessage) {
      insertSampleQuery(actionMessage);
    }
  };



  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const [uploadedImage, setUploadedImage] = useState<{dataUrl: string, name: string} | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name);
      
      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB.');
        return;
      }
      
      try {
        // Convert image to data URL for display
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageDataUrl = event.target?.result as string;
          setUploadedImage({
            dataUrl: imageDataUrl,
            name: file.name
          });
          // Focus on the input to allow user to add text
          inputRef.current?.focus();
        };
        
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-border-light p-3 sm:p-6 flex items-center justify-between shadow-custom-sm">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-custom-md overflow-hidden">
              <img
                src="https://i.ibb.co/HDDX9wDq/Wechat-IMG140.png"
                alt="PartSelect"
                className="w-6 h-6 sm:w-10 sm:h-10 object-cover"
              />
            </div>
            <div>
              <h1 className="text-sm sm:text-xl font-semibold text-text-dark">
                PartSelect AI Assistant
              </h1>
              <div className="flex items-center space-x-2 hidden sm:flex">
                <div className="w-2 h-2 bg-success-green rounded-full animate-pulse"></div>
                <p className="text-sm text-gray-600 font-medium">
                  Online • Here to help since 1999
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="text-partselect-blue hover:bg-blue-50 transition-smooth relative"
            title="Shopping Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartData && cartData.itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartData.itemCount}
              </span>
            )}
          </Button>
          <Link href="/analytics">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-partselect-blue hover:bg-blue-50 transition-smooth"
              title="View Analytics"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDownloadModal(true)}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-smooth"
            title="Download Chat History"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-white border-b border-border-light p-3 sm:p-6">
        <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-2 sm:pb-0 sm:flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction("find-parts")}
            className="bg-gradient-to-r from-blue-50 to-blue-100 text-partselect-blue border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-smooth hover-lift shadow-custom-sm font-medium px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
          >
            <Search className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Find Parts</span>
            <span className="sm:hidden">Parts</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction("installation-help")}
            className="bg-gradient-to-r from-green-50 to-green-100 text-success-green border-green-200 hover:from-green-100 hover:to-green-200 transition-smooth hover-lift shadow-custom-sm font-medium px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
          >
            <Bolt className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Installation Help</span>
            <span className="sm:hidden">Install</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction("troubleshooting")}
            className="bg-gradient-to-r from-orange-50 to-orange-100 text-orange-600 border-orange-200 hover:from-orange-100 hover:to-orange-200 transition-smooth hover-lift shadow-custom-sm font-medium px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
          >
            <Wrench className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Troubleshooting</span>
            <span className="sm:hidden">Troubleshoot</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction("check-compatibility")}
            className="bg-gradient-to-r from-purple-50 to-purple-100 text-purple-600 border-purple-200 hover:from-purple-100 hover:to-purple-200 transition-smooth hover-lift shadow-custom-sm font-medium px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
          >
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Check Compatibility</span>
            <span className="sm:hidden">Compatibility</span>
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
        {messages.length === 0 && (
          <div className="flex items-start space-x-2 sm:space-x-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-custom-md overflow-hidden">
              <img
                src="https://i.ibb.co/HDDX9wDq/Wechat-IMG140.png"
                alt="PartSelect"
                className="w-6 h-6 sm:w-8 sm:h-8 object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-2xl rounded-tl-sm p-4 sm:p-6 shadow-custom-md border border-border-light max-w-[280px] sm:max-w-lg">
                <p className="text-gray-900 font-medium text-sm sm:text-base leading-relaxed">
                  Welcome to PartSelect! Since 1999, we've been empowering DIY
                  repairs with genuine parts and expert guidance. I'm here to
                  help you find the right parts, provide installation know-how,
                  and guide you through every stage of your repair.
                </p>
                <p className="text-gray-900 font-medium mt-2 sm:mt-3 text-sm sm:text-base leading-relaxed">
                  Whether it's refrigerators, dishwashers, or other appliances -
                  let's fix it right the first time!
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1 sm:mt-2 font-medium">
                Just now
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            message={msg}
          />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-border-light p-3 sm:p-6 shadow-custom-sm safe-area-bottom">
        {/* Image Preview */}
        {uploadedImage && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start space-x-3">
              <img 
                src={uploadedImage.dataUrl} 
                alt={uploadedImage.name} 
                className="w-16 h-16 object-cover rounded-lg border border-gray-300"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">📷 {uploadedImage.name}</p>
                <p className="text-xs text-gray-500 mt-1">Ready to send with your message</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setUploadedImage(null)}
                className="h-6 w-6 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-end space-x-2 sm:space-x-4 w-full">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyPress}
                placeholder="Ask about parts..."
                className="w-full pr-10 sm:pr-12 resize-none min-h-[44px] sm:min-h-[52px] max-h-[120px] text-sm sm:text-base font-medium text-gray-900 placeholder:text-gray-500 border-2 border-gray-200 focus:border-partselect-blue rounded-xl transition-smooth shadow-custom-sm"
                rows={1}
              />
              <div className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3 flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFileUpload}
                  className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 hover:text-partselect-blue transition-smooth hover:bg-blue-50 rounded-lg"
                  title="Attach File"
                >
                  <Paperclip className="h-3 w-3 sm:h-4 sm:w-4" />
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
            disabled={(!message.trim() && !uploadedImage) || isLoading}
            className="flex-shrink-0 bg-gradient-to-r from-partselect-blue to-partselect-dark hover:from-partselect-dark hover:to-partselect-blue text-white px-3 py-2 sm:px-6 sm:py-3 rounded-xl transition-smooth shadow-custom-md hover-lift font-medium"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        {/* Sample Queries */}
        <div className="mt-3 sm:mt-4 flex flex-wrap gap-1 sm:gap-2 hidden sm:flex">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              insertSampleQuery(
                "I need a door seal for my Whirlpool dishwasher model WDT780SAEM1",
              )
            }
            className="px-3 sm:px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-xs sm:text-sm hover:bg-gray-100 transition-smooth border border-gray-200 font-medium"
          >
            "I need a door seal for my dishwasher"
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              insertSampleQuery(
                "My ice maker isn't working, what could be wrong?",
              )
            }
            className="px-3 sm:px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-xs sm:text-sm hover:bg-gray-100 transition-smooth border border-gray-200 font-medium"
          >
            "My ice maker isn't working"
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              insertSampleQuery(
                "Is part PS11770274 compatible with my WRS325SDHZ?",
              )
            }
            className="px-3 sm:px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-xs sm:text-sm hover:bg-gray-100 transition-smooth border border-gray-200 font-medium"
          >
            "Check part compatibility"
          </Button>
        </div>
      </div>

      {/* Download Modal */}
      <ChatDownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        messages={messages}
        sessionId={sessionId}
      />
    </div>
  );
}
