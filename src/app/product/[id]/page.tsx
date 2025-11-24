'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProductById } from '@/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { ShoppingCart, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VirtualTryOn } from '@/components/VirtualTryOn';

export default function ProductPage({ params }: { params: { id: string } }) {
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const product = getProductById(params.id);
  const { addToCart } = useCart();

  if (!product) {
    notFound();
  }

  const image = PlaceHolderImages.find((img) => img.id === product.imageId);

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg">
          {image && (
            <Image
              src={image.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              data-ai-hint={image.imageHint}
            />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="font-headline text-4xl lg:text-5xl font-bold">{product.name}</h1>
          <p className="mt-4 text-3xl font-semibold text-primary">${product.price.toFixed(2)}</p>
          <p className="mt-6 text-lg text-muted-foreground">{product.description}</p>
          
          <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div><span className="font-semibold">Brand:</span> {product.brand}</div>
            <div><span className="font-semibold">Style:</span> {product.style}</div>
            <div><span className="font-semibold">Material:</span> {product.material}</div>
            <div><span className="font-semibold">Type:</span> <span className="capitalize">{product.type}</span></div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="flex-1" onClick={() => addToCart(product)}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Dialog open={isTryOnOpen} onOpenChange={setIsTryOnOpen}>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="flex-1">
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
