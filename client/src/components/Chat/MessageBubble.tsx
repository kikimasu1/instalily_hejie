import { formatDistanceToNow } from "date-fns";
import { Bot, User } from "lucide-react";
import ProductCard from "./ProductCard";
import type { ChatMessage } from "@shared/schema";

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const timeAgo = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });

  return (
    <div className={`flex items-start space-x-4 ${message.isUser ? 'justify-end' : ''}`}>
      {!message.isUser && (
        <div className="w-10 h-10 bg-gradient-to-br from-partselect-blue to-partselect-dark rounded-full flex items-center justify-center flex-shrink-0 shadow-custom-md">
          <Bot className="h-5 w-5 text-white" />
        </div>
      )}
      
      <div className={`flex-1 ${message.isUser ? 'flex justify-end' : ''}`}>
        <div
          className={`rounded-2xl p-5 max-w-lg transition-smooth ${
            message.isUser
              ? 'bg-gradient-to-br from-partselect-blue to-partselect-dark text-white rounded-tr-sm shadow-custom-md'
              : 'bg-white border border-border-light rounded-tl-sm shadow-custom-md hover:shadow-custom-lg'
          }`}
        >
          <div className={`text-base leading-relaxed ${message.isUser ? 'text-white' : 'text-text-dark'}`}>
            {message.content.split('\n').map((line, i) => (
              <p key={i} className={i > 0 ? 'mt-3' : ''}>
                {line}
              </p>
            ))}
          </div>
          
          {/* Render product cards if any */}
          {message.productCards && message.productCards.length > 0 && (
            <div className="mt-4 space-y-3">
              {message.productCards.map((productId, index) => (
                <ProductCard key={index} productId={productId} />
              ))}
            </div>
          )}
        </div>
        
        <p className={`text-xs text-gray-400 mt-2 font-medium ${message.isUser ? 'text-right' : ''}`}>
          {timeAgo}
        </p>
      </div>
      
      {message.isUser && (
        <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-custom-md">
          <User className="h-5 w-5 text-white" />
        </div>
      )}
    </div>
  );
}
