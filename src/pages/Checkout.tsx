import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/types/UserContext';
import Header from '@/components/Header';
import { toast } from '@/hooks/use-toast';

const Checkout = () => {
  // Handle guest account creation after order
  const handleCreateAccount = () => {
    if (!shippingInfo.email || !shippingInfo.firstName || !password) {
      toast({
        title: "Missing information",
        description: "Please enter your name, email, and password.",
        variant: "destructive",
      });
      return;
    }
    const name = `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim();
    const success = register(shippingInfo.email, name, password);
    if (success) {
      toast({
        title: "Account created!",
        description: "You can now log in and track your order.",
      });
    } else {
      toast({
        title: "Account already exists",
        description: "An account with this email already exists.",
        variant: "destructive",
      });
    }
  };
  const { state: cartState, clearCart } = useCart();
  const { user, addOrder, register } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  // ... (existing code)


  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    method: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    billingAddress: 'same'
  });

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [password, setPassword] = useState('');

  const cartItems = cartState.items;
  const subtotal = cartState.total;
  const savings = cartItems.reduce((sum, item) => {
    const originalTotal = (item.originalPrice || item.price) * item.quantity;
    const currentTotal = item.price * item.quantity;
    return sum + (originalTotal - currentTotal);
  }, 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const discount = (subtotal * promoDiscount) / 100;
  const total = subtotal + shipping + tax - discount;

  const handleApplyPromo = () => {
    const validCodes = {
      'SAVE10': 10,
      'WELCOME15': 15,
      'FIRST20': 20
    };

    if (validCodes[promoCode.toUpperCase()]) {
      setPromoDiscount(validCodes[promoCode.toUpperCase()]);
      toast({
        title: "Promo code applied!",
        description: `You saved ${validCodes[promoCode.toUpperCase()]}% on your order.`,
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please check your code and try again.",
        variant: "destructive",
      });
    }
  };

  const handlePlaceOrder = async () => {
    // Simulate order processing
    if (user || shippingInfo.email) {
      // Get product info for rating/reviews
      let products: any[] = [];
      try {
        products = JSON.parse(localStorage.getItem('products') || '[]');
      } catch { }

      const newOrderId = `ORD-${Date.now().toString().slice(-6)}`;

      const order = {
        id: newOrderId,
        date: new Date().toISOString(),
        total,
        status: 'Processing',
        items: cartItems.map(item => {
          const prod = products.find((p: any) => p.id === item.id) || {};
          return {
            ...item,
            rating: prod.rating ?? 0,
            reviews: prod.reviews ?? 0,
          };
        }),
      };

      setPlacedOrderId(newOrderId);
      addOrder(order);

      // Save order to local storage for tracking (especially for guests)
      const allOrders = JSON.parse(localStorage.getItem('all_orders') || '[]');
      allOrders.push(order);
      localStorage.setItem('all_orders', JSON.stringify(allOrders));

      // Send real email to user
      try {
        console.log('Attempting to send confirmation email to:', user?.email || shippingInfo.email);
        // Construct detailed email HTML
        const itemsHtml = order.items.map(item => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                  <img src="${item.image}" alt="${item.name}" width="50" height="50" style="border-radius: 4px; object-fit: cover;">
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">x${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.price.toFixed(2)}</td>
              </tr>
            `).join('');

        const emailHtml = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333;">Order Confirmed!</h1>
                <p>Thank you for your order. Here are the details:</p>
                
                <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                  <p><strong>Order ID:</strong> ${order.id}</p>
                  <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> ${order.status}</p>
                </div>

                <h3>Items Ordered</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background: #eee;">
                      <th style="padding: 10px; text-align: left;">Image</th>
                      <th style="padding: 10px; text-align: left;">Product</th>
                      <th style="padding: 10px; text-align: left;">Qty</th>
                      <th style="padding: 10px; text-align: left;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>

                <div style="margin-top: 20px; text-align: right;">
                  <p>Subtotal: $${subtotal.toFixed(2)}</p>
                  <p>Shipping: $${shipping.toFixed(2)}</p>
                  <p>Tax: $${tax.toFixed(2)}</p>
                  <h3 style="color: #2563eb;">Total: $${total.toFixed(2)}</h3>
                </div>

                <div style="margin-top: 30px; border-top: 2px solid #eee; padding-top: 20px;">
                  <h3>Shipping Address</h3>
                  <p>${shippingInfo.firstName} ${shippingInfo.lastName}</p>
                  <p>${shippingInfo.address}</p>
                  <p>${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}</p>
                </div>
                
                <div style="margin-top: 30px; text-align: center;">
                  <a href="http://localhost:8080/#/track-order?id=${order.id}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Track Your Order</a>
                </div>
              </div>
            `;

        const emailText = `Order Confirmed! Order ID: ${order.id}. Total: $${total.toFixed(2)}. Check your email for details.`;

        const emailResponse = await fetch('http://localhost:5001/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: user?.email || shippingInfo.email,
            subject: `Order Confirmation ${order.id}`,
            text: emailText,
            html: emailHtml
          })
        });

        if (!emailResponse.ok) {
          throw new Error(`Email server responded with status: ${emailResponse.status}`);
        }
        console.log('Confirmation email sent successfully.');
      } catch (e) {
        console.error('Failed to send confirmation email:', e);
        toast({
          title: "Email delivery failed",
          description: "Order placed, but we couldn't send the confirmation email.",
          variant: "destructive",
        });
      }
    }
    setOrderPlaced(true);
    clearCart();
    toast({
      title: "Order placed successfully!",
      description: "You will receive a confirmation email shortly.",
    });
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some products to proceed to checkout.</p>
          <Link to="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="p-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
              <p className="text-muted-foreground mb-8">
                Thank you for your purchase. Your order #{placedOrderId} has been confirmed and will be shipped soon.
              </p>

              {!user && (
                <div className="mb-8 p-6 bg-muted rounded-lg max-w-md mx-auto">
                  <h3 className="font-semibold mb-2">Save your information for next time</h3>
                  <p className="text-sm text-muted-foreground mb-4">Create an account to track your order and checkout faster.</p>
                  <div className="space-y-4">
                    <Input
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button onClick={handleCreateAccount} className="w-full">Create Account</Button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products">
                  <Button>Continue Shopping</Button>
                </Link>
                <Link to={`/track-order?id=${placedOrderId}`}>
                  <Button variant="outline">Track Order</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/cart" className="text-muted-foreground hover:text-foreground">
              Cart
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">Checkout</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="flex-1 max-w-2xl">
            <div className="space-y-8">
              {/* Progress Steps */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= step
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                      }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`w-12 h-0.5 mx-2 ${currentStep > step ? 'bg-primary' : 'bg-muted'
                        }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Truck className="h-5 w-5 mr-2" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={shippingInfo.firstName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={shippingInfo.lastName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Select value={shippingInfo.state} onValueChange={(value) => setShippingInfo({ ...shippingInfo, state: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CA">California</SelectItem>
                            <SelectItem value="NY">New York</SelectItem>
                            <SelectItem value="TX">Texas</SelectItem>
                            <SelectItem value="FL">Florida</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                          placeholder="10001"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => setCurrentStep(2)} className="w-full">
                      Continue to Payment
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup value={paymentInfo.method} onValueChange={(value) => setPaymentInfo({ ...paymentInfo, method: value })}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card">Credit/Debit Card</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal">PayPal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="apple" id="apple" />
                        <Label htmlFor="apple">Apple Pay</Label>
                      </div>
                    </RadioGroup>

                    {paymentInfo.method === 'card' && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            value={paymentInfo.cardNumber}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              value={paymentInfo.expiryDate}
                              onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              value={paymentInfo.cvv}
                              onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                              placeholder="123"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="nameOnCard">Name on Card</Label>
                          <Input
                            id="nameOnCard"
                            value={paymentInfo.nameOnCard}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, nameOnCard: e.target.value })}
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-4">
                    <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button onClick={() => setCurrentStep(3)} className="flex-1">
                      Review Order
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {/* Step 3: Order Review */}
              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Review Your Order
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Order Items */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">Order Items</h3>
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="font-semibold mb-2">Shipping Address</h3>
                      <div className="p-4 bg-muted rounded-lg">
                        <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                        <p>{shippingInfo.address}</p>
                        <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                        <p>{shippingInfo.email}</p>
                        <p>{shippingInfo.phone}</p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h3 className="font-semibold mb-2">Payment Method</h3>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="capitalize">{paymentInfo.method}</p>
                        {paymentInfo.method === 'card' && (
                          <p>**** **** **** {paymentInfo.cardNumber.slice(-4)}</p>
                        )}
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the Terms of Service and Privacy Policy
                      </Label>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-4">
                    <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button onClick={handlePlaceOrder} className="flex-1">
                      Place Order - ${total.toFixed(2)}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cartState.itemCount} items)</span>
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

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo Discount ({promoDiscount}%)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                {/* Promo Code */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Promo Code</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button variant="outline" onClick={handleApplyPromo}>
                      Apply
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Try: SAVE10, WELCOME15, FIRST20
                  </p>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;