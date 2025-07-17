import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Star, Truck } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  productId: string;
}

export default function ProductCard({ productId }: ProductCardProps) {
  const { addToCart } = useCart();

  const { data: productData, isLoading } = useQuery({
    queryKey: ["/api/products", productId],
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <div className="border border-border-light rounded-lg p-4 bg-gray-50 animate-pulse">
        <div className="flex items-start space-x-3">
          <div className="w-16 h-16 bg-gray-200 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!productData?.product) {
    return null;
  }

  const product: Product = productData.product;

  const handleAddToCart = async () => {
    await addToCart(product.id, 1);
  };

  return (
    <div className="border border-border-light rounded-lg p-4 bg-gray-50">
      <div className="flex items-start space-x-3">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-16 h-16 rounded object-cover"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-text-dark">{product.name}</h4>
          <p className="text-sm text-gray-600">Part #{product.partNumber}</p>
          <div className="flex items-center space-x-2 mt-1">
            {product.compatibleModels && product.compatibleModels.length > 0 && (
              <p className="text-xs text-gray-500">
                ✓ Compatible with {product.compatibleModels[0]}
                {product.compatibleModels.length > 1 && ` +${product.compatibleModels.length - 1} more`}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-bold text-partselect-blue">
              ${product.price}
            </span>
            <Button
              onClick={handleAddToCart}
              className="bg-success-green text-white hover:bg-green-600 text-sm px-3 py-1 h-auto"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Truck className="h-3 w-3" />
              <span>Free shipping on orders over $50</span>
            </div>
            {product.rating && (
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{product.rating}/5</span>
                {product.reviewCount && (
                  <span>({product.reviewCount} reviews)</span>
                )}
              </div>
            )}
          </div>
          {!product.inStock && (
            <span className="text-red-600 font-medium">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
}
