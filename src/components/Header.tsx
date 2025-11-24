'use client';

import Link from 'next/link';
import { Glasses, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { CartSheet } from './CartSheet';
import { useState } from 'react';
import { SidebarTrigger } from './ui/sidebar';
import { usePathname } from 'next/navigation';

export function Header() {
  const { itemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Glasses className="h-6 w-6 text-primary" />
            <span className="inline-block font-headline text-xl font-bold">
              Visionary Vault
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {isHomePage && (
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open shopping cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
      <CartSheet isOpen={isCartOpen} onOpenChange={setIsCartOpen} />
    </header>
  );
}
