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
  stock?: number;
}

export interface OrderItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
}

export interface User {
  email: string;
  name: string;
  orders: Order[];
  wishlist: Product[];
}
