'use client';

import Link from 'next/link';
import { Glasses, ShoppingCart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { CartSheet } from './CartSheet';
import { useState } from 'react';
import { SidebarTrigger } from './ui/sidebar';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from './ui/input';
import { UserNav } from './UserNav';

export function Header() {
  const { itemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    const params = new URLSearchParams(window.location.search);
    if (trimmedQuery) {
      params.set('q', trimmedQuery);
    } else {
      params.delete('q');
    }
    router.push(`${pathname}?${params.toString()}`);
  };


  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <Link href="/" className="flex items-center space-x-2">
            <Glasses className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline-block font-headline text-xl font-bold">
              Technoii
            </span>
          </Link>
          <nav className="hidden gap-4 md:flex">
            <Link
              href="/?category=frames"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Eyewear
            </Link>
            <Link
              href="/lenses"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Lenses
            </Link>
            <Link
              href="/?category=sunglasses"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sunglasses
            </Link>
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="w-full max-w-xs sm:max-w-sm ml-auto">
             <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="w-full pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        
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
          <UserNav />
        </div>
      </div>
      <CartSheet isOpen={isCartOpen} onOpenChange={setIsCartOpen} />
    </header>
  );
}
