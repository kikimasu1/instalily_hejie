import { storage } from '../storage';
import type { InsertProduct, InsertCompatibilityRecord, InsertInstallationGuide } from '@shared/schema';

const refrigeratorParts: InsertProduct[] = [
  {
    partNumber: "PS11752778",
    name: "Whirlpool Water Filter",
    description: "Genuine OEM water filter for Whirlpool refrigerators. Reduces chlorine taste and odor while providing clean, fresh-tasting water and ice.",
    price: "34.99",
    category: "refrigerator",
    imageUrl: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    inStock: true,
    rating: "4.8",
    reviewCount: 1247,
    compatibleModels: ["WRS325SDHZ", "WRS315SDHZ", "WRF555SDFZ", "WRS571CIHZ"]
  },
  {
    partNumber: "PS11745667",
    name: "Ice Maker Assembly",
    description: "Complete ice maker assembly for Whirlpool and KitchenAid refrigerators. Includes all necessary components for ice production.",
    price: "156.99",
    category: "refrigerator",
    imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    inStock: true,
    rating: "4.6",
    reviewCount: 892,
    compatibleModels: ["WRS325SDHZ", "WRF555SDFZ", "WRS571CIHZ", "KRFF305ESS"]
  },
  {
    partNumber: "PS11749128",
    name: "Refrigerator Door Gasket",
    description: "Replacement door seal gasket for Whirlpool refrigerators. Maintains proper temperature and energy efficiency.",
    price: "89.99",
    category: "refrigerator",
    imageUrl: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    inStock: true,
    rating: "4.5",
    reviewCount: 634,
    compatibleModels: ["WRS325SDHZ", "WRS315SDHZ", "WRF555SDFZ"]
  },
  {
    partNumber: "PS11746358",
    name: "Defrost Timer",
    description: "Electronic defrost timer for automatic defrost cycles in Whirlpool refrigerators.",
    price: "67.50",
    category: "refrigerator",
    imageUrl: "https://images.unsplash.com/photo-1558618644-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    inStock: true,
    rating: "4.7",
    reviewCount: 445,
    compatibleModels: ["WRS325SDHZ", "WRS315SDHZ", "WRS571CIHZ"]
  },
  {
    partNumber: "PS11748992",
    name: "Evaporator Fan Motor",
    description: "Replacement evaporator fan motor for proper air circulation in refrigerator compartments.",
    price: "94.99",
    category: "refrigerator",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    inStock: false,
    rating: "4.4",
    reviewCount: 312,
    compatibleModels: ["WRF555SDFZ", "WRS571CIHZ", "KRFF305ESS"]
  }
];

const dishwasherParts: InsertProduct[] = [
  {
    partNumber: "PS11770274",
    name: "Dishwasher Door Seal",
    description: "Genuine OEM door seal for Whirlpool dishwashers. Prevents water leakage and ensures proper door closure.",
    price: "67.89",
    category: "dishwasher",
    imageUrl: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    inStock: true,
    rating: "4.6",
    reviewCount: 789,
    compatibleModels: ["WDT780SAEM1", "WDF520PADM", "WDT730PAHZ", "WDTA50SAHZ"]
  },
  {
    partNumber: "PS11751843",
    name: "Wash Pump Motor",
    description: "High-performance wash pump motor for Whirlpool dishwashers. Provides powerful water circulation for effective cleaning.",
    price: "189.99",
    category: "dishwasher",
    imageUrl: "https://images.unsplash.com/photo-1558618644-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    inStock: true,
    rating: "4.8",
    reviewCount: 456,
    compatibleModels: ["WDT780SAEM1", "WDT730PAHZ", "WDTA50SAHZ"]
  },
  {
    partNumber: "PS11753621",
    name: "Upper Dish Rack",
    description: "Replacement upper dish rack assembly with adjustable height and fold-down tines.",
    price: "124.99",
    category: "dishwasher",
    imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    inStock: true,
    rating: "4.3",
    reviewCount: 267,
    compatibleModels: ["WDT780SAEM1", "WDF520PADM", "WDT730PAHZ"]
  },
  {
    partNumber: "PS11754789",
    name: "Control Board",
    description: "Electronic control board for dishwasher cycle management and display functions.",
    price: "245.50",
    category: "dishwasher",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    inStock: true,
    rating: "4.5",
    reviewCount: 189,
    compatibleModels: ["WDT780SAEM1", "WDTA50SAHZ"]
  },
  {
    partNumber: "PS11756432",
    name: "Spray Arm Assembly",
    description: "Lower spray arm assembly with multiple wash jets for thorough cleaning coverage.",
    price: "45.99",
    category: "dishwasher",
    imageUrl: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    inStock: true,
    rating: "4.7",
    reviewCount: 523,
    compatibleModels: ["WDT780SAEM1", "WDF520PADM", "WDT730PAHZ", "WDTA50SAHZ"]
  }
];

const compatibilityData: InsertCompatibilityRecord[] = [
  // Water Filter Compatibility
  { partNumber: "PS11752778", applianceModel: "WRS325SDHZ", isCompatible: true },
  { partNumber: "PS11752778", applianceModel: "WRS315SDHZ", isCompatible: true },
  { partNumber: "PS11752778", applianceModel: "WRF555SDFZ", isCompatible: true },
  { partNumber: "PS11752778", applianceModel: "WRS571CIHZ", isCompatible: true },
  { partNumber: "PS11752778", applianceModel: "WDT780SAEM1", isCompatible: false },
  
  // Ice Maker Compatibility
  { partNumber: "PS11745667", applianceModel: "WRS325SDHZ", isCompatible: true },
  { partNumber: "PS11745667", applianceModel: "WRF555SDFZ", isCompatible: true },
  { partNumber: "PS11745667", applianceModel: "WRS571CIHZ", isCompatible: true },
  { partNumber: "PS11745667", applianceModel: "KRFF305ESS", isCompatible: true },
  { partNumber: "PS11745667", applianceModel: "WDT780SAEM1", isCompatible: false },
  
  // Door Seal Compatibility
  { partNumber: "PS11770274", applianceModel: "WDT780SAEM1", isCompatible: true },
  { partNumber: "PS11770274", applianceModel: "WDF520PADM", isCompatible: true },
  { partNumber: "PS11770274", applianceModel: "WDT730PAHZ", isCompatible: true },
  { partNumber: "PS11770274", applianceModel: "WDTA50SAHZ", isCompatible: true },
  { partNumber: "PS11770274", applianceModel: "WRS325SDHZ", isCompatible: false },
];

const installationGuides: InsertInstallationGuide[] = [
  {
    partNumber: "PS11752778",
    title: "Water Filter Installation Guide",
    steps: [
      "Turn off water supply valve behind refrigerator",
      "Locate the filter housing in the upper right corner of the refrigerator compartment",
      "Turn the old filter counterclockwise 1/4 turn and pull out",
      "Remove protective caps from new filter",
      "Insert new filter and turn clockwise 1/4 turn until secure",
      "Turn water supply back on",
      "Run water dispenser for 5 minutes to flush the new filter",
      "Reset the filter indicator light by holding the reset button for 3 seconds"
    ],
    tools: ["None required"],
    estimatedTime: "10 minutes",
    difficulty: "easy",
    videoUrl: "https://www.youtube.com/watch?v=example1",
    pdfUrl: "https://example.com/guides/water-filter-install.pdf"
  },
  {
    partNumber: "PS11745667",
    title: "Ice Maker Assembly Installation",
    steps: [
      "Disconnect power to refrigerator",
      "Remove ice bucket and any ice from freezer",
      "Disconnect water line from old ice maker",
      "Remove mounting screws securing ice maker to freezer wall",
      "Disconnect electrical harness",
      "Install new ice maker in reverse order",
      "Reconnect water line with new compression fitting",
      "Restore power and test operation after 24 hours"
    ],
    tools: ["Phillips screwdriver", "Flat head screwdriver", "Needle-nose pliers"],
    estimatedTime: "45 minutes",
    difficulty: "medium",
    videoUrl: "https://www.youtube.com/watch?v=example2",
    pdfUrl: "https://example.com/guides/ice-maker-install.pdf"
  },
  {
    partNumber: "PS11770274",
    title: "Dishwasher Door Seal Replacement",
    steps: [
      "Disconnect power to dishwasher",
      "Open dishwasher door fully",
      "Remove lower dish rack for access",
      "Carefully peel away old door seal starting from one corner",
      "Clean the door seal channel thoroughly",
      "Starting at the bottom center, press new seal into the channel",
      "Work your way around the door, ensuring seal is properly seated",
      "Test door closure and check for proper seal alignment"
    ],
    tools: ["Flashlight", "Clean cloth", "Mild detergent"],
    estimatedTime: "30 minutes",
    difficulty: "medium",
    videoUrl: "https://www.youtube.com/watch?v=example3",
    pdfUrl: "https://example.com/guides/door-seal-install.pdf"
  }
];

export async function initializeProductData() {
  // Initialize products
  for (const product of [...refrigeratorParts, ...dishwasherParts]) {
    await storage.createProduct(product);
  }
  
  // Initialize compatibility data
  for (const compatibility of compatibilityData) {
    await storage.createCompatibilityRecord(compatibility);
  }
  
  // Initialize installation guides
  for (const guide of installationGuides) {
    await storage.createInstallationGuide(guide);
  }
  
  console.log('Product data initialized successfully');
}
