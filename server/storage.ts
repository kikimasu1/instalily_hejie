import { 
  users, products, chatMessages, cartItems, compatibilityMatrix, installationGuides,
  type User, type InsertUser, type Product, type InsertProduct, 
  type ChatMessage, type InsertChatMessage, type CartItem, type InsertCartItem,
  type CompatibilityRecord, type InsertCompatibilityRecord,
  type InstallationGuide, type InsertInstallationGuide
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductByPartNumber(partNumber: string): Promise<Product | undefined>;
  searchProducts(query: string, category?: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Chat message methods
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Cart methods
  getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(sessionId: string, productId: number, quantity: number): Promise<void>;
  removeFromCart(sessionId: string, productId: number): Promise<void>;
  clearCart(sessionId: string): Promise<void>;
  
  // Compatibility methods
  checkCompatibility(partNumber: string, applianceModel: string): Promise<CompatibilityRecord | undefined>;
  createCompatibilityRecord(record: InsertCompatibilityRecord): Promise<CompatibilityRecord>;
  
  // Installation guide methods
  getInstallationGuide(partNumber: string): Promise<InstallationGuide | undefined>;
  createInstallationGuide(guide: InsertInstallationGuide): Promise<InstallationGuide>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private chatMessages: Map<string, ChatMessage[]>;
  private cartItems: Map<string, CartItem[]>;
  private compatibilityRecords: Map<string, CompatibilityRecord>;
  private installationGuides: Map<string, InstallationGuide>;
  private currentUserId: number;
  private currentProductId: number;
  private currentMessageId: number;
  private currentCartItemId: number;
  private currentCompatibilityId: number;
  private currentGuideId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.chatMessages = new Map();
    this.cartItems = new Map();
    this.compatibilityRecords = new Map();
    this.installationGuides = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentMessageId = 1;
    this.currentCartItemId = 1;
    this.currentCompatibilityId = 1;
    this.currentGuideId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductByPartNumber(partNumber: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(p => p.partNumber === partNumber);
  }

  async searchProducts(query: string, category?: string): Promise<Product[]> {
    const allProducts = Array.from(this.products.values());
    const searchTerm = query.toLowerCase();
    
    return allProducts.filter(product => {
      const matchesQuery = 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.partNumber.toLowerCase().includes(searchTerm) ||
        product.compatibleModels?.some(model => model.toLowerCase().includes(searchTerm));
      
      const matchesCategory = !category || product.category === category;
      
      return matchesQuery && matchesCategory;
    });
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      id,
      inStock: insertProduct.inStock ?? true,
      rating: insertProduct.rating ?? null,
      reviewCount: insertProduct.reviewCount ?? null,
      compatibleModels: insertProduct.compatibleModels ?? null
    };
    this.products.set(id, product);
    return product;
  }

  // Chat message methods
  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return this.chatMessages.get(sessionId) || [];
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentMessageId++;
    const message: ChatMessage = { 
      ...insertMessage, 
      id, 
      timestamp: new Date(),
      productCards: insertMessage.productCards ?? null
    };
    
    const sessionMessages = this.chatMessages.get(insertMessage.sessionId) || [];
    sessionMessages.push(message);
    this.chatMessages.set(insertMessage.sessionId, sessionMessages);
    
    return message;
  }

  // Cart methods
  async getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]> {
    const items = this.cartItems.get(sessionId) || [];
    const itemsWithProducts = [];
    
    for (const item of items) {
      const product = await this.getProduct(item.productId);
      if (product) {
        itemsWithProducts.push({ ...item, product });
      }
    }
    
    return itemsWithProducts;
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const sessionItems = this.cartItems.get(insertItem.sessionId) || [];
    const existingItem = sessionItems.find(item => item.productId === insertItem.productId);
    
    if (existingItem) {
      existingItem.quantity += insertItem.quantity ?? 1;
      return existingItem;
    }
    
    const id = this.currentCartItemId++;
    const item: CartItem = { 
      ...insertItem, 
      id, 
      addedAt: new Date(),
      quantity: insertItem.quantity ?? 1
    };
    
    sessionItems.push(item);
    this.cartItems.set(insertItem.sessionId, sessionItems);
    
    return item;
  }

  async updateCartItemQuantity(sessionId: string, productId: number, quantity: number): Promise<void> {
    const sessionItems = this.cartItems.get(sessionId) || [];
    const item = sessionItems.find(item => item.productId === productId);
    if (item) {
      item.quantity = quantity;
    }
  }

  async removeFromCart(sessionId: string, productId: number): Promise<void> {
    const sessionItems = this.cartItems.get(sessionId) || [];
    const filteredItems = sessionItems.filter(item => item.productId !== productId);
    this.cartItems.set(sessionId, filteredItems);
  }

  async clearCart(sessionId: string): Promise<void> {
    this.cartItems.set(sessionId, []);
  }

  // Compatibility methods
  async checkCompatibility(partNumber: string, applianceModel: string): Promise<CompatibilityRecord | undefined> {
    const key = `${partNumber}:${applianceModel}`;
    return this.compatibilityRecords.get(key);
  }

  async createCompatibilityRecord(insertRecord: InsertCompatibilityRecord): Promise<CompatibilityRecord> {
    const id = this.currentCompatibilityId++;
    const record: CompatibilityRecord = { ...insertRecord, id };
    const key = `${record.partNumber}:${record.applianceModel}`;
    this.compatibilityRecords.set(key, record);
    return record;
  }

  // Installation guide methods
  async getInstallationGuide(partNumber: string): Promise<InstallationGuide | undefined> {
    return this.installationGuides.get(partNumber);
  }

  async createInstallationGuide(insertGuide: InsertInstallationGuide): Promise<InstallationGuide> {
    const id = this.currentGuideId++;
    const guide: InstallationGuide = { 
      ...insertGuide, 
      id,
      tools: insertGuide.tools ?? null,
      estimatedTime: insertGuide.estimatedTime ?? null,
      difficulty: insertGuide.difficulty ?? null,
      videoUrl: insertGuide.videoUrl ?? null,
      pdfUrl: insertGuide.pdfUrl ?? null
    };
    this.installationGuides.set(guide.partNumber, guide);
    return guide;
  }
}

export const storage = new MemStorage();
