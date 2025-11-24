'use client';

import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

type LensCategory = {
  title: string;
  description: string;
  imageId: string;
  gridSpan: number;
};

const lensCategories: LensCategory[] = [
  {
    title: 'Zero Power',
    description: 'For fashion or screen protection without correction.',
    imageId: 'lens-3',
    gridSpan: 1,
  },
  {
    title: 'Single Vision',
    description: 'For correcting a single field of vision (near or far).',
    imageId: 'lens-1',
    gridSpan: 1,
  },
  {
    title: 'Progressive',
    description: 'Seamlessly transition between multiple distances.',
    imageId: 'lens-progressive',
    gridSpan: 2,
  },
  {
    title: 'Bifocal',
    description: 'Two distinct optical powers in one lens.',
    imageId: 'lens-bifocal',
    gridSpan: 2,
  },
];

export default function LensesPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-headline font-bold sm:text-5xl md:text-6xl">
            Choose Your Lens
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Find the perfect lens type to match your prescription and lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {lensCategories.slice(0, 2).map((category) => (
              <LensCard key={category.title} category={category} isSmall />
            ))}
          </div>
          {lensCategories.slice(2).map((category) => (
             <LensCard key={category.title} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LensCard({ category, isSmall = false }: { category: LensCategory; isSmall?: boolean }) {
    const image = PlaceHolderImages.find(img => img.id === category.imageId);
    return (
    <div className={cn(
        "relative group overflow-hidden rounded-lg cursor-pointer flex flex-col justify-end p-6 text-white bg-slate-900",
        isSmall ? "h-48" : "h-96"
    )}>
      {image && (
          <Image
            src={image.imageUrl}
            alt={category.title}
            fill
            className={cn(
                "object-cover transition-transform duration-500 ease-in-out group-hover:scale-105",
                 isSmall ? "" : "opacity-30 group-hover:opacity-40"
            )}
            data-ai-hint={image.imageHint}
          />
      )}
       <div className={cn("absolute inset-0", isSmall ? "bg-gradient-to-t from-black/60 to-transparent" : "bg-black/40")}></div>

      <div className="relative z-10 transition-transform duration-300 ease-in-out group-hover:translate-y-[-8px]">
        <h3 className={cn("font-headline font-semibold", isSmall ? "text-2xl" : "text-4xl")}>{category.title}</h3>
        <p className={cn("mt-2", isSmall ? "text-sm" : "text-base", "text-neutral-300 max-w-md")}>{category.description}</p>
        <div className="mt-4">
            <div className="inline-flex items-center gap-2 text-primary font-semibold">
                Select Lens <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
        </div>
      </div>
    </div>
  );
}