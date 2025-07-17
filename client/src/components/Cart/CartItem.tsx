import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import type { CartItem as CartItemType, Product } from "@shared/schema";

interface CartItemProps {
  item: CartItemType & { product: Product };
  sessionId: string;
}

export default function CartItem({ item, sessionId }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart(sessionId);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(item.productId);
    } else {
      await updateQuantity(item.productId, newQuantity);
    }
  };

  const itemTotal = (parseFloat(item.product.price) * item.quantity).toFixed(2);

  return (
    <div className="p-3 border border-border-light rounded-lg bg-gray-50">
      <div className="flex items-start space-x-3">
        <img
          src={item.product.imageUrl}
          alt={item.product.name}
          className="w-12 h-12 rounded object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-dark truncate">
            {item.product.name}
          </p>
          <p className="text-xs text-gray-600">Part #{item.product.partNumber}</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-semibold text-partselect-blue">
              ${itemTotal}
            </span>
            <div className="flex items-center space-x-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                className="w-6 h-6 rounded-full"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-xs font-medium">{item.quantity}</span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleQuantityChange(item.quantity + 1)}
                className="w-6 h-6 rounded-full bg-partselect-blue text-white border-partselect-blue hover:bg-partselect-dark"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
