export interface ConversationAnalytics {
  sessionId: string;
  totalMessages: number;
  userMessages: number;
  aiMessages: number;
  conversationDuration: number; // in minutes
  intentCategories: string[];
  resolvedQueries: number;
  productRecommendations: number;
  cartInteractions: number;
  timestamp: Date;
  userSatisfaction?: number; // 1-5 rating
}

export interface MessageAnalytics {
  sessionId: string;
  messageId: string;
  type: 'user' | 'ai';
  intent: string;
  responseTime?: number; // AI response time in ms
  containsProductCards: boolean;
  messageLength: number;
  timestamp: Date;
}

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

export interface UserBehaviorInsights {
  sessionId: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  browserInfo: string;
  searchPatterns: string[];
  commonQueries: string[];
  engagementLevel: 'high' | 'medium' | 'low';
  bounceRate: boolean; // true if user left without meaningful interaction
}

class AnalyticsService {
  private conversationAnalytics: Map<string, ConversationAnalytics> = new Map();
  private messageAnalytics: MessageAnalytics[] = [];
  private systemMetrics: SystemAnalytics[] = [];
  private userBehavior: Map<string, UserBehaviorInsights> = new Map();

  // Track conversation start
  startConversation(sessionId: string): void {
    if (!this.conversationAnalytics.has(sessionId)) {
      this.conversationAnalytics.set(sessionId, {
        sessionId,
        totalMessages: 0,
        userMessages: 0,
        aiMessages: 0,
        conversationDuration: 0,
        intentCategories: [],
        resolvedQueries: 0,
        productRecommendations: 0,
        cartInteractions: 0,
        timestamp: new Date()
      });
    }
  }

  // Track individual messages
  trackMessage(analytics: Omit<MessageAnalytics, 'timestamp'>): void {
    const messageAnalytics: MessageAnalytics = {
      ...analytics,
      timestamp: new Date()
    };
    
    this.messageAnalytics.push(messageAnalytics);
    
    // Update conversation analytics
    const conversation = this.conversationAnalytics.get(analytics.sessionId);
    if (conversation) {
      conversation.totalMessages++;
      if (analytics.type === 'user') {
        conversation.userMessages++;
      } else {
        conversation.aiMessages++;
        if (analytics.containsProductCards) {
          conversation.productRecommendations++;
        }
      }
      
      // Track intent categories
      if (analytics.intent && !conversation.intentCategories.includes(analytics.intent)) {
        conversation.intentCategories.push(analytics.intent);
      }
    }
  }

  // Classify user intent from message content
  classifyIntent(content: string): string {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('install') || lowerContent.includes('how to')) {
      return 'installation_help';
    } else if (lowerContent.includes('compatible') || lowerContent.includes('fits')) {
      return 'compatibility_check';
    } else if (lowerContent.includes('broken') || lowerContent.includes('not working') || lowerContent.includes('problem')) {
      return 'troubleshooting';
    } else if (lowerContent.includes('find') || lowerContent.includes('need') || lowerContent.includes('looking for')) {
      return 'part_search';
    } else if (lowerContent.includes('price') || lowerContent.includes('cost') || lowerContent.includes('buy')) {
      return 'pricing_inquiry';
    } else if (lowerContent.includes('warranty') || lowerContent.includes('return')) {
      return 'warranty_support';
    } else {
      return 'general_inquiry';
    }
  }

  // Track user behavior patterns
  trackUserBehavior(sessionId: string, behavior: Partial<UserBehaviorInsights>): void {
    const existing = this.userBehavior.get(sessionId) || {
      sessionId,
      deviceType: 'desktop',
      browserInfo: '',
      searchPatterns: [],
      commonQueries: [],
      engagementLevel: 'medium',
      bounceRate: false
    };

    this.userBehavior.set(sessionId, { ...existing, ...behavior });
  }

  // Calculate engagement level based on interaction patterns
  calculateEngagementLevel(sessionId: string): 'high' | 'medium' | 'low' {
    const conversation = this.conversationAnalytics.get(sessionId);
    if (!conversation) return 'low';

    const { totalMessages, conversationDuration, cartInteractions, productRecommendations } = conversation;

    if (totalMessages >= 8 && conversationDuration >= 5 && (cartInteractions > 0 || productRecommendations >= 3)) {
      return 'high';
    } else if (totalMessages >= 4 && conversationDuration >= 2) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  // End conversation and calculate final metrics
  endConversation(sessionId: string): ConversationAnalytics | null {
    const conversation = this.conversationAnalytics.get(sessionId);
    if (!conversation) return null;

    // Calculate conversation duration
    const now = new Date();
    conversation.conversationDuration = Math.round((now.getTime() - conversation.timestamp.getTime()) / (1000 * 60));

    // Update user behavior engagement level
    const engagementLevel = this.calculateEngagementLevel(sessionId);
    this.trackUserBehavior(sessionId, { engagementLevel });

    return conversation;
  }

  // Get conversation insights for a session
  getConversationInsights(sessionId: string): ConversationAnalytics | null {
    return this.conversationAnalytics.get(sessionId) || null;
  }

  // Get message analytics for a session
  getMessageAnalytics(sessionId: string): MessageAnalytics[] {
    return this.messageAnalytics.filter(msg => msg.sessionId === sessionId);
  }

  // Get system-wide analytics
  getSystemAnalytics(): SystemAnalytics {
    const today = new Date().toISOString().split('T')[0];
    const todayMessages = this.messageAnalytics.filter(msg => 
      msg.timestamp.toISOString().split('T')[0] === today
    );

    const sessions = new Set(todayMessages.map(msg => msg.sessionId));
    const aiMessages = todayMessages.filter(msg => msg.type === 'ai' && msg.responseTime);
    const averageResponseTime = aiMessages.length > 0 
      ? aiMessages.reduce((sum, msg) => sum + (msg.responseTime || 0), 0) / aiMessages.length 
      : 0;

    // Calculate top intents
    const intentCounts: { [key: string]: number } = {};
    todayMessages.forEach(msg => {
      if (msg.intent) {
        intentCounts[msg.intent] = (intentCounts[msg.intent] || 0) + 1;
      }
    });

    const topIntents = Object.entries(intentCounts)
      .map(([intent, count]) => ({ intent, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const conversationDurations = Array.from(this.conversationAnalytics.values())
      .filter(conv => conv.timestamp.toISOString().split('T')[0] === today)
      .map(conv => conv.conversationDuration);

    const averageSessionDuration = conversationDurations.length > 0
      ? conversationDurations.reduce((sum, duration) => sum + duration, 0) / conversationDurations.length
      : 0;

    return {
      date: today,
      totalSessions: sessions.size,
      totalMessages: todayMessages.length,
      averageSessionDuration,
      averageResponseTime: Math.round(averageResponseTime),
      topIntents,
      errorRate: 0, // Would track API errors, connection issues, etc.
      userSatisfactionAverage: 4.2 // Would be calculated from user feedback
    };
  }

  // Get user behavior insights
  getUserBehaviorInsights(sessionId?: string): UserBehaviorInsights[] {
    if (sessionId) {
      const behavior = this.userBehavior.get(sessionId);
      return behavior ? [behavior] : [];
    }
    return Array.from(this.userBehavior.values());
  }

  // Generate insights summary
  generateInsightsSummary(): {
    totalSessions: number;
    averageMessagesPerSession: number;
    mostCommonIntents: string[];
    engagementDistribution: { high: number; medium: number; low: number };
    deviceTypeDistribution: { mobile: number; desktop: number; tablet: number };
  } {
    const allConversations = Array.from(this.conversationAnalytics.values());
    const allBehavior = Array.from(this.userBehavior.values());

    const totalMessages = allConversations.reduce((sum, conv) => sum + conv.totalMessages, 0);
    const averageMessagesPerSession = allConversations.length > 0 
      ? Math.round(totalMessages / allConversations.length) 
      : 0;

    // Intent frequency
    const intentCounts: { [key: string]: number } = {};
    allConversations.forEach(conv => {
      conv.intentCategories.forEach(intent => {
        intentCounts[intent] = (intentCounts[intent] || 0) + 1;
      });
    });

    const mostCommonIntents = Object.entries(intentCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([intent]) => intent);

    // Engagement distribution
    const engagementDistribution = allBehavior.reduce(
      (acc, behavior) => {
        acc[behavior.engagementLevel]++;
        return acc;
      },
      { high: 0, medium: 0, low: 0 }
    );

    // Device type distribution
    const deviceTypeDistribution = allBehavior.reduce(
      (acc, behavior) => {
        acc[behavior.deviceType]++;
        return acc;
      },
      { mobile: 0, desktop: 0, tablet: 0 }
    );

    return {
      totalSessions: allConversations.length,
      averageMessagesPerSession,
      mostCommonIntents,
      engagementDistribution,
      deviceTypeDistribution
    };
  }
}

export const analyticsService = new AnalyticsService();