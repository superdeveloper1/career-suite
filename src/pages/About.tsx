import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 text-center">About EliteStore</h1>

                    <div className="grid gap-8">
                        <Card>
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Founded in 2024, EliteStore began with a simple mission: to make high-quality products accessible to everyone.
                                    What started as a small local shop has grown into a premier online destination for electronics, fashion, and home decor.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    We believe that shopping should be easy, enjoyable, and reliable. That's why we curate only the best products
                                    and work tirelessly to ensure your experience with us is nothing short of excellent.
                                </p>
                            </CardContent>
                        </Card>

                        <div className="grid md:grid-cols-3 gap-6">
                            <Card>
                                <CardContent className="p-6 text-center">
                                    <h3 className="font-bold text-lg mb-2">Quality First</h3>
                                    <p className="text-sm text-muted-foreground">Every item is carefully verified for quality assurance.</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6 text-center">
                                    <h3 className="font-bold text-lg mb-2">Fast Shipping</h3>
                                    <p className="text-sm text-muted-foreground">We partner with top carriers to get your order to you quickly.</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6 text-center">
                                    <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
                                    <p className="text-sm text-muted-foreground">Our customer support team is always here to help.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
