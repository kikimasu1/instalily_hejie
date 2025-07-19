import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import CartItem from "./CartItem";

interface CartSidebarProps {
  sessionId: string;
  onClose?: () => void;
  isMobile?: boolean;
}

export default function CartSidebar({ sessionId, onClose, isMobile = false }: CartSidebarProps) {
  const { cartData, isLoading } = useCart(sessionId);

  const handleCheckout = () => {
    // TODO: Implement checkout functionality
    console.log("Proceed to checkout");
  };

  if (isLoading) {
    return (
      <div className="h-full bg-white border-r border-border-light flex flex-col">
        <div className="p-4 border-b border-border-light">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-dark">Shopping Cart</h2>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-partselect-blue"></div>
        </div>
      </div>
    );
  }

  const { items = [], total = "0.00", itemCount = 0 } = cartData || {};

  return (
    <div className="h-full bg-white border-r border-border-light flex flex-col">
      {/* Cart Header */}
      <div className="p-3 sm:p-4 border-b border-border-light">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold text-text-dark">Shopping Cart</h2>
          <div className="flex items-center space-x-2">
            <span className="bg-partselect-blue text-white text-xs px-2 py-1 rounded-full">
              {itemCount}
            </span>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        {items.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base">Your cart is empty</p>
            <p className="text-xs sm:text-sm text-gray-400">
              Add parts to your cart from the chat to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} sessionId={sessionId} />
            ))}
          </div>
        )}
      </div>

      {/* Cart Footer */}
      {items.length > 0 && (
        <div className="p-4 border-t border-border-light">
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium text-text-dark">Total:</span>
            <span className="text-lg font-bold text-partselect-blue">${total}</span>
          </div>
          <Button
            onClick={handleCheckout}
            className="w-full bg-success-green text-white hover:bg-green-600"
          >
            Checkout
          </Button>
        </div>
      )}
    </div>
  );
}
