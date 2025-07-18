import { useQuery } from "@tanstack/react-query";

export interface SystemAnalytics {
  date: string;
  totalSessions: number;
  totalMessages: number;
  averageSessionDuration: number;
  averageResponseTime: number;
  topIntents: { intent: string; count: number }[];
  errorRate: number;
  userSatisfactionAverage: number;
}

export interface ConversationAnalytics {
  sessionId: string;
  totalMessages: number;
  userMessages: number;
  aiMessages: number;
  conversationDuration: number;
  intentCategories: string[];
  resolvedQueries: number;
  productRecommendations: number;
  cartInteractions: number;
  timestamp: Date;
  userSatisfaction?: number;
}

export interface MessageAnalytics {
  sessionId: string;
  messageId: string;
  type: 'user' | 'ai';
  intent: string;
  responseTime?: number;
  containsProductCards: boolean;
  messageLength: number;
  timestamp: Date;
}

export interface InsightsSummary {
  totalSessions: number;
  averageMessagesPerSession: number;
  mostCommonIntents: string[];
  engagementDistribution: { high: number; medium: number; low: number };
  deviceTypeDistribution: { mobile: number; desktop: number; tablet: number };
}

export function useSystemAnalytics() {
  return useQuery<SystemAnalytics>({
    queryKey: ['/api/analytics/system'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useConversationAnalytics(sessionId: string) {
  return useQuery<{
    conversation: ConversationAnalytics | null;
    messages: MessageAnalytics[];
  }>({
    queryKey: ['/api/analytics/conversation', sessionId],
    enabled: !!sessionId,
  });
}

export function useInsightsSummary() {
  return useQuery<InsightsSummary>({
    queryKey: ['/api/analytics/insights'],
    refetchInterval: 60000, // Refetch every minute
  });
}

export function useBehaviorInsights(sessionId?: string) {
  return useQuery({
    queryKey: ['/api/analytics/behavior', sessionId],
    refetchInterval: 30000,
  });
}