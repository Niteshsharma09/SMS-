'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/cart-context';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const image = PlaceHolderImages.find((img) => img.id === product.imageId);

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <Link href={`/product/${product.id}`}>
          <div className="relative aspect-[4/3] w-full">
            {image && (
              <Image
                src={image.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                data-ai-hint={image.imageHint}
              />
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <Link href={`/product/${product.id}`} className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{product.brand}</p>
            <CardTitle className="font-headline text-lg tracking-normal leading-snug hover:underline">{product.name}</CardTitle>
        </Link>
        <p className="mt-2 text-xl font-semibold text-primary">
          Rs{product.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={() => addToCart(product)}>
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
