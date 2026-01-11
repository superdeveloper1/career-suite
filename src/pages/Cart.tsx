import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';

const Cart = () => {
  const { state: cartState, updateQuantity, removeItem, clearCart } = useCart();
  const cartItems = cartState.items;
  const subtotal = cartState.total;
  const savings = cartItems.reduce((sum, item) => {
    const originalTotal = (item.originalPrice || item.price) * item.quantity;
    const currentTotal = item.price * item.quantity;
    return sum + (originalTotal - currentTotal);
  }, 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Continue Shopping Button */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-3">
          <Link to="/products">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Shopping Cart</h1>
                <p className="text-muted-foreground">{cartItems.length} items</p>
              </div>
              {cartItems.length > 0 && (
                <Button variant="outline" onClick={clearCart}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                  <p className="text-muted-foreground mb-6">Add some products to get started!</p>
                  <Link to="/products">
                    <Button>Start Shopping</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="w-full sm:w-24 h-24 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <Badge variant="secondary" className="mb-1">
                                {item.category}
                              </Badge>
                              <h3 className="font-semibold text-lg">{item.name}</h3>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            {/* Price */}
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold">${item.price}</span>
                              {item.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ${item.originalPrice}
                                </span>
                              )}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center border rounded-lg">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="h-8 w-8 rounded-r-none"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="px-3 py-1 min-w-[3rem] text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="h-8 w-8 rounded-l-none"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <span className="font-semibold min-w-[4rem] text-right">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:w-96">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Savings</span>
                      <span>-${savings.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>

                  {shipping === 0 && (
                    <p className="text-sm text-green-600">
                      🎉 You qualify for free shipping!
                    </p>
                  )}

                  {shipping > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Add ${(100 - subtotal).toFixed(2)} more for free shipping
                    </p>
                  )}

                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  {/* Promo Code */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Promo Code</label>
                    <div className="flex gap-2">
                      <Input placeholder="Enter code" />
                      <Button variant="outline">Apply</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Link to="/checkout" className="w-full">
                    <Button className="w-full" size="lg">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Link to="/products" className="w-full">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Security Badge */}
              <Card className="mt-4">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Secure checkout with SSL encryption</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;