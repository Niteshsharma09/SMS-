'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, ShoppingCart } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface CartSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function CartSheet({ isOpen, onOpenChange }: CartSheetProps) {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, itemCount } = useCart();

  const getCartItemId = (item: any) => {
    return item.lens ? `${item.product.id}_${item.lens.title.replace(/\s+/g, '-')}` : item.product.id;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle className="font-headline text-2xl">Shopping Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="my-4 flex-1 px-6">
              <div className="flex flex-col gap-6">
                {cartItems.map(item => {
                  const image = PlaceHolderImages.find(img => img.id === item.product.imageId);
                  const cartItemId = getCartItemId(item);
                  const itemPrice = item.product.price + (item.lens?.price || 0);

                  return (
                    <div key={cartItemId} className="flex items-center gap-4">
                       <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                        {image && (
                           <Image
                             src={image.imageUrl}
                             alt={item.product.name}
                             fill
                             className="object-cover"
                             data-ai-hint={image.imageHint}
                           />
                        )}
                       </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.product.name}</h3>
                        {item.lens && <p className="text-sm text-muted-foreground">+ {item.lens.title}</p>}
                        <p className="text-sm text-muted-foreground">Rs{itemPrice.toFixed(2)}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(cartItemId, parseInt(e.target.value, 10))}
                            className="h-8 w-16"
                            aria-label={`Quantity for ${item.product.name}`}
                          />
                          <Button variant="ghost" size="icon" onClick={() => removeFromCart(cartItemId)} aria-label={`Remove ${item.product.name}`}>
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <SheetFooter className="bg-background/95 p-6 backdrop-blur-sm">
              <div className="w-full space-y-4">
                <div className="flex justify-between font-semibold">
                  <span>Subtotal</span>
                  <span>Rs{cartTotal.toFixed(2)}</span>
                </div>
                 <SheetClose asChild>
                    <Button asChild className="w-full" size="lg">
                      <Link href="/checkout">Proceed to Checkout</Link>
                    </Button>
                 </SheetClose>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            <h3 className="font-headline text-xl">Your cart is empty</h3>
            <p className="text-muted-foreground">Add some items to get started.</p>
             <SheetClose asChild>
                <Button asChild variant="outline">
                    <Link href="/">Continue Shopping</Link>
                </Button>
             </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
