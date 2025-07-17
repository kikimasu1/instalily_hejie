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
    <div className={`flex items-start space-x-3 ${message.isUser ? 'justify-end' : ''}`}>
      {!message.isUser && (
        <div className="w-8 h-8 bg-partselect-blue rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}
      
      <div className={`flex-1 ${message.isUser ? 'flex justify-end' : ''}`}>
        <div
          className={`rounded-2xl p-4 shadow-sm max-w-lg ${
            message.isUser
              ? 'bg-partselect-blue text-white rounded-tr-sm'
              : 'bg-white border border-border-light rounded-tl-sm'
          }`}
        >
          <div className={`${message.isUser ? 'text-white' : 'text-text-dark'}`}>
            {message.content.split('\n').map((line, i) => (
              <p key={i} className={i > 0 ? 'mt-2' : ''}>
                {line}
              </p>
            ))}
          </div>
          
          {/* Render product cards if any */}
          {message.productCards && message.productCards.length > 0 && (
            <div className="mt-3 space-y-3">
              {message.productCards.map((productId, index) => (
                <ProductCard key={index} productId={productId} />
              ))}
            </div>
          )}
        </div>
        
        <p className={`text-xs text-gray-500 mt-1 ${message.isUser ? 'text-right' : ''}`}>
          {timeAgo}
        </p>
      </div>
      
      {message.isUser && (
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-gray-600" />
        </div>
      )}
    </div>
  );
}
