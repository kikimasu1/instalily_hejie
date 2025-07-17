import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { deepseekService } from "./services/deepseek";
import { productSearchService } from "./services/productSearch";
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

          // Generate AI response
          setTimeout(async () => {
            try {
              const history = await storage.getChatMessages(sessionId);
              const conversationHistory: DeepseekMessage[] = history
                .slice(-6)
                .map(msg => ({
                  role: msg.isUser ? 'user' : 'assistant',
                  content: msg.content
                }));

              const aiResponse = await deepseekService.processUserMessage(content, conversationHistory);
              
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
            }
          }, 1000); // Simulate typing delay
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
