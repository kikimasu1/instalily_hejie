import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useSystemAnalytics, useInsightsSummary, useConversationAnalytics } from "@/hooks/useAnalytics";
import { 
  TrendingUp, 
  MessageSquare, 
  Clock, 
  Users, 
  Target, 
  Smartphone, 
  Monitor, 
  Tablet,
  BarChart3,
  PieChart,
  Activity,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";

interface AnalyticsDashboardProps {
  sessionId?: string;
}

export default function AnalyticsDashboard({ sessionId }: AnalyticsDashboardProps) {
  const [selectedTab, setSelectedTab] = useState("overview");
  
  const { data: systemAnalytics, isLoading: systemLoading } = useSystemAnalytics();
  const { data: insights, isLoading: insightsLoading } = useInsightsSummary();
  const { data: conversationData, isLoading: conversationLoading } = useConversationAnalytics(sessionId || "");

  if (systemLoading || insightsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-background-gradient min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-partselect-blue hover:bg-blue-50 transition-smooth"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chat
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-dark">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Conversation insights and system performance</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-partselect-blue text-white">
          Live Data
        </Badge>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="conversation" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Conversation</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Insights</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemAnalytics?.totalSessions || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Today's conversations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemAnalytics?.totalMessages || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Messages exchanged today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemAnalytics?.averageResponseTime || 0}ms</div>
                <p className="text-xs text-muted-foreground">
                  AI response speed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemAnalytics?.userSatisfactionAverage?.toFixed(1) || 'N/A'}</div>
                <p className="text-xs text-muted-foreground">
                  Average rating
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top User Intents</CardTitle>
              <CardDescription>Most common types of user queries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemAnalytics?.topIntents?.map((intent, index) => (
                  <div key={intent.intent} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                        {index + 1}
                      </Badge>
                      <span className="capitalize font-medium">{intent.intent.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{intent.count}</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-partselect-blue rounded-full" 
                          style={{ width: `${(intent.count / (systemAnalytics?.topIntents?.[0]?.count || 1)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )) || (
                  <p className="text-sm text-muted-foreground">No intent data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversation" className="space-y-6">
          {conversationData?.conversation ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conversation Overview</CardTitle>
                  <CardDescription>Current session metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Messages</span>
                    <Badge variant="secondary">{conversationData.conversation.totalMessages}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">User Messages</span>
                    <Badge variant="outline">{conversationData.conversation.userMessages}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">AI Responses</span>
                    <Badge variant="outline">{conversationData.conversation.aiMessages}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Duration</span>
                    <span className="text-sm">{conversationData.conversation.conversationDuration} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Product Recommendations</span>
                    <Badge className="bg-green-100 text-green-800">{conversationData.conversation.productRecommendations}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Intent Categories</CardTitle>
                  <CardDescription>Types of queries in this conversation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {conversationData.conversation.intentCategories.map((intent) => (
                      <Badge key={intent} variant="outline" className="capitalize">
                        {intent.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Start a conversation to see analytics</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Distribution</CardTitle>
                <CardDescription>User engagement levels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>High Engagement</span>
                        <span>{insights.engagementDistribution.high}</span>
                      </div>
                      <Progress value={(insights.engagementDistribution.high / (insights.engagementDistribution.high + insights.engagementDistribution.medium + insights.engagementDistribution.low)) * 100} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Medium Engagement</span>
                        <span>{insights.engagementDistribution.medium}</span>
                      </div>
                      <Progress value={(insights.engagementDistribution.medium / (insights.engagementDistribution.high + insights.engagementDistribution.medium + insights.engagementDistribution.low)) * 100} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Low Engagement</span>
                        <span>{insights.engagementDistribution.low}</span>
                      </div>
                      <Progress value={(insights.engagementDistribution.low / (insights.engagementDistribution.high + insights.engagementDistribution.medium + insights.engagementDistribution.low)) * 100} className="h-2" />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
                <CardDescription>User device preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        <span className="text-sm">Desktop</span>
                      </div>
                      <Badge variant="secondary">{insights.deviceTypeDistribution.desktop}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        <span className="text-sm">Mobile</span>
                      </div>
                      <Badge variant="secondary">{insights.deviceTypeDistribution.mobile}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tablet className="h-4 w-4" />
                        <span className="text-sm">Tablet</span>
                      </div>
                      <Badge variant="secondary">{insights.deviceTypeDistribution.tablet}</Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
              <CardDescription>Overall system performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-partselect-blue">{insights?.totalSessions || 0}</div>
                  <div className="text-sm text-muted-foreground">Total Sessions</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-partselect-blue">{insights?.averageMessagesPerSession || 0}</div>
                  <div className="text-sm text-muted-foreground">Avg Messages/Session</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-partselect-blue">{systemAnalytics?.averageSessionDuration?.toFixed(1) || 0} min</div>
                  <div className="text-sm text-muted-foreground">Avg Session Duration</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}