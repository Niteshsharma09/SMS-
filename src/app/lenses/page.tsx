'use client';

import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LensOptions } from "@/components/LensOptions";

type LensCategory = {
  title: 'Zero Power' | 'Single Vision' | 'Progressive' | 'Bifocal';
  description: string;
  imageId: string;
};

const lensCategories: LensCategory[] = [
  {
    title: 'Zero Power',
    description: 'For fashion or screen protection without correction.',
    imageId: 'lens-3',
  },
  {
    title: 'Single Vision',
    description: 'For correcting a single field of vision (near or far).',
    imageId: 'lens-1',
  },
  {
    title: 'Progressive',
    description: 'Seamlessly transition between multiple distances.',
    imageId: 'lens-progressive',
  },
  {
    title: 'Bifocal',
    description: 'Two distinct optical powers in one lens.',
    imageId: 'lens-bifocal',
  },
];

export default function LensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<LensCategory | null>(null);

  const handleCardClick = (category: LensCategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  }

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
              <LensCard key={category.title} category={category} onClick={() => handleCardClick(category)} isSmall />
            ))}
          </div>
          {lensCategories.slice(2).map((category) => (
             <LensCard key={category.title} category={category} onClick={() => handleCardClick(category)} />
          ))}
        </div>
      </div>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl text-center mb-2">{selectedCategory?.title}</DialogTitle>
             {selectedCategory && <p className="text-sm text-muted-foreground text-center">{selectedCategory.description}</p>}
          </DialogHeader>
          {selectedCategory && <LensOptions lensType={selectedCategory.title} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LensCard({ category, isSmall = false, onClick }: { category: LensCategory; isSmall?: boolean; onClick: () => void; }) {
    const image = PlaceHolderImages.find(img => img.id === category.imageId);
    return (
    <div
        onClick={onClick}
        className={cn(
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