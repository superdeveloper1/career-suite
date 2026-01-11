import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Shipping = () => (
    <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Shipping Information</h1>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Delivery Methods</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-4">
                            <div>
                                <p className="font-semibold">Standard Delivery</p>
                                <p className="text-sm text-muted-foreground">3-5 Business Days</p>
                            </div>
                            <p className="font-medium">$5.99 (Free over $50)</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">Express Delivery</p>
                                <p className="text-sm text-muted-foreground">1-2 Business Days</p>
                            </div>
                            <p className="font-medium">$14.99</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>International Shipping</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            We currently ship to select international destinations. Shipping times and costs vary by location.
                            Please verify your address at checkout to see available options.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
);

export const Returns = () => (
    <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Returns & Refunds</h1>
            <Card>
                <CardContent className="p-8 space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Our Policy</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We want you to be completely satisfied with your purchase. If you're not happy with your order,
                            you can return it within 30 days of purchase for a full refund or exchange.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold mb-2">Conditions</h3>
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            <li>Items must be unused and in original packaging.</li>
                            <li>Tags must still be attached.</li>
                            <li>Proof of purchase is required.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold mb-2">How to Return</h3>
                        <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
                            <li>Log in to your account and go to "Orders".</li>
                            <li>Select the order and items you wish to return.</li>
                            <li>Print the prepaid shipping label.</li>
                            <li>Drop off the package at any authorized carrier location.</li>
                        </ol>
                    </section>
                </CardContent>
            </Card>
        </div>
    </div>
);

export const FAQ = () => (
    <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 max-w-3xl">
            <h1 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
            <Card>
                <CardContent className="p-6">
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger>How do I track my order?</AccordionTrigger>
                            <AccordionContent>
                                You can track your order by clicking on the "Track Order" link in the header or in the footer.
                                Enter your Order ID to see real-time updates.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                            <AccordionContent>
                                We accept all major credit cards (Visa, MasterCard, Amex), PayPal, and Apple Pay.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Can I change my shipping address?</AccordionTrigger>
                            <AccordionContent>
                                If your order hasn't shipped yet, please contact our support team immediately.
                                Once an order has shipped, we cannot change the address.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>Do you offer gift wrapping?</AccordionTrigger>
                            <AccordionContent>
                                Yes! You can select gift wrapping at checkout for a small additional fee.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    </div>
);
