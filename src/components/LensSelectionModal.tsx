
'use client';

import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LensOptions, LensOption } from "@/components/LensOptions";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Product } from "@/lib/products";

type LensCategory = {
  title: 'Zero Power' | 'Single Vision' | 'Progressive' | 'Bifocal';
  description: string;
};

const lensCategories: LensCategory[] = [
  {
    title: 'Zero Power',
    description: 'For fashion or screen protection without correction.',
  },
  {
    title: 'Single Vision',
    description: 'For correcting a single field of vision (near or far).',
  },
  {
    title: 'Progressive',
    description: 'Seamlessly transition between multiple distances.',
  },
  {
    title: 'Bifocal',
    description: 'Two distinct optical powers in one lens.',
  },
];


interface LensSelectionModalProps {
    onLensSelect: (lens: LensOption) => void;
    product?: Product; // This is now optional
}

export function LensSelectionModal({ onLensSelect, product }: LensSelectionModalProps) {
    const [step, setStep] = useState<'category' | 'options'>('category');
    const [selectedCategory, setSelectedCategory] = useState<LensCategory | null>(null);

    const handleCategorySelect = (category: LensCategory) => {
        setSelectedCategory(category);
        setStep('options');
    }

    const handleBack = () => {
        setStep('category');
        setSelectedCategory(null);
    }
    
    const handleOptionSelectAndClose = (lensOption: LensOption) => {
        onLensSelect(lensOption);
    }

    return (
        <DialogContent className="sm:max-w-[600px] h-[70vh] flex flex-col">
            {step === 'category' ? (
                <>
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl text-center mb-2">Select Lens Type</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground text-center">Choose the type of lens that fits your needs.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 flex-1 overflow-y-auto">
                        {lensCategories.map(category => (
                            <div key={category.title} onClick={() => handleCategorySelect(category)}
                                className="p-6 border rounded-lg cursor-pointer hover:bg-muted/50 hover:border-primary transition-colors flex flex-col items-center text-center">
                                <h3 className="font-headline text-xl">{category.title}</h3>
                                <p className="text-sm text-muted-foreground mt-2 flex-grow">{category.description}</p>
                                <Button variant="link" className="mt-4">Select</Button>
                            </div>
                        ))}
                    </div>
                </>
            ) : selectedCategory && (
                <div className="flex flex-col h-full">
                    <DialogHeader>
                         <div className="flex items-center justify-center relative mb-2">
                             <Button variant="ghost" size="icon" className="absolute left-0" onClick={handleBack}>
                                 <ArrowLeft className="h-4 w-4" />
                             </Button>
                             <DialogTitle className="font-headline text-2xl text-center">{selectedCategory.title}</DialogTitle>
                         </div>
                         <DialogDescription className="text-sm text-muted-foreground text-center">{selectedCategory.description}</DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 min-h-0 py-4">
                        <LensOptions 
                            lensType={selectedCategory.title} 
                            onClose={() => {}} // Will be handled by onLensSelect now
                            onLensSelect={handleOptionSelectAndClose}
                            product={product}
                        />
                    </div>
                </div>
            )}
        </DialogContent>
    );
}

    