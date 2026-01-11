import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { useUser } from '@/types/UserContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';

const Wishlist = () => {
    const { user, toggleWishlist } = useUser();
    const { addItem } = useCart();

    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container mx-auto px-4 py-24 text-center">
                    <Heart className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
                    <h1 className="text-3xl font-bold mb-4">Your Wishlist</h1>
                    <p className="text-muted-foreground mb-8">Please sign in to view your saved items.</p>
                    <Link to="/login">
                        <Button size="lg">Sign In</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-3xl font-bold mb-8">My Wishlist ({user.wishlist.length})</h1>

                {user.wishlist.length === 0 ? (
                    <div className="text-center py-12 bg-muted/30 rounded-lg">
                        <p className="text-lg text-muted-foreground mb-6">You haven't saved any items yet.</p>
                        <Link to="/products">
                            <Button>Browse Products</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {user.wishlist.map((product) => (
                            <Card key={product.id} className="group relative">
                                <CardHeader className="p-0">
                                    <div className="aspect-square relative overflow-hidden rounded-t-lg">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => toggleWishlist(product)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        {product.badge && (
                                            <Badge className="absolute top-2 left-2">{product.badge}</Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <Link to={`/product/${product.id}`} className="hover:underline">
                                        <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                                    </Link>
                                    <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
                                    <div className="mt-2 font-bold text-lg">${product.price}</div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <Button
                                        className="w-full"
                                        onClick={() => addItem({
                                            id: product.id,
                                            name: product.name,
                                            price: product.price,
                                            originalPrice: product.originalPrice,
                                            image: product.image,
                                            category: product.category
                                        })}
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

export default Wishlist;
