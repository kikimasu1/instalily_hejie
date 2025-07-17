import { Bot } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-partselect-blue rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-border-light">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-delayed-1"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-delayed-2"></div>
        </div>
      </div>
    </div>
  );
}
