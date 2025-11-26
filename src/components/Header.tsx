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
  const isHomePage = pathname === '/';
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery === '') {
      // If the query is empty, navigate to the homepage, removing any existing query params
      router.push('/');
    } else {
      router.push(`/?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };


  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 md:gap-10">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <Link href="/" className="hidden sm:flex items-center space-x-2">
            <Glasses className="h-6 w-6 text-primary" />
            <span className="inline-block font-headline text-xl font-bold">
              Technoii
            </span>
          </Link>
           <nav className="hidden gap-6 md:flex">
             <Link
              href="/"
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
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end md:justify-center gap-2">
          <div className="w-full max-w-xs sm:max-w-sm">
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
