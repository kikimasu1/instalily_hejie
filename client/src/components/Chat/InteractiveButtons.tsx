import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Refrigerator, 
  UtensilsCrossed, 
  Search, 
  Wrench, 
  Filter,
  Shield,
  Cog,
  ChevronRight,
  Package,
  Truck,
  RotateCcw,
  HelpCircle
} from "lucide-react";

interface InteractiveOption {
  id: string;
  text: string;
  icon?: React.ComponentType<{ className?: string }>;
  category?: string;
  action: string;
}

interface InteractiveButtonsProps {
  options: InteractiveOption[];
  onSelect: (action: string) => void;
  title?: string;
  description?: string;
}

export default function InteractiveButtons({ 
  options, 
  onSelect, 
  title, 
  description 
}: InteractiveButtonsProps) {
  const getIconForCategory = (category?: string) => {
    switch (category) {
      case 'appliance':
        return Refrigerator;
      case 'dishwasher':
        return UtensilsCrossed;
      case 'part':
        return Cog;
      case 'repair':
        return Wrench;
      case 'filter':
        return Filter;
      case 'seal':
        return Shield;
      case 'order':
        return Package;
      case 'tracking':
        return Truck;
      case 'return':
        return RotateCcw;
      case 'support':
        return HelpCircle;
      default:
        return Search;
    }
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      {title && (
        <div className="mb-3">
          <h4 className="font-semibold text-text-dark text-sm mb-1">{title}</h4>
          {description && (
            <p className="text-xs text-gray-600">{description}</p>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((option) => {
          const IconComponent = option.icon || getIconForCategory(option.category);
          
          return (
            <Button
              key={option.id}
              variant="outline"
              size="sm"
              onClick={() => onSelect(option.action)}
              className="justify-start h-auto p-3 bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md group"
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="flex-shrink-0">
                  <IconComponent className="h-4 w-4 text-partselect-blue group-hover:text-partselect-dark transition-colors" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {option.text}
                  </span>
                  {option.category && (
                    <Badge variant="secondary" className="ml-2 text-xs bg-blue-100 text-blue-700">
                      {option.category}
                    </Badge>
                  )}
                </div>
                <ChevronRight className="h-3 w-3 text-gray-400 group-hover:text-partselect-blue transition-colors" />
              </div>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}