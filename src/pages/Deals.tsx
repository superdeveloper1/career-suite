import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/types/UserContext';
import { useToast } from '@/hooks/use-toast';

const Deals = () => {
    const { addItem } = useCart();
    const { user, toggleWishlist, isInWishlist } = useUser();
    const { toast } = useToast();
    const [deals, setDeals] = useState<any[]>([]);

    useEffect(() => {
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) {
            try {
                const allProducts = JSON.parse(savedProducts);
                // Filter for products that have a sale badge OR have an original price (indicating discount)
                const saleProducts = allProducts.filter((p: any) =>
                    p.badge === 'Sale' || (p.originalPrice && p.originalPrice > p.price)
                );
                setDeals(saleProducts);
            } catch (e) {
                console.error("Error loading products", e);
            }
        }
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Header />
            {/* Hero Banner for Deals */}
            <div className="bg-red-600 text-white py-12 mb-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Flash Sales</h1>
                    <p className="text-xl opacity-90">Up to 70% off on selected items. Limited time only!</p>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-16">
                {deals.length === 0 ? (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold mb-4">No deals active right now</h2>
                        <p className="mb-8">Check back later for amazing discounts!</p>
                        <Link to="/products">
                            <Button>Browse All Products</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {deals.map((product) => (
                            <Card key={product.id} className="group cursor-pointer transition-smooth hover:shadow-card hover:-translate-y-1">
                                <CardHeader className="p-0">
                                    <Link to={`/product/${product.id}`}>
                                        <div className="relative overflow-hidden rounded-t-lg">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
                                            />
                                            <Badge className="absolute top-3 left-3 z-10" variant="destructive">
                                                {product.badge || 'Sale'}
                                            </Badge>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleWishlist(product);
                                                }}
                                                className="absolute top-3 right-3 bg-white/80 hover:bg-white z-10"
                                            >
                                                <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current text-red-500' : ''}`} />
                                            </Button>
                                        </div>
                                    </Link>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <Badge variant="secondary" className="mb-2">
                                        {product.category}
                                    </Badge>
                                    <Link to={`/product/${product.id}`}>
                                        <CardTitle className="text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">{product.name}</CardTitle>
                                    </Link>
                                    <div className="flex items-center mb-2">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-muted-foreground ml-2">({product.reviews})</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-lg font-bold text-red-600">${product.price}</span>
                                            {product.originalPrice && (
                                                <span className="text-sm text-muted-foreground line-through ml-2">
                                                    ${product.originalPrice}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <Button
                                        className="w-full"
                                        onClick={() => {
                                            addItem(product);
                                            toast({ title: "Added to cart", description: `${product.name} added.` });
                                        }}
                                    >
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        Add to Cart
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Deals;
