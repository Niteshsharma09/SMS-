'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CheckoutForm } from '@/components/CheckoutForm';
import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Product } from '@/lib/products';
import { LensOption } from '@/components/LensOptions';

export default function CheckoutPage() {
  const { cartItems, cartTotal, framesTotal, lensesTotal, itemCount } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const shippingCost = itemCount > 0 ? 5.00 : 0;
  const totalPayable = cartTotal + shippingCost;
  
  const heroImage = PlaceHolderImages.find((img) => img.id === 'checkout-hero');

  if (!isClient) {
    return null; // or a loading skeleton
  }

  if (itemCount === 0) {
    return (
      <div className="container mx-auto max-w-4xl py-12 text-center">
        <h1 className="font-headline text-3xl md:text-4xl">Your Cart is Empty</h1>
        <p className="mt-4 text-muted-foreground">
          You need to add items to your cart before you can check out.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Return to Shop</Link>
        </Button>
      </div>
    );
  }
  
  const renderCartItem = (product: Product, quantity: number, price: number, isLens = false) => {
    const image = PlaceHolderImages.find(img => img.id === product.imageId);
    return (
        <div key={product.id} className="flex items-start gap-4">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                {image && <Image src={image.imageUrl} alt={product.name} fill className="object-cover" />}
            </div>
            <div className="flex-1">
                <p className="font-semibold text-sm sm:text-base">{product.name}</p>
                {isLens ?
                  <p className="text-sm text-muted-foreground">Lens Selection</p> :
                  <p className="text-sm text-muted-foreground">Qty: {quantity}</p>
                }
            </div>
            <p className="font-medium text-right text-sm sm:text-base">Rs{(price * quantity).toFixed(2)}</p>
        </div>
    )
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="lg:order-2">
          <h2 className="font-headline text-2xl mb-4">Order Summary</h2>
          <div className="rounded-lg border bg-card p-4 sm:p-6">
            <ScrollArea className="h-64 pr-4">
              <div className="space-y-6">
              {cartItems.map((item) => {
                 const cartItemId = item.lens ? `${item.product.id}_${item.lens.title.replace(/\s+/g, '-')}` : item.product.id;
                 
                 const lensAsProduct: Product | null = item.lens ? {
                    id: `lens-for-${item.product.id}`,
                    name: item.lens.title,
                    price: item.lens.price,
                    description: item.lens.features.join(', '),
                    type: 'lenses',
                    brand: 'Visionary', // This needs to be more dynamic if possible
                    style: 'Single Vision', // This needs to be more dynamic if possible
                    material: 'Polycarbonate',
                    imageId: 'lens-1' // Generic lens image
                 } : null;

                 return (
                  <div key={cartItemId} className="space-y-4 py-4 border-b last:border-b-0">
                    {renderCartItem(item.product, item.quantity, item.product.price)}
                    {item.lens && lensAsProduct && renderCartItem(lensAsProduct, item.quantity, item.lens.price, true)}
                  </div>
                 )
              })}
              </div>
            </ScrollArea>
            <div className="mt-6 space-y-2 pt-4">
                <div className="flex justify-between text-muted-foreground">
                    <span>Frames Total</span>
                    <span>Rs{framesTotal.toFixed(2)}</span>
                </div>
                 {lensesTotal > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                      <span>Lenses Total</span>
                      <span>+Rs{lensesTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>Rs{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>Rs{shippingCost.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-base sm:text-lg">
                    <span>Total Payable</span>
                    <span>Rs{totalPayable.toFixed(2)}</span>
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
