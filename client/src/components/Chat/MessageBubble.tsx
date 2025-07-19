import { formatDistanceToNow } from "date-fns";
import { User } from "lucide-react";
import ProductCard from "./ProductCard";
import type { ChatMessage } from "@shared/schema";
// Using direct path to avatar.jpg since it's in the root directory

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const timeAgo = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });

  // Function to parse markdown bold formatting
  const parseTextWithBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return (
          <strong key={index} className="font-bold">
            {boldText}
          </strong>
        );
      }
      return part;
    });
  };



  return (
    <div className={`flex items-start space-x-2 sm:space-x-4 ${message.isUser ? 'justify-end' : ''}`}>
      {!message.isUser && (
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-custom-md overflow-hidden">
          <img 
            src="https://i.ibb.co/HDDX9wDq/Wechat-IMG140.png" 
            alt="PartSelect AI Assistant" 
            className="w-6 h-6 sm:w-8 sm:h-8 object-cover"
          />
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
          {/* Display uploaded image if present */}
          {message.imageUrl && (
            <div className="mb-3">
              <img 
                src={message.imageUrl} 
                alt={message.imageName || 'Uploaded image'} 
                className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200"
                style={{ maxHeight: '200px' }}
              />
              {message.imageName && (
                <p className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                  📷 {message.imageName}
                </p>
              )}
            </div>
          )}
          
          <div className={`text-sm sm:text-base leading-relaxed font-medium ${message.isUser ? 'text-white' : 'text-gray-900'}`}>
            {message.content.split('\n').map((line, i) => (
              <p key={i} className={i > 0 ? 'mt-2 sm:mt-3' : ''}>
                {parseTextWithBold(line)}
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
