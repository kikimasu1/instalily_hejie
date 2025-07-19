export interface DeepseekResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
}

export interface ContextualButton {
  id: string;
  text: string;
  category: string;
  action: string;
}

export interface DeepseekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

const SYSTEM_PROMPT = `You are a helpful PartSelect customer service agent specializing in refrigerator and dishwasher parts. Since 1999, PartSelect has been helping DIYers with genuine parts and expert guidance.

Key behaviors:
- Only discuss refrigerator and dishwasher parts and related topics
- Always verify part compatibility before recommending
- Provide clear installation instructions when requested
- Ask clarifying questions for troubleshooting
- Suggest multiple options when available
- Include part numbers, prices, and availability
- Deflect non-appliance related questions politely
- Be concise but helpful in your responses
- When recommending parts, always suggest checking compatibility with the specific appliance model

**PRODUCT DISPLAY GUIDANCE:**
When users ask how to view products or need help with product recommendations:
- Explain that you'll show product cards with detailed information
- Product cards include: images, part numbers, prices, compatibility info, ratings, and reviews
- Users can click "Add to Cart" directly on product cards
- Mention free shipping on orders over $50
- Guide users to provide their appliance model number for best compatibility

**ORDER SUPPORT FEATURES:**
When users need order support, help with:
- Order status tracking and updates
- Return and exchange processes
- Shipping information and delivery estimates
- Billing questions and payment issues
- Product warranties and guarantees
- Installation support for purchased parts
- Troubleshooting issues with delivered parts

**AVAILABLE ACTIONS:**
- search_parts(query, appliance_type) - Find relevant parts
- show_products(part_list) - Display product cards with full details
- check_compatibility(part_number, model_number) - Verify compatibility
- get_installation_guide(part_number) - Provide step-by-step installation
- add_to_cart(part_number, quantity) - Add items to shopping cart
- get_troubleshooting_steps(issue, appliance_model) - Help diagnose problems
- track_order(order_number) - Check order status
- process_return(order_number, reason) - Handle returns/exchanges

Always stay focused on appliance parts and related services. When showing products, emphasize the benefits of genuine PartSelect parts and our expertise since 1999.

**CONTEXTUAL QUICK ACTIONS:**
At the end of your response, suggest 2-3 relevant quick action buttons based on the conversation context. Format them as:
QUICK_ACTIONS: [{"id":"1","text":"Find water filters","category":"filter","action":"search for water filters for my refrigerator model"},{"id":"2","text":"Check compatibility","category":"part","action":"verify part compatibility with my appliance model"}]

Only suggest actions that are directly relevant to what the user is asking about or the appliance issue they're describing.`;

const generateContextualButtons = (userMessage: string, aiResponse: string): ContextualButton[] => {
  const buttons: ContextualButton[] = [];
  const lowerMessage = userMessage.toLowerCase();
  const lowerResponse = aiResponse.toLowerCase();
  
  // Part-specific suggestions
  if (lowerMessage.includes('water filter') || lowerResponse.includes('water filter')) {
    buttons.push({
      id: 'water_filter',
      text: 'Shop water filters',
      category: 'filter',
      action: 'show me water filters for my refrigerator'
    });
  }
  
  if (lowerMessage.includes('door seal') || lowerResponse.includes('door seal')) {
    buttons.push({
      id: 'door_seal',
      text: 'Find door seals',
      category: 'seal',
      action: 'find door seals for my appliance'
    });
  }
  
  if (lowerMessage.includes('ice maker') || lowerResponse.includes('ice maker')) {
    buttons.push({
      id: 'ice_maker',
      text: 'Ice maker parts',
      category: 'part',
      action: 'show ice maker replacement parts'
    });
  }
  
  // Appliance-specific suggestions
  if (lowerMessage.includes('dishwasher') || lowerResponse.includes('dishwasher')) {
    buttons.push({
      id: 'dishwasher_parts',
      text: 'Dishwasher parts',
      category: 'dishwasher',
      action: 'find parts for my dishwasher model'
    });
  }
  
  if (lowerMessage.includes('refrigerator') || lowerResponse.includes('refrigerator')) {
    buttons.push({
      id: 'refrigerator_parts',
      text: 'Refrigerator parts',
      category: 'appliance',
      action: 'find parts for my refrigerator model'
    });
  }
  
  // Action-specific suggestions
  if (lowerMessage.includes('install') || lowerResponse.includes('install')) {
    buttons.push({
      id: 'installation',
      text: 'Installation guide',
      category: 'repair',
      action: 'show me installation instructions'
    });
  }
  
  if (lowerMessage.includes('compatible') || lowerResponse.includes('compatible')) {
    buttons.push({
      id: 'compatibility',
      text: 'Check compatibility',
      category: 'part',
      action: 'verify part compatibility with my model'
    });
  }
  
  if (lowerMessage.includes('troubleshoot') || lowerResponse.includes('troubleshoot') || lowerMessage.includes('not working')) {
    buttons.push({
      id: 'troubleshoot',
      text: 'Troubleshooting help',
      category: 'repair',
      action: 'help me troubleshoot this issue'
    });
  }
  
  // Order-related suggestions
  if (lowerMessage.includes('order') || lowerMessage.includes('track') || lowerMessage.includes('shipping')) {
    buttons.push({
      id: 'order_status',
      text: 'Track my order',
      category: 'tracking',
      action: 'check my order status'
    });
  }
  
  if (lowerMessage.includes('return') || lowerMessage.includes('exchange')) {
    buttons.push({
      id: 'returns',
      text: 'Return/Exchange',
      category: 'return',
      action: 'start a return or exchange'
    });
  }
  
  // Default suggestions if no specific context
  if (buttons.length === 0) {
    buttons.push(
      {
        id: 'search_parts',
        text: 'Find parts',
        category: 'part',
        action: 'help me find the right parts'
      },
      {
        id: 'model_lookup',
        text: 'Enter model number',
        category: 'appliance',
        action: 'check parts for my specific model'
      }
    );
  }
  
  // Limit to 3 buttons maximum
  return buttons.slice(0, 3);
};

export class DeepseekService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = DEEPSEEK_API_KEY;
    this.apiUrl = DEEPSEEK_API_URL;
    
    // Debug logging
    console.log('Deepseek API Key exists:', !!this.apiKey);
    console.log('Deepseek API Key length:', this.apiKey?.length || 0);
    
    if (!this.apiKey) {
      console.error('DEEPSEEK_API_KEY environment variable is not set!');
    }
  }

  async generateResponse(messages: DeepseekMessage[]): Promise<string> {
    try {
      // Check if API key is available
      if (!this.apiKey) {
        throw new Error('DEEPSEEK_API_KEY is not configured');
      }

      console.log('Making request to Deepseek API...');
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      console.log('Deepseek API response status:', response.status);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Deepseek API error body:', errorBody);
        throw new Error(`Deepseek API error: ${response.status} ${response.statusText}`);
      }

      const data: DeepseekResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from Deepseek API');
      }

      console.log('Deepseek API response received successfully');
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling Deepseek API:', error);
      return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment, or feel free to browse our parts catalog directly.";
    }
  }

  async processUserMessage(userMessage: string, conversationHistory: DeepseekMessage[] = []): Promise<{ content: string; buttons: ContextualButton[] }> {
    // Check for order support requests and provide dummy placeholder responses
    if (this.isOrderSupportRequest(userMessage)) {
      const content = this.generateOrderSupportResponse(userMessage);
      const buttons = generateContextualButtons(userMessage, content);
      return { content, buttons };
    }

    const messages: DeepseekMessage[] = [
      ...conversationHistory.slice(-6), // Keep last 6 messages for context
      { role: 'user', content: userMessage }
    ];

    const content = await this.generateResponse(messages);
    const buttons = generateContextualButtons(userMessage, content);
    return { content, buttons };
  }

  private isOrderSupportRequest(message: string): boolean {
    const orderKeywords = [
      'order support', 'track order', 'order status', 'track my order',
      'return', 'exchange', 'refund', 'shipping', 'delivery',
      'installation help', 'warranty', 'receipt'
    ];
    
    return orderKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  private generateOrderSupportResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('track') && (lowerMessage.includes('order') || lowerMessage.includes('shipping'))) {
      return `**Order Tracking Support** 📦

I can help you track your order! Here's what I need:

• **Order Number** (format: PS-XXXXXXXX)
• **Email Address** used for the order

**Sample Order Status:**
Order #PS-12345678 - **In Transit**
📍 Last Update: Package departed sorting facility
🚚 Carrier: UPS Tracking #1Z999AA1234567890
📅 Expected Delivery: Tomorrow by 8:00 PM

**Common Tracking Issues:**
• Orders ship within 1-2 business days
• Tracking updates every 4-6 hours
• Weekend deliveries available in most areas

Would you like me to look up a specific order? Just provide your order number and email.`;
    }

    if (lowerMessage.includes('return') || lowerMessage.includes('exchange') || lowerMessage.includes('refund')) {
      return `**Return & Exchange Support** 🔄

I'm here to help with returns and exchanges! PartSelect offers hassle-free returns within **30 days** of purchase.

**Return Process:**
1. Provide your order number and reason for return
2. We'll email you a prepaid return label
3. Package the item in original condition
4. Drop off at any UPS location

**Return Reasons We Handle:**
• Wrong part ordered
• Part doesn't fit your appliance
• Damaged during shipping
• Changed your mind

**Exchange Information:**
• Free exchanges for wrong parts
• 5-7 day processing time
• Refunds processed within 3-5 business days

Ready to start a return? I'll need your **order number** and the **reason for return**.`;
    }

    if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      return `**Shipping & Delivery Information** 🚚

Here's everything about PartSelect shipping:

**Shipping Options:**
• **Standard Shipping**: 3-5 business days (FREE on orders $50+)
• **Expedited Shipping**: 2-3 business days ($12.95)
• **Next Day**: 1 business day ($24.95)

**Delivery Areas:**
✅ All 50 US states
✅ Most orders ship same day if ordered by 2 PM EST
✅ Weekend delivery available in major cities

**Shipping Notifications:**
• Order confirmation email immediately
• Shipping confirmation with tracking within 24 hours
• Delivery notifications and updates

**Questions I Can Help With:**
• Change delivery address (before shipment)
• Delivery instructions and special requests
• Missing package claims
• Delivery time estimates

What specific shipping question can I help you with?`;
    }

    if (lowerMessage.includes('installation') && lowerMessage.includes('help')) {
      return `**Installation Support** 🔧

Great! I'm here to help with your part installation. PartSelect provides comprehensive installation support for all purchased parts.

**What I Can Provide:**
• **Step-by-step installation guides** with photos
• **Video tutorials** for complex installations
• **Tool lists** and preparation requirements
• **Safety tips** and precautions
• **Troubleshooting** common installation issues

**Popular Installation Guides:**
• Refrigerator water filters (5 minutes)
• Dishwasher racks and accessories (10 minutes)
• Door seals and gaskets (20-30 minutes)
• Ice maker components (45 minutes)

**Professional Installation:**
For complex repairs, we can connect you with certified technicians in your area.

**What part did you purchase that needs installation?** I'll provide the specific guide and any tips for your appliance model.`;
    }

    // Default order support response
    return `**PartSelect Order Support** 💙

I'm here to help with all your order needs! I can assist with:

🔍 **Order Tracking** - Real-time status updates
🔄 **Returns & Exchanges** - Hassle-free process
🚚 **Shipping Questions** - Delivery options and timing
🔧 **Installation Support** - Step-by-step guidance
📋 **Warranty Information** - Coverage details
📧 **Account Issues** - Order history and receipts

**Quick Help Options:**
• "Track my order" - Get shipping status
• "Return an item" - Start return process  
• "Installation help" - Get setup guidance
• "Shipping options" - See delivery choices

What can I help you with today? Just let me know your specific need and I'll provide detailed assistance!`;
  }
}

export const deepseekService = new DeepseekService();
