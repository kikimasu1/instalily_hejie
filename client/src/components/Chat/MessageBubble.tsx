import { formatDistanceToNow } from "date-fns";
import { User } from "lucide-react";
import ProductCard from "./ProductCard";
import InteractiveButtons from "./InteractiveButtons";
import type { ChatMessage } from "@shared/schema";
import partSelectLogo from "@assets/image_1752872557573.png";

interface MessageBubbleProps {
  message: ChatMessage;
  onQuickAction?: (action: string) => void;
}

export default function MessageBubble({ message, onQuickAction }: MessageBubbleProps) {
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

  // Detect if message should have interactive buttons
  const shouldShowInteractiveButtons = () => {
    if (message.isUser) return false;
    
    const content = message.content.toLowerCase();
    const hasQuestions = content.includes('what type of appliance') || 
                        content.includes('model number') ||
                        content.includes('specific part') ||
                        content.includes('would you be able to provide');
    
    return hasQuestions;
  };

  // Generate interactive options based on message content
  const getInteractiveOptions = () => {
    const content = message.content.toLowerCase();
    
    if (content.includes('what type of appliance')) {
      return [
        { id: '1', text: 'Refrigerator', category: 'appliance', action: 'I have a refrigerator' },
        { id: '2', text: 'Dishwasher', category: 'appliance', action: 'I have a dishwasher' }
      ];
    }
    
    if (content.includes('specific part')) {
      return [
        { id: '1', text: 'Water Filter', category: 'filter', action: 'I need a water filter' },
        { id: '2', text: 'Door Seal', category: 'seal', action: 'I need a door seal' },
        { id: '3', text: 'Ice Maker Parts', category: 'part', action: 'I need ice maker parts' },
        { id: '4', text: 'Rack/Shelf', category: 'part', action: 'I need a rack or shelf' },
        { id: '5', text: 'Motor/Pump', category: 'part', action: 'I need a motor or pump' },
        { id: '6', text: 'Not Sure', category: 'repair', action: 'I\'m not sure what part I need' }
      ];
    }
    
    if (content.includes('model number')) {
      return [
        { id: '1', text: 'I have my model number', category: 'repair', action: 'I have my model number ready' },
        { id: '2', text: 'Help me find it', category: 'repair', action: 'Help me find my model number' },
        { id: '3', text: 'I don\'t have it', category: 'repair', action: 'I don\'t have my model number' }
      ];
    }
    
    return [];
  };

  return (
    <div className={`flex items-start space-x-2 sm:space-x-4 ${message.isUser ? 'justify-end' : ''}`}>
      {!message.isUser && (
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-custom-md overflow-hidden">
          <img 
            src={partSelectLogo} 
            alt="PartSelect AI Assistant" 
            className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
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

        {/* Interactive Buttons for AI responses */}
        {shouldShowInteractiveButtons() && onQuickAction && !message.isUser && (
          <div className="mt-3">
            <InteractiveButtons
              options={getInteractiveOptions()}
              onSelect={onQuickAction}
              title="Quick Responses"
              description="Choose an option to continue:"
            />
          </div>
        )}
      </div>
      
      {message.isUser && (
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-custom-md">
          <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
      )}
    </div>
  );
}
