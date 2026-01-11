import { useUser } from '@/types/UserContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, User as UserIcon, LogOut, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { OrderItem, Product } from '@/types';

const Profile = () => {
  const { user, logout, toggleWishlist, deleteOrder } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64 space-y-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="h-10 w-10 text-primary" />
                </div>
                <h2 className="font-bold text-xl">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Button variant="outline" className="w-full mt-4" onClick={() => { logout(); navigate('/'); }}>
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="saves">Your Saves</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>

              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View and track your recent orders.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user.orders.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No orders yet. <Link to="/products" className="text-primary hover:underline">Start shopping!</Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {user.orders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                              <div>
                                <p className="font-semibold">Order #{order.id}</p>
                                <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">${order.total.toFixed(2)}</p>
                                <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 mb-2">
                                  {order.status}
                                </span>
                                <div>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => deleteOrder(order.id)}
                                    className="h-7 text-xs"
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              {order.items.map((item: OrderItem, idx: number) => (
                                <div key={idx} className="flex items-center gap-4 text-sm">
                                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
                                  <span className="flex-1">{item.name}</span>
                                  <span className="text-muted-foreground">x{item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="saves">
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Items</CardTitle>
                    <CardDescription>Items you have saved for later.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user.wishlist.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Your wishlist is empty.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {user.wishlist.map((item: any) => (
                          <div key={item.id} className="flex gap-4 border rounded-lg p-4">
                            <img src={item.image} alt={item.name} className="w-20 h-20 rounded object-cover" />
                            <div className="flex-1">
                              <h4 className="font-medium line-clamp-1">{item.name}</h4>
                              <p className="font-bold mt-1">${item.price}</p>
                              <div className="flex gap-2 mt-2">
                                <Link to={`/product/${item.id}`}>
                                  <Button size="sm" variant="outline">View</Button>
                                </Link>
                                <Button size="sm" variant="ghost" onClick={() => toggleWishlist(item)}>
                                  <Heart className="h-4 w-4 fill-current text-red-500" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                    <CardDescription>Manage your account information.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <label className="font-medium">Full Name</label>
                      <div className="p-2 border rounded bg-muted/50">{user.name}</div>
                    </div>
                    <div className="grid gap-2">
                      <label className="font-medium">Email Address</label>
                      <div className="p-2 border rounded bg-muted/50">{user.email}</div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;