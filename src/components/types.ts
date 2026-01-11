export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  badge?: string;
  description?: string;
  images?: string[];
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: any[];
}

export interface User {
  email: string;
  name: string;
  orders: Order[];
  wishlist: Product[];
}

export interface OrderItem extends Product {
  quantity: number;
}