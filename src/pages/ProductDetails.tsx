import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, ArrowLeft, Heart, Share2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import type { Product } from '../types';
import { useUser } from '@/types/UserContext';
import Header from '@/components/Header';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useToast } from '@/hooks/use-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const { toast } = useToast();
  const { user, toggleWishlist, isInWishlist } = useUser();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    let foundProduct = null;

    if (savedProducts) {
      const products: Product[] = JSON.parse(savedProducts);
      foundProduct = products.find((p: Product) => p.id === Number(id));
    }

    if (!foundProduct) {
      // Fallback defaults if not in local storage
      const defaultProducts = [
        {
          id: 1,
          name: 'Premium Wireless Headphones',
          price: 299.99,
          originalPrice: 399.99,
          image: 'https://images.unsplash.com/photo-1560718217-69193acc0713?w=400&auto=format&fit=crop&q=80',
          rating: 4.8,
          reviews: 124,
          category: 'Electronics',
          badge: 'Best Seller',
          description: 'High-quality wireless headphones with noise cancellation and premium sound quality.'
        },
        {
          id: 2,
          name: 'Modern Laptop Stand',
          price: 89.99,
          originalPrice: 129.99,
          image: 'https://images.unsplash.com/photo-1621570273800-1b50b0173a97?w=400&auto=format&fit=crop&q=80',
          rating: 4.6,
          reviews: 89,
          category: 'Electronics',
          badge: 'Sale',
          description: 'Ergonomic laptop stand for better posture and productivity.'
        },
        {
          id: 3,
          name: 'Stylish Fashion Top',
          price: 49.99,
          originalPrice: 79.99,
          image: 'https://images.unsplash.com/photo-1601831000466-bad7b107a1bf?w=400&auto=format&fit=crop&q=80',
          rating: 4.7,
          reviews: 156,
          category: 'Fashion',
          badge: 'New',
          description: 'Trendy and comfortable fashion top perfect for any occasion.'
        },
        {
          id: 4,
          name: 'Comfortable Lounge Chair',
          price: 599.99,
          originalPrice: 799.99,
          image: 'https://images.unsplash.com/photo-1761914572005-153d4f018290?w=400&auto=format&fit=crop&q=80',
          rating: 4.9,
          reviews: 67,
          category: 'Home & Decor',
          badge: 'Premium',
          description: 'Luxurious lounge chair with premium materials and exceptional comfort.'
        }
      ];
      foundProduct = defaultProducts.find(p => p.id === Number(id));
    }

    setProduct(foundProduct);
    setLoading(false);
  }, [id]);

  const addToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category
      });
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Link to="/products" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            {product.images && product.images.length > 1 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {product.images.map((img: string, index: number) => (
                    <CarouselItem key={index}>
                      <div className="aspect-square relative overflow-hidden rounded-xl border bg-muted">
                        <img
                          src={img}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            ) : (
              <div className="aspect-square relative overflow-hidden rounded-xl border bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button
                    variant={isInWishlist && product && isInWishlist(product.id) ? "default" : "ghost"}
                    size="icon"
                    aria-label={isInWishlist && product && isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                    onClick={() => {
                      if (!user) {
                        toast({
                          title: "Please sign in",
                          description: "You need to be logged in to save items.",
                          variant: "destructive",
                        });
                        return;
                      }
                      if (toggleWishlist && product) toggleWishlist(product);
                    }}
                  >
                    <Heart className={isInWishlist && product && isInWishlist(product.id) ? "h-5 w-5 fill-current text-red-500" : "h-5 w-5"} />
                  </Button>
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium text-foreground">{product.rating}</span>
                  <span className="mx-1">·</span>
                  <span>{product.reviews} reviews</span>
                </div>
                {product.badge && (
                  <Badge variant={product.badge === 'Sale' ? 'destructive' : 'default'}>
                    {product.badge}
                  </Badge>
                )}
                <Badge variant={Number(product.stock || 0) > 0 ? "secondary" : "destructive"}>
                  {Number(product.stock || 0) > 0 ? "Available" : "Out of Stock"}
                </Badge>
              </div>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            <div className="prose max-w-none">
              <p className="text-muted-foreground text-lg leading-relaxed">
                {product.description || 'No description available for this product.'}
              </p>
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <Button size="lg" className="flex-1" onClick={addToCart}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline">
                Buy Now
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                  </div>
                  <div>
                    <p className="font-medium">Free Delivery</p>
                    <p className="text-xs text-muted-foreground">Orders over $100</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
                  </div>
                  <div>
                    <p className="font-medium">2 Year Warranty</p>
                    <p className="text-xs text-muted-foreground">Full protection</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;