import { Bot } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex items-start space-x-2 sm:space-x-4">
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-partselect-blue to-partselect-dark rounded-full flex items-center justify-center flex-shrink-0 shadow-custom-md">
        <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
      </div>
      <div className="bg-white rounded-2xl rounded-tl-sm p-3 sm:p-5 shadow-custom-md border border-border-light">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-partselect-blue rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-partselect-blue rounded-full animate-bounce-delayed-1"></div>
          <div className="w-2 h-2 bg-partselect-blue rounded-full animate-bounce-delayed-2"></div>
        </div>
        <p className="text-xs text-gray-500 mt-2 hidden sm:block">Assistant is typing...</p>
      </div>
    </div>
  );
}
