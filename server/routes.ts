import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { deepseekService } from "./services/deepseek";
import { productSearchService } from "./services/productSearch";
import { analyticsService } from "./services/analyticsService";
import { initializeProductData } from "./data/products";
import { 
  insertChatMessageSchema, 
  insertCartItemSchema,
  type DeepseekMessage 
} from "@shared/schema";

interface WebSocketWithSession extends WebSocket {
  sessionId?: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize product data
  await initializeProductData();

  // Chat endpoints
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId } = req.body;
      
      if (!message || !sessionId) {
        return res.status(400).json({ error: "Message and sessionId required" });
      }

      // Save user message
      await storage.createChatMessage({
        sessionId,
        content: message,
        isUser: true,
        productCards: []
      });

      // Get conversation history for context
      const history = await storage.getChatMessages(sessionId);
      const conversationHistory: DeepseekMessage[] = history
        .slice(-6) // Last 6 messages
        .map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content
        }));

      // Generate AI response
      const aiResponse = await deepseekService.processUserMessage(message, conversationHistory);
      
      // Save AI response
      const savedResponse = await storage.createChatMessage({
        sessionId,
        content: aiResponse,
        isUser: false,
        productCards: []
      });

      res.json({ 
        message: savedResponse,
        sessionId 
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/chat/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getChatMessages(sessionId);
      res.json({ messages });
    } catch (error) {
      console.error("Get chat error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Product endpoints
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json({ products });
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/products/search", async (req, res) => {
    try {
      const { q: query, category, limit = 10 } = req.query;
      
      if (!query) {
        return res.status(400).json({ error: "Query parameter required" });
      }

      const result = await productSearchService.searchProducts(
        query as string, 
        category as string,
        parseInt(limit as string)
      );
      
      res.json(result);
    } catch (error) {
      console.error("Search products error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json({ product });
    } catch (error) {
      console.error("Get product error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/products/:partNumber/compatibility", async (req, res) => {
    try {
      const { partNumber } = req.params;
      const { model } = req.query;
      
      if (!model) {
        return res.status(400).json({ error: "Model parameter required" });
      }

      const result = await productSearchService.checkPartCompatibility(
        partNumber, 
        model as string
      );
      
      res.json(result);
    } catch (error) {
      console.error("Check compatibility error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/installation-guide/:partNumber", async (req, res) => {
    try {
      const { partNumber } = req.params;
      const result = await productSearchService.getInstallationGuide(partNumber);
      res.json(result);
    } catch (error) {
      console.error("Get installation guide error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/troubleshoot", async (req, res) => {
    try {
      const { issue, applianceModel } = req.body;
      
      if (!issue) {
        return res.status(400).json({ error: "Issue description required" });
      }

      const result = await productSearchService.getTroubleshootingSteps(
        issue, 
        applianceModel || "unknown"
      );
      
      res.json(result);
    } catch (error) {
      console.error("Troubleshoot error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Order support endpoints
  app.post("/api/orders/track", async (req, res) => {
    try {
      const { orderNumber, email } = req.body;
      
      if (!orderNumber) {
        return res.status(400).json({ error: "Order number required" });
      }

      // Mock order tracking data - replace with real API integration
      const orderStatus = {
        orderNumber,
        status: "Processing",
        estimatedDelivery: "3-5 business days",
        items: [
          { name: "Refrigerator Water Filter", partNumber: "DA29-00020B", quantity: 1 },
        ],
        tracking: {
          carrier: "UPS",
          trackingNumber: "1Z999AA1234567890",
          lastUpdate: "Order processed and ready for shipment"
        }
      };

      res.json({ order: orderStatus });
    } catch (error) {
      console.error("Order tracking error:", error);
      res.status(500).json({ error: "Failed to track order" });
    }
  });

  app.post("/api/orders/return", async (req, res) => {
    try {
      const { orderNumber, reason, email } = req.body;
      
      if (!orderNumber || !reason) {
        return res.status(400).json({ error: "Order number and reason required" });
      }

      // Mock return process - replace with real API integration
      const returnRequest = {
        returnId: `RTN-${Date.now()}`,
        orderNumber,
        status: "Return initiated",
        instructions: "A prepaid return label will be emailed to you within 24 hours.",
        estimatedRefund: "5-7 business days after we receive the item"
      };

      res.json({ return: returnRequest });
    } catch (error) {
      console.error("Return processing error:", error);
      res.status(500).json({ error: "Failed to process return" });
    }
  });

  // Analytics endpoints
  app.get("/api/analytics/system", async (req, res) => {
    try {
      const systemAnalytics = analyticsService.getSystemAnalytics();
      res.json(systemAnalytics);
    } catch (error) {
      console.error('Error fetching system analytics:', error);
      res.status(500).json({ error: 'Failed to fetch system analytics' });
    }
  });

  app.get("/api/analytics/conversation/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const conversationInsights = analyticsService.getConversationInsights(sessionId);
      const messageAnalytics = analyticsService.getMessageAnalytics(sessionId);
      
      res.json({
        conversation: conversationInsights,
        messages: messageAnalytics
      });
    } catch (error) {
      console.error('Error fetching conversation analytics:', error);
      res.status(500).json({ error: 'Failed to fetch conversation analytics' });
    }
  });

  app.get("/api/analytics/insights", async (req, res) => {
    try {
      const insights = analyticsService.generateInsightsSummary();
      res.json(insights);
    } catch (error) {
      console.error('Error generating insights:', error);
      res.status(500).json({ error: 'Failed to generate insights' });
    }
  });

  app.get("/api/analytics/behavior", async (req, res) => {
    try {
      const { sessionId } = req.query;
      const behaviorInsights = analyticsService.getUserBehaviorInsights(sessionId as string);
      res.json(behaviorInsights);
    } catch (error) {
      console.error('Error fetching behavior insights:', error);
      res.status(500).json({ error: 'Failed to fetch behavior insights' });
    }
  });

  // Cart endpoints
  app.get("/api/cart/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const items = await storage.getCartItems(sessionId);
      
      const total = items.reduce((sum, item) => 
        sum + (parseFloat(item.product.price) * item.quantity), 0
      );
      
      res.json({ 
        items, 
        total: total.toFixed(2),
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
      });
    } catch (error) {
      console.error("Get cart error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/cart/add", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      const item = await storage.addToCart(validatedData);
      res.json({ item });
    } catch (error) {
      console.error("Add to cart error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/cart/:sessionId/:productId", async (req, res) => {
    try {
      const { sessionId, productId } = req.params;
      const { quantity } = req.body;
      
      await storage.updateCartItemQuantity(
        sessionId, 
        parseInt(productId), 
        parseInt(quantity)
      );
      
      res.json({ success: true });
    } catch (error) {
      console.error("Update cart error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/cart/:sessionId/:productId", async (req, res) => {
    try {
      const { sessionId, productId } = req.params;
      await storage.removeFromCart(sessionId, parseInt(productId));
      res.json({ success: true });
    } catch (error) {
      console.error("Remove from cart error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/cart/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      await storage.clearCart(sessionId);
      res.json({ success: true });
    } catch (error) {
      console.error("Clear cart error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket setup for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocketWithSession) => {
    console.log('WebSocket client connected');

    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message);
        
        if (data.type === 'join') {
          ws.sessionId = data.sessionId;
          
          // Initialize analytics tracking for this conversation
          analyticsService.startConversation(data.sessionId);
          
          // Track user behavior (detect device type from user agent)
          const userAgent = ws.protocol || '';
          const deviceType = userAgent.includes('Mobile') ? 'mobile' : 
                           userAgent.includes('Tablet') ? 'tablet' : 'desktop';
          
          analyticsService.trackUserBehavior(data.sessionId, {
            deviceType,
            browserInfo: userAgent
          });
          
          ws.send(JSON.stringify({
            type: 'joined',
            sessionId: data.sessionId
          }));
        }
        
        if (data.type === 'typing') {
          // Broadcast typing indicator to other clients in the same session
          wss.clients.forEach((client: WebSocketWithSession) => {
            if (client !== ws && 
                client.sessionId === ws.sessionId && 
                client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'typing',
                isTyping: data.isTyping
              }));
            }
          });
        }

        if (data.type === 'message') {
          // Handle new chat message
          const { content, sessionId } = data;
          
          // Classify user intent and track analytics
          const intent = analyticsService.classifyIntent(content);
          analyticsService.trackMessage({
            sessionId,
            messageId: `user-${Date.now()}`,
            type: 'user',
            intent,
            containsProductCards: false,
            messageLength: content.length
          });
          
          // Save user message
          await storage.createChatMessage({
            sessionId,
            content,
            isUser: true,
            productCards: []
          });

          // Broadcast to all clients in session
          wss.clients.forEach((client: WebSocketWithSession) => {
            if (client.sessionId === sessionId && 
                client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'message',
                message: {
                  content,
                  isUser: true,
                  timestamp: new Date()
                }
              }));
            }
          });

          // Check if user message appears to be a question or request that needs AI response
          const isQuestion = content.includes('?') || 
                           content.toLowerCase().includes('help') ||
                           content.toLowerCase().includes('find') ||
                           content.toLowerCase().includes('what') ||
                           content.toLowerCase().includes('how') ||
                           content.toLowerCase().includes('why') ||
                           content.toLowerCase().includes('where') ||
                           content.toLowerCase().includes('when') ||
                           content.toLowerCase().includes('can you') ||
                           content.toLowerCase().includes('need') ||
                           content.toLowerCase().includes('looking for') ||
                           content.toLowerCase().includes('problem') ||
                           content.toLowerCase().includes('issue') ||
                           content.toLowerCase().includes('broken') ||
                           content.toLowerCase().includes('not working') ||
                           content.toLowerCase().includes('compatible') ||
                           content.toLowerCase().includes('part') ||
                           content.toLowerCase().includes('install') ||
                           content.toLowerCase().includes('repair') ||
                           content.toLowerCase().includes('replace') ||
                           content.length > 10; // Assume longer messages need responses

          // Generate AI response only if it appears to be a question or request
          if (isQuestion) {
            setTimeout(async () => {
              const startTime = Date.now();
              try {
                const history = await storage.getChatMessages(sessionId);
                const conversationHistory: DeepseekMessage[] = history
                  .slice(-6)
                  .map(msg => ({
                    role: msg.isUser ? 'user' : 'assistant',
                    content: msg.content
                  }));

                const aiResponse = await deepseekService.processUserMessage(content, conversationHistory);
                const responseTime = Date.now() - startTime;
                
                // Track AI response analytics
                const containsProductCards = aiResponse.includes('part') || aiResponse.includes('product');
                analyticsService.trackMessage({
                  sessionId,
                  messageId: `ai-${Date.now()}`,
                  type: 'ai',
                  intent: 'response',
                  responseTime,
                  containsProductCards,
                  messageLength: aiResponse.length
                });
                
                await storage.createChatMessage({
                  sessionId,
                  content: aiResponse,
                  isUser: false,
                  productCards: []
                });

                // Broadcast AI response
                wss.clients.forEach((client: WebSocketWithSession) => {
                  if (client.sessionId === sessionId && 
                      client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                      type: 'message',
                      message: {
                        content: aiResponse,
                        isUser: false,
                        timestamp: new Date()
                      }
                    }));
                  }
                });
              } catch (error) {
                console.error('Error generating AI response:', error);
                
                // Track error in analytics
                analyticsService.trackMessage({
                  sessionId,
                  messageId: `ai-error-${Date.now()}`,
                  type: 'ai',
                  intent: 'error',
                  responseTime: Date.now() - startTime,
                  containsProductCards: false,
                  messageLength: 0
                });
              }
            }, 1000); // Simulate typing delay
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  return httpServer;
}
