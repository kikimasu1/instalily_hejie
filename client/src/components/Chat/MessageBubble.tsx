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
    <div className={`flex items-start space-x-2 sm:space-x-4 ${message.isUser ? 'justify-end' : ''}`}>
      {!message.isUser && (
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-partselect-blue to-partselect-dark rounded-full flex items-center justify-center flex-shrink-0 shadow-custom-md">
          <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
      )}
      
      <div className={`flex-1 ${message.isUser ? 'flex flex-col items-end' : ''}`}>
        <div
          className={`rounded-2xl p-3 sm:p-5 max-w-[280px] sm:max-w-lg transition-smooth ${
            message.isUser
              ? 'bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-tr-sm shadow-custom-md'
              : 'bg-white border border-border-light rounded-tl-sm shadow-custom-md hover:shadow-custom-lg'
          }`}
        >
          <div className={`text-sm sm:text-base leading-relaxed font-medium ${message.isUser ? 'text-white' : 'text-gray-900'}`}>
            {message.content.split('\n').map((line, i) => (
              <p key={i} className={i > 0 ? 'mt-2 sm:mt-3' : ''}>
                {line}
              </p>
            ))}
          </div>
          
          {/* Render product cards if any */}
          {message.productCards && message.productCards.length > 0 && (
            <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              {message.productCards.map((productId, index) => (
                <ProductCard key={index} productId={productId} />
              ))}
            </div>
          )}
        </div>
        
        <p className={`text-xs text-gray-500 mt-1 sm:mt-2 font-medium ${message.isUser ? 'text-right' : ''}`}>
          {timeAgo}
        </p>
      </div>
      
      {message.isUser && (
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-custom-md">
          <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
      )}
    </div>
  );
}
