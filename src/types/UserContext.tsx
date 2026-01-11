import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Order, User, Product } from '@/types';

interface UserContextType {
  user: User | null;
  login: (email: string) => boolean;
  logout: () => void;
  register: (email: string, name: string, password?: string) => boolean;
  addOrder: (order: Order) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  deleteOrder: (orderId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Load current user from session storage on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem('ecommerce_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string) => {
    const users: User[] = JSON.parse(localStorage.getItem('ecommerce_users') || '[]');
    const foundUser = users.find((u: User) => u.email === email);

    if (foundUser) {
      setUser(foundUser);
      sessionStorage.setItem('ecommerce_current_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('ecommerce_current_user');
  };

  const register = (email: string, name: string) => {
    const users: User[] = JSON.parse(localStorage.getItem('ecommerce_users') || '[]');
    if (users.find((u: User) => u.email === email)) {
      return false; // User already exists
    }

    const newUser: User = { email, name, orders: [], wishlist: [] };
    users.push(newUser);
    localStorage.setItem('ecommerce_users', JSON.stringify(users));

    setUser(newUser);
    sessionStorage.setItem('ecommerce_current_user', JSON.stringify(newUser));
    return true;
  };

  const updateUserStorage = (updatedUser: User) => {
    setUser(updatedUser);
    sessionStorage.setItem('ecommerce_current_user', JSON.stringify(updatedUser));

    const users: User[] = JSON.parse(localStorage.getItem('ecommerce_users') || '[]');
    const updatedUsers = users.map((u: User) => u.email === updatedUser.email ? updatedUser : u);
    localStorage.setItem('ecommerce_users', JSON.stringify(updatedUsers));
  };

  const addOrder = (order: Order) => {
    if (!user) return;
    const updatedUser = { ...user, orders: [order, ...user.orders] };
    updateUserStorage(updatedUser);
  };

  const toggleWishlist = (product: Product) => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need to be logged in to save items.", variant: "destructive" });
      return;
    }

    const exists = user.wishlist.some((p: Product) => p.id === product.id);
    let newWishlist;

    if (exists) {
      newWishlist = user.wishlist.filter((p: Product) => p.id !== product.id);
      toast({ title: "Removed from saves", description: `${product.name} removed from your wishlist.` });
    } else {
      newWishlist = [...user.wishlist, product];
      toast({ title: "Saved!", description: `${product.name} added to your wishlist.` });
    }

    const updatedUser = { ...user, wishlist: newWishlist };
    updateUserStorage(updatedUser);
  };

  const isInWishlist = (productId: number) => {
    return user?.wishlist.some((p: Product) => p.id === productId) || false;
  };

  const deleteOrder = (orderId: string) => {
    if (!user) return;

    const updatedOrders = user.orders.filter(order => order.id !== orderId);
    const updatedUser = { ...user, orders: updatedOrders };

    updateUserStorage(updatedUser);
    toast({ title: "Order Deleted", description: `Order #${orderId} has been removed from your history.` });
  };

  return (
    <UserContext.Provider value={{ user, login, logout, register, addOrder, toggleWishlist, isInWishlist, deleteOrder }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};