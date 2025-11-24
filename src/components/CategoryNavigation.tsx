'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

type Category = 'frames' | 'lenses' | 'sunglasses';

const categories: { name: Category, imageId: string, title: string, description: string }[] = [
  { name: 'frames', imageId: 'frame-1', title: 'Frames', description: 'Classic & modern styles' },
  { name: 'lenses', imageId: 'lens-1', title: 'Lenses', description: 'For every vision need' },
  { name: 'sunglasses', imageId: 'sun-1', title: 'Sunglasses', description: 'Protection & style' },
];

interface CategoryNavigationProps {
    onSelectCategory: (category: Category | null) => void;
    selectedCategory?: string;
}

export function CategoryNavigation({ onSelectCategory, selectedCategory }: CategoryNavigationProps) {
  return (
    <section className="py-8 md:py-12 bg-muted/30 border-y">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => {
             const image = PlaceHolderImages.find((img) => img.id === category.imageId);
             const isSelected = selectedCategory === category.name;
             return (
                <div
                    key={category.name}
                    onClick={() => onSelectCategory(isSelected ? null : category.name)}
                    className={cn(
                        "relative group overflow-hidden rounded-lg cursor-pointer flex flex-col justify-end p-6 text-white bg-slate-900 h-48 transition-all duration-300",
                        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    )}
                >
                    {image && (
                      <Image
                        src={image.imageUrl}
                        alt={category.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 opacity-40 group-hover:opacity-50"
                        data-ai-hint={image.imageHint}
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    <div className="relative z-10">
                        <h3 className="font-headline font-semibold text-2xl">{category.title}</h3>
                        <p className="text-sm text-neutral-300">{category.description}</p>
                        <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary-foreground/90">
                            <span>{isSelected ? 'View All' : 'Shop Now'}</span>
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                    </div>
                </div>
             )
          })}
        </div>
      </div>
    </section>
  );
}
