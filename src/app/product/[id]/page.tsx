'use client';

import { useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getProductById } from '@/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { ShoppingCart, Sparkles, Star, Tag, CheckSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VirtualTryOn } from '@/components/VirtualTryOn';
import { cn } from '@/lib/utils';

export default function ProductPage({ params }: { params: { id: string } }) {
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const product = getProductById(params.id);
  const { addToCart } = useCart();
  const router = useRouter();
  
  if (!product) {
    notFound();
  }

  const image = PlaceHolderImages.find((img) => img.id === product.imageId);
  const [activeImage, setActiveImage] = useState(image?.imageUrl);

  // For the gallery, we'll just use the same image 4 times as a placeholder
  const galleryImages = image ? [image, image, image, image] : [];

  const [zoom, setZoom] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };


  return (
    <div className="container mx-auto max-w-7xl py-8 px-4 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="flex flex-row-reverse gap-4">
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
            <div className="flex flex-col gap-2">
            {galleryImages.map((img, index) => (
                <div 
                  key={index} 
                  className={`relative w-20 h-20 rounded-md border-2 cursor-pointer overflow-hidden ${activeImage === img.imageUrl ? 'border-primary' : 'border-transparent'}`}
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
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="font-headline text-4xl lg:text-5xl font-bold">{product.brand}</h1>
          <p className="mt-1 text-xl text-muted-foreground">{product.name}</p>
          
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

          <p className="mt-4 text-3xl font-semibold text-primary">₹{product.price.toFixed(2)}</p>

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

          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div><span className="font-semibold">Frame Color:</span> {product.material}</div>
            <div><span className="font-semibold">Material:</span> {product.material}</div>
            <div><span className="font-semibold">Frame Width:</span> 132mm</div>
            <div><span className="font-semibold">Model No:</span> {product.id}</div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button size="lg" variant="outline" className="flex-1" onClick={() => router.push('/lenses')}>
              Select Lens
            </Button>
            <Button size="lg" className="flex-1" onClick={() => addToCart(product)}>
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
