import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ShoppingCart, Search, Star, Filter, Heart, Grid, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import { Product } from '@/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Products = () => {
  const { state: cartState, addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Extended product data
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
    },
    {
      id: 5,
      name: 'Smartphone with Advanced Camera',
      price: 799.99,
      originalPrice: 899.99,
      image: 'https://images.unsplash.com/photo-1758264364350-f569dbf6bdc5?w=400&auto=format&fit=crop&q=80',
      rating: 4.5,
      reviews: 203,
      category: 'Electronics',
      badge: 'Popular',
      description: 'Latest smartphone with cutting-edge camera technology and performance.'
    },
    {
      id: 6,
      name: 'Designer Kurta Set',
      price: 129.99,
      originalPrice: 179.99,
      image: 'https://images.unsplash.com/photo-1701456108005-238f481800ab?w=400&auto=format&fit=crop&q=80',
      rating: 4.4,
      reviews: 78,
      category: 'Fashion',
      badge: 'Trending',
      description: 'Elegant designer kurta set perfect for special occasions.'
    },
    {
      id: 7,
      name: 'Modern Home Decor Vase',
      price: 79.99,
      originalPrice: 99.99,
      image: 'https://images.unsplash.com/photo-1520408222757-6f9f95d87d5d?w=400&auto=format&fit=crop&q=80',
      rating: 4.3,
      reviews: 45,
      category: 'Home & Decor',
      badge: 'Limited',
      description: 'Stylish decorative vase to enhance your home interior.'
    },
    {
      id: 8,
      name: 'Wireless Earbuds',
      price: 159.99,
      originalPrice: 199.99,
      image: 'https://images.unsplash.com/photo-1590658341922-15b2de4f4014?w=400&auto=format&fit=crop&q=80',
      rating: 4.6,
      reviews: 134,
      category: 'Electronics',
      badge: 'Hot',
      description: 'Compact wireless earbuds with superior sound quality and long battery life.'
    }
  ];

  const [allProducts, setAllProducts] = useState<any[]>(defaultProducts);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        setAllProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error("Failed to parse products from local storage", e);
      }
    }
  }, []);

  const categories = ['all', ...Array.from(new Set(allProducts.map(p => p.category)))];

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id - a.id;
      default:
        return 0;
    }
  });

  const addToCart = (productId: number) => {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1000}
                    step={10}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">Products</h1>
                <p className="text-muted-foreground">{sortedProducts.length} products found</p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
              : 'space-y-4'
            }>
              {sortedProducts.map((product) => (
                <Card key={product.id} className={`group cursor-pointer transition-smooth hover:shadow-card hover:-translate-y-1 ${viewMode === 'list' ? 'flex flex-row' : ''
                  }`}>
                  <CardHeader className={`p-0 ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                    <Link to={`/product/${product.id}`}>
                      <div className="relative overflow-hidden rounded-t-lg">
                        {product.images && product.images.length > 1 ? (
                          <Carousel className="w-full">
                            <CarouselContent>
                              {product.images.map((img: string, index: number) => (
                                <CarouselItem key={index}>
                                  <img
                                    src={img}
                                    alt={`${product.name} ${index + 1}`}
                                    className={`object-cover group-hover:scale-105 transition-smooth ${viewMode === 'list' ? 'w-48 h-32' : 'w-full h-48'
                                      }`}
                                  />
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-2 h-6 w-6" />
                            <CarouselNext className="right-2 h-6 w-6" />
                          </Carousel>
                        ) : (
                          <img
                            src={product.image}
                            alt={product.name}
                            className={`object-cover group-hover:scale-105 transition-smooth ${viewMode === 'list' ? 'w-48 h-32' : 'w-full h-48'
                              }`}
                          />
                        )}
                        <Badge className="absolute top-3 left-3 z-10" variant={product.badge === 'Sale' ? 'destructive' : 'default'}>
                          {product.badge}
                        </Badge>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-3 right-3 bg-white/80 hover:bg-white z-10"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </Link>
                  </CardHeader>
                  <div className="flex-1">
                    <CardContent className="p-4">
                      <Badge variant="secondary" className="mb-2">
                        {product.category}
                      </Badge>
                      <Link to={`/product/${product.id}`}>
                        <CardTitle className={`mb-2 line-clamp-2 hover:text-primary transition-colors ${viewMode === 'list' ? 'text-lg' : 'text-lg'}`}>
                          {product.name}
                        </CardTitle>
                      </Link>
                      {viewMode === 'list' && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}
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
                          <span className="text-lg font-bold">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through ml-2">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                        <Badge variant={Number(product.stock || 0) > 0 ? "secondary" : "destructive"} className="text-[10px] px-1.5 h-5">
                          {Number(product.stock || 0) > 0 ? "Available" : "Out of Stock"}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full"
                        onClick={() => addToCart(product.id)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setPriceRange([0, 1000]);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;