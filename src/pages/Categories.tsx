import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Categories = () => {
    const [isAdmin] = useState(() => sessionStorage.getItem('isAdminAuthenticated') === 'true');

    // Re-use logic from Index.tsx or just default to known categories if local storage missing
    const [categories, setCategories] = useState(() => {
        const savedCategories = localStorage.getItem('categories');
        return savedCategories ? JSON.parse(savedCategories) : [
            { name: 'Electronics', count: 245, image: 'https://images.unsplash.com/photo-1759588071845-3864bd8cc9d3?w=200&auto=format&fit=crop&q=80' },
            { name: 'Fashion', count: 189, image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=200&auto=format&fit=crop&q=80' },
            { name: 'Home & Decor', count: 156, image: 'https://images.unsplash.com/photo-1567016546367-c27a0d56712e?w=200&auto=format&fit=crop&q=80' },
            { name: 'Sports', count: 98, image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=200&auto=format&fit=crop&q=80' }
        ];
    });

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold mb-12 text-center">Browse Categories</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categories.map((category: any) => (
                        <Link to="/products" key={category.name} className="block group">
                            <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <CardContent className="p-6 text-center">
                                    <h3 className="font-bold text-xl mb-2">{category.name}</h3>
                                    {isAdmin && (
                                        <p className="text-muted-foreground">{category.count} Products</p>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Categories;
