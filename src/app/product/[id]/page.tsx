'use client';

import { useState, useMemo, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { ShoppingCart, Sparkles, Star, Tag, CheckSquare, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VirtualTryOn } from '@/components/VirtualTryOn';
import { cn } from '@/lib/utils';
import { LensSelectionModal } from '@/components/LensSelectionModal';
import { LensOption } from '@/components/LensOptions';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Product, getProductById } from '@/lib/products';
import { Skeleton } from '@/components/ui/skeleton';

function ProductPageSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl py-8 px-4 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-2 overflow-x-auto">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-md flex-shrink-0" />
            ))}
          </div>
          <div className="flex-1">
            <Skeleton className="aspect-square w-full rounded-lg" />
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-10 w-1/3" />
          <div className="space-y-2 pt-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 flex-1" />
          </div>
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [isLensModalOpen, setIsLensModalOpen] = useState(false);
  const [selectedLens, setSelectedLens] = useState<LensOption | null>(null);
  
  const firestore = useFirestore();
  const productDocRef = useMemo(() => {
    if (!firestore || !params.id) return null;
    return doc(firestore, `products/${params.id}`);
  }, [firestore, params.id]);

  const { data: firestoreProduct, isLoading: isProductLoading } = useDoc<Product>(productDocRef);
  const { addToCart } = useCart();
  const router = useRouter();

  const product = useMemo(() => {
    if (firestoreProduct) {
      return firestoreProduct;
    }
    // Fallback to local data if Firestore data is not available
    return getProductById(params.id);
  }, [firestoreProduct, params.id]);
  
  const image = useMemo(() => {
      if (!product) return null;
      return PlaceHolderImages.find((img) => img.id === product.imageId);
  }, [product]);

  const [activeImage, setActiveImage] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (image && !activeImage) {
      setActiveImage(image.imageUrl);
    }
  }, [image, activeImage]);

  useEffect(() => {
    // If after loading, there is no firestore product and no fallback, then 404
    if (!isProductLoading && !product) {
      notFound();
    }
  }, [isProductLoading, product])


  if (isProductLoading && !product) {
    return <ProductPageSkeleton />;
  }
  
  if (!product) {
     // This will be caught by the useEffect above, but as an extra safe guard
    return <ProductPageSkeleton />;
  }

  const galleryImages = image ? [image, image, image, image] : [];

  const [zoom, setZoom] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };
  
  const handleLensSelect = (lens: LensOption) => {
    setSelectedLens(lens);
    setIsLensModalOpen(false);
  };

  const handleAddToCart = () => {
    addToCart(product, 1, selectedLens || undefined);
  };

  const handleBuyNow = () => {
    addToCart(product, 1, selectedLens || undefined);
    router.push('/checkout');
  };
  
  const totalCost = product.price + (selectedLens?.price || 0);

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
             <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
                {galleryImages.map((img, index) => (
                    <div 
                      key={index} 
                      className={`relative w-20 h-20 rounded-md border-2 cursor-pointer overflow-hidden flex-shrink-0 ${activeImage === img.imageUrl ? 'border-primary' : 'border-transparent'}`}
                      onClick={() => setActiveImage(img.imageUrl)}
                    >
                    <Image
                        src={img.imageUrl}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                    />
                    </div>
                ))}
            </div>
             <div 
              className="flex-1 relative aspect-square w-full overflow-hidden rounded-lg shadow-lg"
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={handleMouseMove}
             >
                {activeImage && (
                    <Image
                    src={activeImage}
                    alt={product.name}
                    fill
                    className={cn(
                        "object-cover transition-transform duration-300 ease-in-out",
                        zoom ? "scale-[2]" : "scale-100"
                    )}
                    style={{
                        transformOrigin: `${position.x}% ${position.y}%`,
                    }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    />
                )}
            </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold">{product.brand}</h1>
          <p className="mt-1 text-lg md:text-xl text-muted-foreground">{product.name}</p>
          
          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current opacity-50" />
            </div>
            <span className="text-sm text-muted-foreground">4.6 Ratings</span>
          </div>

          <div className="mt-4 text-3xl font-semibold text-primary">
            {selectedLens && <span className="text-lg text-muted-foreground font-normal">Total: </span>}
            Rs{totalCost.toFixed(2)}
          </div>
          {selectedLens && (
            <div className="text-sm text-muted-foreground">
                (Frame: Rs{product.price.toFixed(2)} + Lens: Rs{selectedLens.price.toFixed(2)})
            </div>
          )}


          <div className="mt-6">
            <h3 className="font-semibold text-lg flex items-center gap-2"><Tag className="w-5 h-5"/>Available Offers</h3>
            <div className="mt-2 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-green-500"/> Bank Offer 5% Cashback</p>
              <p className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-green-500"/> BLU Screen Lenses Free of Cost</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold text-lg">Description</h3>
            <p className="mt-2 text-muted-foreground">{product.description}</p>
          </div>
          
          {selectedLens && (
            <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
              <div className="flex justify-between items-center">
                 <div>
                    <h4 className="font-semibold">Lens Selected: {selectedLens.title}</h4>
                    <p className="text-sm text-muted-foreground">{selectedLens.features.join(', ')}</p>
                 </div>
                 <Button variant="ghost" size="sm" onClick={() => setSelectedLens(null)}>Change</Button>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Dialog open={isLensModalOpen} onOpenChange={setIsLensModalOpen}>
                <DialogTrigger asChild>
                    <Button size="lg" variant="outline" className="flex-1">
                        <Plus className="mr-2 h-5 w-5" />
                        {selectedLens ? 'Change Lens' : 'Select Lens & Buy'}
                    </Button>
                </DialogTrigger>
                <LensSelectionModal onLensSelect={handleLensSelect} product={product} />
            </Dialog>
            <Button size="lg" className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
           <div className="mt-4">
            <Dialog open={isTryOnOpen} onOpenChange={setIsTryOnOpen}>
              <DialogTrigger asChild>
                <Button size="lg" variant="secondary" className="w-full">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Virtual Try-On
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-[90vh]">
                <DialogHeader>
                  <DialogTitle className="font-headline text-2xl">Virtual Try-On: {product.name}</DialogTitle>
                </DialogHeader>
                <VirtualTryOn frameId={product.id} onExit={() => setIsTryOnOpen(false)} />
              </DialogContent>
            </Dialog>
           </div>
        </div>
      </div>
    </div>
  );
}
