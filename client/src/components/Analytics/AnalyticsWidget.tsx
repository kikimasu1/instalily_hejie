import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useConversationAnalytics } from "@/hooks/useAnalytics";
import { BarChart3, MessageSquare, Clock, Target } from "lucide-react";

interface AnalyticsWidgetProps {
  sessionId: string;
  onViewFullAnalytics?: () => void;
}

export default function AnalyticsWidget({ sessionId, onViewFullAnalytics }: AnalyticsWidgetProps) {
  const { data: conversationData, isLoading } = useConversationAnalytics(sessionId);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const conversation = conversationData?.conversation;
  if (!conversation) {
    return null;
  }

  return (
    <Card className="bg-white border-border-light shadow-custom-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-partselect-blue" />
          Session Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-3 w-3 text-gray-500" />
            <span className="text-gray-600">Messages:</span>
            <Badge variant="secondary" className="text-xs px-1 py-0">
              {conversation.totalMessages}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-gray-500" />
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium text-xs">{conversation.conversationDuration}m</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Target className="h-3 w-3 text-gray-500" />
            <span className="text-gray-600">Products:</span>
            <Badge variant="outline" className="text-xs px-1 py-0">
              {conversation.productRecommendations}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Intents:</span>
            <span className="font-medium text-xs">{conversation.intentCategories.length}</span>
          </div>
        </div>

        {conversation.intentCategories.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs text-gray-600">Query Types:</div>
            <div className="flex flex-wrap gap-1">
              {conversation.intentCategories.slice(0, 3).map((intent) => (
                <Badge 
                  key={intent} 
                  variant="outline" 
                  className="text-xs px-1 py-0 capitalize"
                >
                  {intent.replace('_', ' ')}
                </Badge>
              ))}
              {conversation.intentCategories.length > 3 && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  +{conversation.intentCategories.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {onViewFullAnalytics && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs h-7"
            onClick={onViewFullAnalytics}
          >
            View Full Analytics
          </Button>
        )}
      </CardContent>
    </Card>
  );
}