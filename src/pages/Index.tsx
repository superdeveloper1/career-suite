import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Search, Star, Menu, User, Heart, Trash2, Plus, Settings, Lock, LogOut, Pencil, X, ArrowUp, AlertTriangle, Package, BarChart3, Layers } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { state: cartState, addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const location = useLocation();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeCategory, setActiveCategory] = useState('featured');

  // ... (products state and other logic)

  // Back to Top Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Slightly more offset for the sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Sample product data
  const [products, setProducts] = useState<any[]>(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        return JSON.parse(savedProducts);
      } catch (e) {
        console.error("Failed to parse products from local storage", e);
      }
    }
    return [
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
        stock: 1
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
        stock: 1
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
        stock: 1
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
        stock: 1
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // Data Migration: Ensure all existing products have a stock property
  // and repair the '10' placeholders from a previous step back to '1'
  useEffect(() => {
    const hasLegacyPlaceholders = products.some(p => p.stock === undefined || p.stock === null || p.stock === 10);
    if (hasLegacyPlaceholders) {
      setProducts(prev => prev.map(p => ({
        ...p,
        stock: (p.stock === 10 || p.stock === undefined || p.stock === null) ? 1 : p.stock
      })));
    }
  }, []);

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('isAdminAuthenticated') === 'true';
  });

  useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.setItem('isAdminAuthenticated', 'true');
    } else {
      sessionStorage.removeItem('isAdminAuthenticated');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (location.hash === '#admin') {
      setIsAdminMode(true);
      setTimeout(() => {
        document.getElementById('admin-dashboard')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.hash]);

  const [inventorySearch, setInventorySearch] = useState('');
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
    description: '',
    stock: '1'
  });
  const [imageFields, setImageFields] = useState<string[]>(['']);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [categories, setCategories] = useState(() => {
    const defaultCategories = [
      { name: 'Electronics', count: 0, image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200&auto=format&fit=crop&q=80' },
      { name: 'Fashion', count: 0, image: 'https://images.unsplash.com/photo-1445205170230-053b830c6050?w=200&auto=format&fit=crop&q=80' },
      { name: 'Home & Decor', count: 0, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&auto=format&fit=crop&q=80' },
      { name: 'Accessories', count: 0, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80' },
      { name: 'Sports', count: 0, image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=200&auto=format&fit=crop&q=80' }
    ];

    try {
      const saved = localStorage.getItem('categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all categories have images, merge with defaults if needed
        return parsed.map((cat: any) => {
          const defaultCat = defaultCategories.find(d => d.name === cat.name);
          return {
            ...cat,
            image: cat.image || defaultCat?.image || 'https://images.unsplash.com/photo-1557821552-17105176677c?w=200&auto=format&fit=crop&q=80'
          };
        });
      }
    } catch (e) {
      console.error('Failed to load categories from localStorage', e);
    }
    return defaultCategories;
  });

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    // 1. Calculate stats from current products
    const stats = products.reduce((acc: any, product) => {
      const catName = (product.category || 'Uncategorized').trim();
      const catKey = catName.toLowerCase();
      if (!acc[catKey]) acc[catKey] = { name: catName, count: 0, stock: 0 };
      acc[catKey].count += 1;
      acc[catKey].stock += Number(product.stock || 0);
      return acc;
    }, {});

    // 2. Update categories state
    setCategories(prev => {
      let hasChanged = false;
      const existingKeys = new Set(prev.map(c => c.name.toLowerCase()));

      // Update existing categories and find if any are missing/need update
      const updatedExisting = prev.map(cat => {
        const key = cat.name.toLowerCase();
        let newCount = stats[key]?.count || 0;
        let newStock = stats[key]?.stock || 0;

        // Special case for Sport/Sports mismatch
        if ((key === 'sports' || key === 'sport')) {
          const sportsStats = stats['sports'] || { count: 0, stock: 0 };
          const sportStats = stats['sport'] || { count: 0, stock: 0 };
          newCount = sportsStats.count + sportStats.count;
          newStock = sportsStats.stock + sportStats.stock;
        }

        if (cat.count !== newCount || (cat.totalStock || 0) !== newStock) {
          hasChanged = true;
          return { ...cat, count: newCount, totalStock: newStock };
        }
        return cat;
      });

      // Find any categories in products that aren't in our list yet
      const newItems = [];
      for (const key in stats) {
        if (!existingKeys.has(key) && key !== 'sport' && key !== 'sports') { // Avoid adding duplicates for sport/sports
          newItems.push({
            name: stats[key].name,
            count: stats[key].count,
            totalStock: stats[key].stock,
            image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=200&auto=format&fit=crop&q=80'
          });
          hasChanged = true;
        }
      }

      if (hasChanged) {
        return [...updatedExisting, ...newItems];
      }
      return prev;
    });
  }, [products]);

  const [newCategory, setNewCategory] = useState({ name: '', image: '' });

  const addToCart = (productId: number) => {
    const product = products.find(p => p.id === productId);
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

  const handleDeleteItem = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: "Item deleted",
      description: "The item has been removed from inventory.",
      variant: "destructive",
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdminMode(false);
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin session.",
    });
  };

  const handleImageFieldChange = (index: number, value: string) => {
    const newFields = [...imageFields];
    newFields[index] = value;
    setImageFields(newFields);
  };

  const handleRemoveImageField = (index: number) => {
    if (imageFields.length > 1) {
      const newFields = imageFields.filter((_, i) => i !== index);
      setImageFields(newFields);
    }
  };

  const handleResetAllStock = () => {
    setProducts(products.map(p => ({ ...p, stock: 1 })));
    toast({
      title: "Inventory Reset",
      description: "All products have been reset to 1 unit in stock.",
    });
  };

  const handleAddImageField = () => {
    setImageFields([...imageFields, '']);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price || !newItem.category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const price = parseFloat(newItem.price);
    const stock = parseInt(newItem.stock) || 1;

    if (isNaN(price)) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid number for the price.",
        variant: "destructive",
      });
      return;
    }

    const imageUrls = imageFields.map(url => url.trim()).filter(url => url !== '');
    const mainImage = imageUrls.length > 0 ? imageUrls[0] : 'https://images.unsplash.com/photo-1560718217-69193acc0713?w=400&auto=format&fit=crop&q=80';

    const productData = {
      name: newItem.name,
      price: price,
      image: mainImage,
      images: imageUrls,
      category: newItem.category.trim(),
      description: newItem.description,
      stock: stock
    };

    if (editingId !== null) {
      setProducts(products.map(p => p.id === editingId ? { ...p, ...productData } : p));
      toast({
        title: "Item updated",
        description: "The item has been successfully updated.",
      });
      setEditingId(null);
    } else {
      const newProduct = {
        ...productData,
        id: Date.now(),
        originalPrice: undefined,
        rating: 5.0,
        reviews: 0,
        badge: 'New'
      };
      setProducts([...products, newProduct]);
      toast({
        title: "Item added",
        description: "New item has been added to the store.",
      });
    }

    setNewItem({ name: '', price: '', category: '', image: '', description: '', stock: '' });
    setImageFields(['']);
  };

  const handleEditItem = (item: any) => {
    setEditingId(item.id);
    setNewItem({
      name: item.name || '',
      price: item.price !== undefined && item.price !== null ? item.price.toString() : '',
      category: item.category || '',
      image: '',
      description: item.description || '',
      stock: item.stock !== undefined ? item.stock.toString() : '0'
    });

    // Populate image fields
    if (item.images && item.images.length > 0) {
      setImageFields(item.images);
    } else if (item.image) {
      setImageFields([item.image]);
    } else {
      setImageFields(['']);
    }

    toast({
      title: "Editing Item",
      description: `Editing ${item.name}. Form populated above.`,
    });
    document.getElementById('admin-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewItem({ name: '', price: '', category: '', image: '', description: '', stock: '' });
    setImageFields(['']);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name) {
      toast({
        title: "Missing name",
        description: "Please enter a category name.",
        variant: "destructive",
      });
      return;
    }

    setCategories([...categories, {
      name: newCategory.name.trim(),
      count: 0,
      image: newCategory.image || 'https://images.unsplash.com/photo-1557821552-17105176677c?w=200&auto=format&fit=crop&q=80'
    }]);
    setNewCategory({ name: '', image: '' });
    toast({
      title: "Category added",
      description: `${newCategory.name} has been added to categories.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        showSearch={true}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        suggestions={products.map(p => p.name)}
        isAdmin={isAuthenticated}
      />

      {/* Hero Section with Carousel */}
      <section className="relative bg-muted overflow-hidden">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {products.slice(0, 4).map((product) => (
              <CarouselItem key={product.id}>
                <div className="relative h-[500px] w-full bg-black">
                  {/* Background Image with Overlay */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-60 transition-opacity duration-500"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />

                  {/* Content */}
                  <div className="relative container mx-auto px-4 h-full flex flex-col justify-center text-white z-10">
                    <div className="max-w-2xl animate-in slide-in-from-left duration-700 fade-in">
                      <Badge className="mb-4 bg-yellow-500 text-black hover:bg-yellow-400 border-none text-md px-3 py-1">
                        {product.badge || 'Featured'}
                      </Badge>
                      <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                        {product.name}
                      </h1>
                      <p className="text-xl text-gray-200 mb-8 max-w-lg">
                        Experience premium quality and style. Get the best items from our {product.category} collection.
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <Button
                          size="lg"
                          className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 rounded-full font-semibold transition-transform hover:scale-105"
                          onClick={() => {
                            addItem(product);
                            toast({ title: "Added to cart", description: `${product.name} has been added.` })
                          }}
                        >
                          <ShoppingCart className="mr-2 h-5 w-5" /> Buy Now - ${product.price}
                        </Button>
                        <Link to={`/product/${product.id}`}>
                          <Button
                            variant="outline"
                            size="lg"
                            className="bg-transparent border-white text-white hover:bg-white/20 text-lg px-8 py-6 rounded-full font-semibold"
                          >
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-black/50 text-white border-none hover:bg-black/70" />
          <CarouselNext className="right-4 bg-black/50 text-white border-none hover:bg-black/70" />
        </Carousel>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card
                key={category.name}
                className={`group cursor-pointer transition-smooth hover:shadow-card hover:-translate-y-1 ${activeCategory === category.name.toLowerCase() ? 'ring-2 ring-primary' : ''}`}
                onClick={() => {
                  const slug = category.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                  setActiveCategory(slug);
                  setTimeout(() => scrollToSection('category-tabs-anchor'), 100);
                }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                    />
                  </div>
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  {isAdminMode && isAuthenticated && (
                    <p className="text-sm text-muted-foreground">{category.count} items</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div id="category-tabs-anchor" className="scroll-mt-24">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <div className="container mx-auto px-4 mb-8">
            <TabsList className="w-full justify-start overflow-x-auto pb-2 mb-4 bg-transparent h-auto gap-4 border-b">
              <TabsTrigger
                value="featured"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-4"
              >
                Featured
              </TabsTrigger>
              {categories.map((cat: any) => {
                const slug = cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                return (
                  <TabsTrigger
                    key={slug}
                    value={slug}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-4"
                  >
                    {cat.name}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <TabsContent value="featured" className="mt-0 outline-none">
            {/* Hero Carousel - Only show in Featured */}
            <section className="mb-16">
              <div className="container mx-auto px-4">
                <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white">
                  <Carousel className="w-full">
                    <CarouselContent>
                      <CarouselItem>
                        <div className="relative h-[400px] md:h-[500px] flex items-center">
                          <img
                            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80"
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                            alt="Shop New Arrivals"
                          />
                          <div className="relative container mx-auto px-8 md:px-16">
                            <Badge className="mb-4 bg-primary/20 text-primary-foreground border-primary" variant="outline">New Season</Badge>
                            <h2 className="text-4xl md:text-6xl font-bold mb-4">Shop New Arrivals</h2>
                            <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-lg">Discover our latest collection of premium products curated just for you.</p>
                            <Button size="lg" className="rounded-full px-8">Shop Now</Button>
                          </div>
                        </div>
                      </CarouselItem>
                      <CarouselItem>
                        <div className="relative h-[400px] md:h-[500px] flex items-center">
                          <img
                            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&auto=format&fit=crop&q=80"
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                            alt="Summer Collection"
                          />
                          <div className="relative container mx-auto px-8 md:px-16">
                            <Badge className="mb-4 bg-primary/20 text-primary-foreground border-primary" variant="outline">Big Sale</Badge>
                            <h2 className="text-4xl md:text-6xl font-bold mb-4">Summer Collection</h2>
                            <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-lg">Get up to 50% off on all summer essentials. Limited time offer!</p>
                            <Button size="lg" variant="secondary" className="rounded-full px-8 text-black">View Deals</Button>
                          </div>
                        </div>
                      </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </Carousel>
                </div>
              </div>
            </section>

            {/* Featured Overview */}
            <section className="py-16 bg-slate-50/50">
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-12">
                  <h2 className="text-3xl font-bold">Featured Products</h2>
                  <Button variant="ghost" onClick={() => setActiveCategory(categories[0].name.toLowerCase())}>
                    See Categories
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.slice(0, 8).map((product) => (
                    <Card key={product.id} className="group cursor-pointer transition-smooth hover:shadow-card hover:-translate-y-1">
                      <CardHeader className="p-0">
                        <Link to={`/product/${product.id}`}>
                          <img src={product.image} className="w-full h-48 object-cover rounded-t-lg" alt={product.name} />
                        </Link>
                      </CardHeader>
                      <CardContent className="p-4">
                        <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                        <h4 className="font-semibold line-clamp-1 mb-2">{product.name}</h4>
                        <p className="font-bold">${product.price}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          </TabsContent>

          {categories.map((category) => {
            const slug = category.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const categoryProducts = products.filter(p =>
              (p.category || '').trim().toLowerCase() === category.name.trim().toLowerCase() ||
              (category.name.trim().toLowerCase() === 'sports' && (p.category || '').trim().toLowerCase() === 'sport') ||
              (category.name.trim().toLowerCase() === 'sport' && (p.category || '').trim().toLowerCase() === 'sports')
            );

            return (
              <TabsContent key={slug} value={slug} className="mt-0 outline-none">
                <section
                  id={`category-${slug}`}
                  className="py-16 min-h-[60vh] flex flex-col justify-start bg-white"
                >
                  <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-12">
                      <h2 className="text-4xl font-bold tracking-tight">{category.name}</h2>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setActiveCategory('featured')}>Back to Home</Button>
                        <Link to={`/products`}>
                          <Button>View All {category.name}</Button>
                        </Link>
                      </div>
                    </div>
                    {categoryProducts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categoryProducts.map((product) => (
                          <Card key={product.id} className="group cursor-pointer transition-smooth hover:shadow-card hover:-translate-y-1">
                            <CardHeader className="p-0">
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
                                              className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
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
                                      className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
                                    />
                                  )}
                                  <Badge className="absolute top-3 left-3 z-10" variant={product.badge === 'Sale' ? 'destructive' : 'default'}>
                                    {product.badge}
                                  </Badge>
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
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 bg-slate-50 rounded-xl">
                        <p className="text-muted-foreground">No products found in this category.</p>
                      </div>
                    )}
                  </div>
                </section>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>

      {/* Admin Section Toggle */}
      {isAuthenticated && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => {
              const newMode = !isAdminMode;
              setIsAdminMode(newMode);
              toast({
                title: newMode ? "Admin Dashboard Enabled" : "Admin Dashboard Disabled",
                description: newMode ? "Scroll down to manage inventory." : "Dashboard hidden.",
              });
              if (newMode) {
                setTimeout(() => document.getElementById('admin-dashboard')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }
            }}
            className="rounded-full shadow-lg"
            size="default"
          >
            <Settings className="h-4 w-4 mr-2" />
            {isAdminMode ? 'Hide Admin' : 'Admin Dashboard'}
          </Button>
        </div>
      )}

      {/* Admin Panel */}
      {isAdminMode && isAuthenticated && (
        <section id="admin-dashboard" className="py-8 md:py-16 bg-slate-50 border-t">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Admin Dashboard</h2>

            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border mb-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Store Overview</p>
                    <h3 className="text-xl font-bold">Inventory Metrics</h3>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleResetAllStock} size="sm" className="text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Reset Stock to 1
                  </Button>
                  <Button variant="outline" onClick={handleLogout} size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>

              {/* Stats Overview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-white hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                      <Layers className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl font-bold">{products.length}</h3>
                      <span className="text-xs text-muted-foreground">across {categories.length} categories</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-muted-foreground">Total Units in Stock</p>
                      <Package className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl font-bold">{categories.reduce((sum, cat) => sum + (cat.totalStock || 0), 0)}</h3>
                      <span className="text-xs text-muted-foreground font-medium text-green-600">Actual Inventory</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-muted-foreground">Low Stock Alerts</p>
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl font-bold text-amber-600">{products.filter(p => Number(p.stock || 0) < 10).length}</h3>
                      <span className="text-xs text-muted-foreground">items below 10 units</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-8">
                  {/* Add Item Form */}
                  <Card id="admin-form">
                    <CardHeader>
                      <CardTitle>{editingId !== null ? 'Edit Item' : 'Add New Item'}</CardTitle>
                      <CardDescription>{editingId !== null ? 'Update existing product details' : 'Create a new product listing'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSaveItem} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Product Name</label>
                          <Input
                            placeholder="e.g. Smart Watch"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Price ($)</label>
                            <Input
                              type="number"
                              placeholder="0.00"
                              value={newItem.price}
                              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Stock Qty</label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={newItem.stock}
                              onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Category</label>
                          <Select
                            value={newItem.category}
                            onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category: any) => (
                                <SelectItem key={category.name} value={category.name}>
                                  {category.name} ({category.count} {category.count === 1 ? 'item' : 'items'})
                                </SelectItem>
                              ))}
                              {/* Ensure current category is shown even if not in the main list */}
                              {newItem.category && !categories.some(c => c.name === newItem.category) && (
                                <SelectItem key={newItem.category} value={newItem.category}>
                                  {newItem.category}
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Image URL(s)</label>
                          <div className="space-y-2">
                            {imageFields.map((url, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  placeholder="https://..."
                                  value={url}
                                  onChange={(e) => handleImageFieldChange(index, e.target.value)}
                                />
                                {imageFields.length > 1 && (
                                  <Button type="button" variant="outline" size="icon" onClick={() => handleRemoveImageField(index)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={handleAddImageField} className="mt-2">
                              <Plus className="h-4 w-4 mr-2" /> Add Another Image
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Description</label>
                          <Input
                            placeholder="Product description..."
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" className="flex-1">
                            {editingId !== null ? <Pencil className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                            {editingId !== null ? 'Update Product' : 'Add Product'}
                          </Button>
                          {editingId !== null && (
                            <Button type="button" variant="outline" onClick={handleCancelEdit}>
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Add Category Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Add Category</CardTitle>
                      <CardDescription>Create a new product category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddCategory} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Category Name</label>
                          <Input
                            placeholder="e.g. Books"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Image URL</label>
                          <Input
                            placeholder="https://..."
                            value={newCategory.image}
                            onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          <Plus className="h-4 w-4 mr-2" /> Add Category
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Category Summary (Admin Only) */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Category Summary</CardTitle>
                      <CardDescription>Current product counts by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {categories.map((cat: any) => (
                          <div key={cat.name} className="flex justify-between items-center text-sm border-b pb-2 last:border-0 last:pb-0">
                            <div className="flex flex-col">
                              <span className="font-medium">{cat.name}</span>
                              <span className="text-[10px] text-muted-foreground">{cat.count} product types</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-slate-100">{cat.totalStock || 0} units</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Low Stock Alerts (Admin Only) */}
                  {products.some(p => p.stock < 10) && (
                    <Card className="border-amber-200 bg-amber-50/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-amber-800 flex items-center gap-2 text-lg">
                          <AlertTriangle className="h-4 w-4 text-amber-600" /> Low Stock Alerts
                        </CardTitle>
                        <CardDescription className="text-amber-700/70">Items needing restock</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {products.filter(p => p.stock < 10).sort((a, b) => a.stock - b.stock).slice(0, 5).map((product) => (
                            <div key={product.id} className="flex justify-between items-center text-sm border-b border-amber-100 pb-2 last:border-0 last:pb-0">
                              <span className="font-medium truncate pr-2 text-slate-800">{product.name}</span>
                              <Badge
                                variant={product.stock <= 0 ? "destructive" : "secondary"}
                                className={`h-5 text-[10px] ${product.stock > 0 ? 'bg-amber-100 text-amber-800 border-amber-200' : ''}`}
                              >
                                {product.stock <= 0 ? "Out of Stock" : `${product.stock} units`}
                              </Badge>
                            </div>
                          ))}
                          {products.filter(p => p.stock < 10).length > 5 && (
                            <p className="text-[10px] text-amber-700/60 text-center pt-1 italic">
                              + {products.filter(p => p.stock < 10).length - 5} more low-stock items
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Product Management List */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Manage Inventory</CardTitle>
                    <CardDescription>View and delete existing products</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search inventory..."
                          value={inventorySearch}
                          onChange={(e) => setInventorySearch(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <div className="space-y-8">
                      {categories.map((category: any) => {
                        const categoryProducts = products.filter(p => {
                          const matchesSearch = p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                            (p.category || '').toLowerCase().includes(inventorySearch.toLowerCase());
                          const matchesCategory = (p.category || '').trim().toLowerCase() === category.name.trim().toLowerCase() ||
                            (category.name.trim().toLowerCase() === 'sports' && (p.category || '').trim().toLowerCase() === 'sport') ||
                            (category.name.trim().toLowerCase() === 'sport' && (p.category || '').trim().toLowerCase() === 'sports');
                          return matchesSearch && matchesCategory;
                        });

                        if (categoryProducts.length === 0) return null;

                        return (
                          <div key={category.name} className="space-y-4">
                            <h3 className="font-bold text-lg flex items-center justify-between border-b pb-2 text-slate-700">
                              <span>{category.name}</span>
                              <Badge variant="outline" className="text-[10px]">{categoryProducts.length} items</Badge>
                            </h3>
                            <div className="space-y-4">
                              {categoryProducts.map((product) => (
                                <div key={product.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-white gap-4 hover:shadow-sm transition-shadow">
                                  <div className="flex items-center space-x-4 overflow-hidden">
                                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover shrink-0" />
                                    <div className="min-w-0">
                                      <h4 className="font-medium truncate">{product.name}</h4>
                                      <div className="flex items-center gap-2 mt-1">
                                        <p className="text-sm text-muted-foreground">${product.price}</p>
                                        <Badge
                                          variant={(product.stock ?? 0) <= 0 ? "destructive" : "secondary"}
                                          className={`text-[10px] px-2 h-5 font-bold ${(product.stock ?? 0) > 0 && (product.stock ?? 0) < 10 ? 'bg-amber-500 hover:bg-amber-600 text-white border-0' : ''}`}
                                        >
                                          {(product.stock ?? 0) <= 0 ? "0 in stock" : `${product.stock} in stock`}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 w-full sm:w-auto">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEditItem(product)}
                                      className="flex-1 sm:flex-none"
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleDeleteItem(product.id)}
                                      className="flex-1 sm:flex-none"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                      {/* Show uncategorized or "Other" items if any */}
                      {products.filter(p => !categories.some((c: any) =>
                        (p.category || '').trim().toLowerCase() === c.name.trim().toLowerCase() ||
                        (c.name.trim().toLowerCase() === 'sports' && (p.category || '').trim().toLowerCase() === 'sport') ||
                        (c.name.trim().toLowerCase() === 'sport' && (p.category || '').trim().toLowerCase() === 'sports')
                      )).length > 0 && (
                          <div className="space-y-4">
                            <h3 className="font-bold text-lg border-b pb-2 text-slate-500">Other / Uncategorized</h3>
                            <div className="space-y-4">
                              {products.filter(p => !categories.some((c: any) =>
                                (p.category || '').trim().toLowerCase() === c.name.trim().toLowerCase() ||
                                (c.name.trim().toLowerCase() === 'sports' && (p.category || '').trim().toLowerCase() === 'sport') ||
                                (c.name.trim().toLowerCase() === 'sport' && (p.category || '').trim().toLowerCase() === 'sports')
                              )).map((product) => (
                                <div key={product.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-white gap-4">
                                  <div className="flex items-center space-x-4 overflow-hidden">
                                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover shrink-0" />
                                    <div className="min-w-0">
                                      <h4 className="font-medium truncate">{product.name}</h4>
                                      <div className="flex items-center gap-2 mt-1">
                                        <p className="text-sm text-muted-foreground">${product.price} • {product.category || 'No Category'}</p>
                                        <Badge
                                          variant={(product.stock ?? 0) <= 0 ? "destructive" : "secondary"}
                                          className={`text-[10px] px-1.5 h-4 ${(product.stock ?? 0) > 0 && (product.stock ?? 0) < 10 ? 'bg-amber-500 hover:bg-amber-600 text-white border-0' : ''}`}
                                        >
                                          {(product.stock ?? 0) <= 0 ? "Out of Stock" : (product.stock ?? 0) < 10 ? `Low Stock: ${product.stock}` : `${product.stock} in stock`}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 w-full sm:w-auto">
                                    <Button variant="outline" size="sm" onClick={() => handleEditItem(product)} className="flex-1 sm:flex-none">
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(product.id)} className="flex-1 sm:flex-none">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="gradient-primary text-white">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-lg mb-8 opacity-90">
                Subscribe to our newsletter and get 10% off your first order!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  placeholder="Enter your email"
                  className="bg-white text-black"
                />
                <Button className="bg-white text-primary hover:bg-gray-100">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl">EliteStore</span>
              </div>
              <p className="text-muted-foreground">
                Your trusted partner for quality products and exceptional shopping experience.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/products" className="hover:text-foreground transition-smooth">All Products</Link></li>
                <li><Link to="/categories" className="hover:text-foreground transition-smooth">Categories</Link></li>
                <li><Link to="/deals" className="hover:text-foreground transition-smooth">Deals</Link></li>
                <li><Link to="/about" className="hover:text-foreground transition-smooth">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/contact" className="hover:text-foreground transition-smooth">Contact Us</Link></li>
                <li><Link to="/shipping" className="hover:text-foreground transition-smooth">Shipping Info</Link></li>
                <li><Link to="/returns" className="hover:text-foreground transition-smooth">Returns</Link></li>
                <li><Link to="/faq" className="hover:text-foreground transition-smooth">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Account</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/login" className="hover:text-foreground transition-smooth">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-foreground transition-smooth">Create Account</Link></li>
                <li><Link to="/cart" className="hover:text-foreground transition-smooth">Shopping Cart</Link></li>
                <li><Link to="/wishlist" className="hover:text-foreground transition-smooth">Wishlist</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2026 EliteStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          className="fixed bottom-20 right-4 z-50 rounded-full shadow-lg p-3"
          size="icon"
          onClick={scrollToTop}
          aria-label="Back to Top"
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default Index;
