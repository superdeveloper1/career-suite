import { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5001/send-contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                toast({
                    title: "Message Sent",
                    description: "We'll get back to you as soon as possible!",
                });
                setFormData({ name: '', email: '', message: '' });
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send message. Please try again later.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold mb-12 text-center">Contact Us</h1>

                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <Card>
                            <CardContent className="p-6 flex items-start gap-4">
                                <Mail className="h-6 w-6 text-primary mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">Email Us</h3>
                                    <p className="text-muted-foreground">support@elitestore.com</p>
                                    <p className="text-muted-foreground">sales@elitestore.com</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 flex items-start gap-4">
                                <Phone className="h-6 w-6 text-primary mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">Call Us</h3>
                                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                                    <p className="text-xs text-muted-foreground mt-1">Mon-Fri: 9am - 6pm EST</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 flex items-start gap-4">
                                <MapPin className="h-6 w-6 text-primary mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">Visit Us</h3>
                                    <p className="text-muted-foreground">123 Commerce Avenue</p>
                                    <p className="text-muted-foreground">New York, NY 10001</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Send a Message</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                                    <Textarea
                                        id="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Send Message
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Contact;
