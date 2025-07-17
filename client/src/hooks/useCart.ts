import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { CartItem, Product } from "@shared/schema";

interface CartData {
  items: (CartItem & { product: Product })[];
  total: string;
  itemCount: number;
}

export function useCart(sessionId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get cart data
  const { data: cartData, isLoading } = useQuery<CartData>({
    queryKey: ["/api/cart", sessionId],
    enabled: !!sessionId,
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity, sessionId }: { 
      productId: number; 
      quantity: number; 
      sessionId: string; 
    }) => {
      const response = await apiRequest("POST", "/api/cart/add", {
        productId,
        quantity,
        sessionId,
      });
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", variables.sessionId] });
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ 
      sessionId, 
      productId, 
      quantity 
    }: { 
      sessionId: string; 
      productId: number; 
      quantity: number; 
    }) => {
      const response = await apiRequest("PUT", `/api/cart/${sessionId}/${productId}`, {
        quantity,
      });
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", variables.sessionId] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async ({ sessionId, productId }: { sessionId: string; productId: number }) => {
      const response = await apiRequest("DELETE", `/api/cart/${sessionId}/${productId}`);
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", variables.sessionId] });
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await apiRequest("DELETE", `/api/cart/${sessionId}`);
      return response.json();
    },
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    },
  });

  const addToCart = async (productId: number, quantity: number = 1) => {
    if (!sessionId) {
      toast({
        title: "Error",
        description: "Session not available. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    await addToCartMutation.mutateAsync({ productId, quantity, sessionId });
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (!sessionId) return;
    await updateQuantityMutation.mutateAsync({ sessionId, productId, quantity });
  };

  const removeFromCart = async (productId: number) => {
    if (!sessionId) return;
    await removeFromCartMutation.mutateAsync({ sessionId, productId });
  };

  const clearCart = async () => {
    if (!sessionId) return;
    await clearCartMutation.mutateAsync(sessionId);
  };

  return {
    cartData,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isAddingToCart: addToCartMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isRemoving: removeFromCartMutation.isPending,
  };
}
