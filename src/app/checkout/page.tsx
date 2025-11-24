'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CheckoutForm } from '@/components/CheckoutForm';
import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const { cartItems, cartTotal, itemCount } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const shippingCost = itemCount > 0 ? 5.00 : 0;
  const total = cartTotal + shippingCost;
  
  const heroImage = PlaceHolderImages.find((img) => img.id === 'checkout-hero');

  if (!isClient) {
    return null; // or a loading skeleton
  }

  if (itemCount === 0) {
    return (
      <div className="container mx-auto max-w-4xl py-12 text-center">
        <h1 className="font-headline text-4xl">Your Cart is Empty</h1>
        <p className="mt-4 text-muted-foreground">
          You need to add items to your cart before you can check out.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Return to Shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
     <div className="relative h-48 w-full md:h-64">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="font-headline text-4xl md:text-6xl font-bold">
            Checkout
          </h1>
        </div>
      </div>
    <div className="container mx-auto max-w-6xl py-8 px-4 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="lg:order-2">
          <h2 className="font-headline text-2xl mb-4">Order Summary</h2>
          <div className="rounded-lg border bg-card p-6">
            <ScrollArea className="h-64 pr-4">
              {cartItems.map((item) => {
                 const image = PlaceHolderImages.find(img => img.id === item.product.imageId);
                 return (
                  <div key={item.product.id} className="flex items-center justify-between py-4 border-b last:border-b-0">
                     <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                          {image && <Image src={image.imageUrl} alt={item.product.name} fill className="object-cover" />}
                        </div>
                        <div>
                            <p className="font-semibold">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                     </div>
                     <p className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                 )
              })}
            </ScrollArea>
            <div className="mt-6 space-y-2 border-t pt-4">
                <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>₹{shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
            </div>
          </div>
        </div>
        <div className="lg:order-1">
          <CheckoutForm />
        </div>
      </div>
    </div>
    </>
  );
}
