export interface DeepseekResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
}

export interface DeepseekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

const SYSTEM_PROMPT = `You are a helpful PartSelect customer service agent specializing in refrigerator and dishwasher parts. 

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

Available actions you can suggest:
- search_parts(query, appliance_type)
- check_compatibility(part_number, model_number)
- get_installation_guide(part_number)
- add_to_cart(part_number, quantity)
- get_troubleshooting_steps(issue, appliance_model)

Always stay focused on appliance parts and related services. If asked about topics outside of refrigerator and dishwasher parts, politely redirect the conversation back to how you can help with their appliance needs.`;

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

  async processUserMessage(userMessage: string, conversationHistory: DeepseekMessage[] = []): Promise<string> {
    const messages: DeepseekMessage[] = [
      ...conversationHistory.slice(-6), // Keep last 6 messages for context
      { role: 'user', content: userMessage }
    ];

    return await this.generateResponse(messages);
  }
}

export const deepseekService = new DeepseekService();
