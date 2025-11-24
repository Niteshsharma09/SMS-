'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';
import Image from 'next/image';
import { products, Product, brands as allBrands } from '@/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilters } from '@/components/ProductFilters';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryNavigation } from '@/components/CategoryNavigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export type Filters = {
  type: string[];
  brand: string[];
  style: string[];
  lensStyle: string[];
};

const BrandShowcaseModal = ({ open, onOpenChange, onBrandSelect }: { open: boolean, onOpenChange: (open: boolean) => void, onBrandSelect: (brand: string) => void }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl text-center mb-2">Shop By Brand</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground text-center">
                        Explore our collection of top-tier frame brands.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
                    {allBrands.map(brand => (
                        <Card key={brand} className="p-4 flex flex-col items-center justify-center text-center hover:bg-muted/50 cursor-pointer" onClick={() => onBrandSelect(brand)}>
                             {/* You can add brand logos here in the future */}
                             <span className="font-semibold text-lg">{brand}</span>
                        </Card>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}

function ProductGrid() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  
  const [filters, setFilters] = useState<Filters>({
    type: initialCategory ? [initialCategory] : [],
    brand: [],
    style: [],
    lensStyle: [],
  });
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);


  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setFilters(prev => ({ ...prev, type: [category] }));
    } else {
      // If no category in URL, you might want to clear the type filter
      // depending on desired behavior. For now, we'll let it persist
      // until manually cleared or changed.
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const { type, brand, style, lensStyle } = filters;
        
        // Search query filter
        const matchesSearch = searchQuery
          ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        if (!matchesSearch) return false;
        
        // Checkbox filters
        if (type.length > 0 && !type.includes(product.type)) {
          return false;
        }

        if (brand.length > 0 && !brand.includes(product.brand)) {
          return false;
        }

        // Handle frame styles
        if (product.type !== 'lenses' && style.length > 0 && !style.includes(product.style)) {
            return false;
        }

        // Handle lens styles, only if 'lenses' type is selected
        if (product.type === 'lenses' && lensStyle.length > 0 && !lensStyle.includes(product.style)) {
            return false;
        }
        
        return true;
      });
  }, [filters, searchQuery]);
  
  const handleCategorySelect = (category: 'frames' | 'lenses' | 'sunglasses' | null) => {
    if (category === 'frames') {
        setIsBrandModalOpen(true);
    } else {
        setFilters(prev => ({
            ...prev,
            type: category ? [category] : [],
            brand: [], // Reset brand filter when changing main category
        }));
    }
  };

  const handleBrandSelectFromModal = (brand: string) => {
      setFilters({
          type: ['frames'],
          brand: [brand],
          style: [],
          lensStyle: []
      });
      setIsBrandModalOpen(false);
  }

  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-1');

  return (
    <div className="flex min-h-screen">
      <Sidebar>
        <ProductFilters filters={filters} setFilters={setFilters} />
      </Sidebar>
      <SidebarInset>
        <BrandShowcaseModal 
            open={isBrandModalOpen}
            onOpenChange={setIsBrandModalOpen}
            onBrandSelect={handleBrandSelectFromModal}
        />
        <div className="flex flex-col">
          <div className="relative h-64 w-full md:h-96">
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
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white p-4">
              <h1 className="font-headline text-4xl md:text-6xl font-bold">
                Find Your Perfect Pair
              </h1>
              <p className="mt-4 text-lg md:text-xl max-w-2xl">
                Explore our curated collection of premium eyewear, crafted for style and clarity.
              </p>
            </div>
          </div>
          
          <CategoryNavigation onSelectCategory={handleCategorySelect} selectedCategory={filters.type[0]} />

          <div className="p-4 md:p-8">
            <h2 className="font-headline text-3xl font-semibold mb-6">
              {searchQuery ? `Search results for "${searchQuery}"` : "Our Collection"}
            </h2>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">
                  {searchQuery ? `No products found for "${searchQuery}".` : "No products found matching your criteria."}
                </p>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </div>
  );
}


export default function Home() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <ProductGrid />
    </Suspense>
  );
}

function HomePageSkeleton() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-1');
  return (
     <div className="flex min-h-screen">
      <Sidebar>
        <div className="p-2">
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-16" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col">
          <div className="relative h-64 w-full md:h-96 bg-muted">
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
          </div>
          <div className="p-4 md:p-8">
            <Skeleton className="h-8 w-1/3 mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  )
}
