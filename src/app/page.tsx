'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';
import Image from 'next/image';
import { Product, brands as allBrands, types as allTypes, styles as allStyles, lensStyles as allLensStyles, products as fallbackProducts } from '@/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilters } from '@/components/ProductFilters';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryNavigation } from '@/components/CategoryNavigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { LensSelectionModal } from '@/components/LensSelectionModal';
import { LensOption } from '@/components/LensOptions';
import { useCart } from '@/context/cart-context';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';

export type Filters = {
  type: string[];
  brand: string[];
  style: string[];
  lensStyle: string[];
};

const BrandShowcaseModal = ({ open, onOpenChange, onBrandSelect, title, description, brands }: { open: boolean, onOpenChange: (open: boolean) => void, onBrandSelect: (brand: string) => void, title: string, description: string, brands: string[] }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl text-center mb-2">{title}</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground text-center">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
                    {brands.map(brand => (
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
  
  const firestore = useFirestore();
  const productsCollection = useMemo(() => {
      if (!firestore) return null;
      return query(collection(firestore, 'products'));
  }, [firestore]);

  const { data: firestoreProducts, isLoading: areProductsLoading } = useCollection<Product>(productsCollection);

  const products = useMemo(() => {
    if (firestoreProducts && firestoreProducts.length > 0) {
      return firestoreProducts;
    }
    return fallbackProducts;
  }, [firestoreProducts]);
  
  const [filters, setFilters] = useState<Filters>({
    type: initialCategory ? [initialCategory] : [],
    brand: [],
    style: [],
    lensStyle: [],
  });
  const [isSunglassBrandModalOpen, setIsSunglassBrandModalOpen] = useState(false);
  const [isLensModalOpen, setIsLensModalOpen] = useState(false);
  const { addToCart } = useCart();


  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setFilters(prev => ({ ...prev, type: [category] }));
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const { type, brand, style, lensStyle } = filters;
        
        const matchesSearch = searchQuery
          ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        if (!matchesSearch) return false;
        
        if (type.length > 0 && !type.includes(product.type)) {
          return false;
        }

        if (brand.length > 0 && !brand.includes(product.brand)) {
          return false;
        }

        if (product.type !== 'lenses' && style.length > 0 && !style.includes(product.style)) {
            return false;
        }

        if (product.type === 'lenses' && lensStyle.length > 0 && !lensStyle.includes(product.style)) {
            return false;
        }
        
        return true;
      });
  }, [filters, searchQuery, products]);
  
  const handleCategorySelect = (category: 'frames' | 'lenses' | 'sunglasses' | null) => {
    if (category === 'frames') {
        setFilters(prev => ({
            ...prev,
            type: ['frames'],
            brand: [],
        }));
    } else if (category === 'lenses') {
        setIsLensModalOpen(true);
    } else if (category === 'sunglasses') {
        setIsSunglassBrandModalOpen(true);
    } else {
        setFilters(prev => ({
            ...prev,
            type: [],
            brand: [],
        }));
    }
  };

  const handleSunglassBrandSelectFromModal = (brand: string) => {
      setFilters({
          type: ['sunglasses'],
          brand: [brand],
          style: [],
          lensStyle: []
      });
      setIsSunglassBrandModalOpen(false);
  }

  const handleLensSelectFromModal = (lensOption: LensOption) => {
    const lensProduct: Product | undefined = products.find(p => p.style === lensOption.title);

    const lensPackageProduct: Product = {
      id: `lens-pkg-${lensOption.title.replace(/\s+/g, '-')}`,
      name: `${lensOption.title} Lenses`,
      price: lensOption.price,
      description: lensOption.features.join(', '),
      type: 'lenses',
      brand: 'Visionary',
      style: lensProduct?.style || 'Single Vision',
      material: 'Polycarbonate',
      imageId: lensProduct?.imageId || 'lens-1',
    };
    
    addToCart(lensPackageProduct);
    setIsLensModalOpen(false);
  };


  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-1');

  const dynamicBrands = useMemo(() => [...new Set(products.map(p => p.brand))], [products]);
  const sunglassBrands = useMemo(() => [...new Set(products.filter(p => p.type === 'sunglasses').map(p => p.brand))], [products]);
  const dynamicStyles = useMemo(() => [...new Set(products.filter(p => p.type !== 'lenses').map(p => p.style))], [products]);
  const filterTypes = ['frames', 'lenses', 'sunglasses'];
  const dynamicLensStyles = useMemo(() => [...new Set(products.filter(p => p.type === 'lenses').map(p => p.style))], [products]);

  if (areProductsLoading && (!firestoreProducts || firestoreProducts.length === 0)) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar>
        <ProductFilters 
          filters={filters} 
          setFilters={setFilters}
          brands={dynamicBrands}
          styles={dynamicStyles}
          types={filterTypes}
          lensStyles={dynamicLensStyles}
        />
      </Sidebar>
      <SidebarInset>
        <BrandShowcaseModal 
            open={isSunglassBrandModalOpen}
            onOpenChange={setIsSunglassBrandModalOpen}
            onBrandSelect={handleSunglassBrandSelectFromModal}
            title="Shop Sunglasses By Brand"
            description="Discover stylish sunglasses from leading brands."
            brands={sunglassBrands}
        />
        <Dialog open={isLensModalOpen} onOpenChange={setIsLensModalOpen}>
            <LensSelectionModal onLensSelect={handleLensSelectFromModal} products={products || []} />
        </Dialog>
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
              <div className="text-center py-16 flex flex-col items-center justify-center">
                <p className="text-xl text-muted-foreground">
                  {areProductsLoading ? 'Loading products...' : (searchQuery ? `No products found for "${searchQuery}".` : "No products found matching your criteria.")}
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
            <div className="flex items-center justify-between p-2 mb-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-16" />
            </div>
            <div className="space-y-2 p-2">
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
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-10 w-full mt-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  )
}
