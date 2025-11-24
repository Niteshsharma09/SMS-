'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { products, Product } from '@/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilters } from '@/components/ProductFilters';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';

export type Filters = {
  type: string[];
  brand: string[];
  style: string[];
};

export default function Home() {
  const [filters, setFilters] = useState<Filters>({
    type: [],
    brand: [],
    style: [],
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const { type, brand, style } = filters;
      if (type.length > 0 && !type.includes(product.type)) {
        return false;
      }
      if (brand.length > 0 && !brand.includes(product.brand)) {
        return false;
      }
      if (style.length > 0 && !style.includes(product.style)) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-1');

  return (
    <div className="flex min-h-screen">
      <Sidebar>
        <ProductFilters filters={filters} setFilters={setFilters} />
      </Sidebar>
      <SidebarInset>
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

          <div className="p-4 md:p-8">
            <h2 className="font-headline text-3xl font-semibold mb-6">
              Our Collection
            </h2>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </div>
  );
}
