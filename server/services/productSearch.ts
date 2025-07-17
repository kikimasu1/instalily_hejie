import { storage } from '../storage';
import type { Product } from '@shared/schema';

export interface SearchResult {
  products: Product[];
  totalCount: number;
  suggestions: string[];
}

export interface ProductAction {
  type: 'search_parts' | 'check_compatibility' | 'get_installation_guide' | 'add_to_cart';
  data: any;
}

export class ProductSearchService {
  
  async searchProducts(query: string, category?: string, limit: number = 10): Promise<SearchResult> {
    try {
      const products = await storage.searchProducts(query, category);
      const limitedProducts = products.slice(0, limit);
      
      // Generate search suggestions based on available products
      const suggestions = this.generateSuggestions(query, products);
      
      return {
        products: limitedProducts,
        totalCount: products.length,
        suggestions
      };
    } catch (error) {
      console.error('Error searching products:', error);
      return {
        products: [],
        totalCount: 0,
        suggestions: []
      };
    }
  }

  async checkPartCompatibility(partNumber: string, applianceModel: string): Promise<{
    isCompatible: boolean;
    message: string;
    alternativeParts?: Product[];
  }> {
    try {
      const compatibility = await storage.checkCompatibility(partNumber, applianceModel);
      const product = await storage.getProductByPartNumber(partNumber);
      
      if (!product) {
        return {
          isCompatible: false,
          message: `Part number ${partNumber} not found in our database.`
        };
      }

      if (compatibility) {
        return {
          isCompatible: compatibility.isCompatible,
          message: compatibility.isCompatible 
            ? `✅ Part ${partNumber} (${product.name}) is compatible with ${applianceModel}.`
            : `❌ Part ${partNumber} (${product.name}) is not compatible with ${applianceModel}. Let me find compatible alternatives.`
        };
      }

      // If no specific compatibility record, check if model is in compatible models array
      if (product.compatibleModels?.includes(applianceModel)) {
        return {
          isCompatible: true,
          message: `✅ Part ${partNumber} (${product.name}) is compatible with ${applianceModel}.`
        };
      }

      // Find alternative parts for the same category
      const alternativeParts = await this.findAlternativeParts(product.category, applianceModel);
      
      return {
        isCompatible: false,
        message: `❌ Part ${partNumber} (${product.name}) is not compatible with ${applianceModel}.`,
        alternativeParts
      };
    } catch (error) {
      console.error('Error checking compatibility:', error);
      return {
        isCompatible: false,
        message: 'Unable to check compatibility at this time. Please try again later.'
      };
    }
  }

  async findAlternativeParts(category: string, applianceModel: string): Promise<Product[]> {
    try {
      const allProducts = await storage.getAllProducts();
      return allProducts.filter(product => 
        product.category === category && 
        product.compatibleModels?.includes(applianceModel)
      ).slice(0, 3);
    } catch (error) {
      console.error('Error finding alternative parts:', error);
      return [];
    }
  }

  async getInstallationGuide(partNumber: string) {
    try {
      const guide = await storage.getInstallationGuide(partNumber);
      const product = await storage.getProductByPartNumber(partNumber);
      
      if (!guide && product) {
        return {
          found: false,
          message: `Installation guide for ${product.name} (${partNumber}) is not available yet. Please contact our support team for assistance.`
        };
      }

      return {
        found: !!guide,
        guide,
        product
      };
    } catch (error) {
      console.error('Error getting installation guide:', error);
      return {
        found: false,
        message: 'Unable to retrieve installation guide at this time.'
      };
    }
  }

  private generateSuggestions(query: string, products: Product[]): string[] {
    const suggestions: Set<string> = new Set();
    
    // Add product names and part numbers as suggestions
    products.forEach(product => {
      if (product.name.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(product.name);
      }
      if (product.partNumber.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(product.partNumber);
      }
    });

    // Add common part type suggestions
    const commonParts = [
      'water filter', 'ice maker', 'door seal', 'door gasket', 
      'wash pump', 'spray arm', 'control board', 'defrost timer',
      'evaporator fan', 'dish rack'
    ];

    commonParts.forEach(part => {
      if (part.includes(query.toLowerCase()) || query.toLowerCase().includes(part)) {
        suggestions.add(part);
      }
    });

    return Array.from(suggestions).slice(0, 5);
  }

  async getTroubleshootingSteps(issue: string, applianceModel: string): Promise<{
    steps: string[];
    recommendedParts: Product[];
    severity: 'low' | 'medium' | 'high';
  }> {
    const issueLower = issue.toLowerCase();
    let steps: string[] = [];
    let recommendedParts: Product[] = [];
    let severity: 'low' | 'medium' | 'high' = 'medium';

    // Ice maker issues
    if (issueLower.includes('ice maker') || issueLower.includes('ice')) {
      steps = [
        "Check if the ice maker is turned on",
        "Verify water supply is connected and turned on",
        "Check for any ice blockages in the ice chute",
        "Ensure the freezer temperature is below 10°F (-12°C)",
        "Wait 24 hours for ice production to begin after installation"
      ];
      
      const icemaker = await storage.getProductByPartNumber("PS11745667");
      const waterFilter = await storage.getProductByPartNumber("PS11752778");
      if (icemaker) recommendedParts.push(icemaker);
      if (waterFilter) recommendedParts.push(waterFilter);
      severity = 'medium';
    }
    
    // Water filter issues
    else if (issueLower.includes('water') && (issueLower.includes('taste') || issueLower.includes('filter'))) {
      steps = [
        "Check when the water filter was last replaced (should be every 6 months)",
        "Run water dispenser for 5 minutes to flush the system",
        "Check filter indicator light",
        "Ensure filter is properly installed and seated",
        "Consider replacing filter if it's been over 6 months"
      ];
      
      const waterFilter = await storage.getProductByPartNumber("PS11752778");
      if (waterFilter) recommendedParts.push(waterFilter);
      severity = 'low';
    }
    
    // Door seal issues
    else if (issueLower.includes('door') && (issueLower.includes('seal') || issueLower.includes('leak'))) {
      steps = [
        "Inspect door seal for visible cracks or tears",
        "Clean the door seal with mild soap and water",
        "Check if door is properly aligned and closes securely",
        "Test door seal by placing a dollar bill in the door - it should be held firmly",
        "Replace seal if damaged or not sealing properly"
      ];
      
      const fridgeSeal = await storage.getProductByPartNumber("PS11749128");
      const dishwasherSeal = await storage.getProductByPartNumber("PS11770274");
      if (fridgeSeal) recommendedParts.push(fridgeSeal);
      if (dishwasherSeal) recommendedParts.push(dishwasherSeal);
      severity = 'medium';
    }
    
    // Dishwasher not cleaning
    else if (issueLower.includes('dishwasher') && (issueLower.includes('clean') || issueLower.includes('wash'))) {
      steps = [
        "Check and clean the dishwasher filter at the bottom of the tub",
        "Inspect spray arms for clogs and clean if necessary",
        "Ensure dishes are properly loaded and not blocking spray arms",
        "Use proper amount of quality dishwasher detergent",
        "Run a cleaning cycle with dishwasher cleaner"
      ];
      
      const sprayArm = await storage.getProductByPartNumber("PS11756432");
      const washPump = await storage.getProductByPartNumber("PS11751843");
      if (sprayArm) recommendedParts.push(sprayArm);
      if (washPump) recommendedParts.push(washPump);
      severity = 'medium';
    }
    
    // General troubleshooting
    else {
      steps = [
        "Check that the appliance is properly plugged in and receiving power",
        "Verify all connections are secure",
        "Consult the user manual for specific error codes",
        "Consider contacting a qualified technician if the issue persists"
      ];
      severity = 'high';
    }

    return { steps, recommendedParts, severity };
  }
}

export const productSearchService = new ProductSearchService();
