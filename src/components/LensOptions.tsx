'use client';

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

type LensOption = {
    title: string;
    price: number;
    features: string[];
}

const singleVisionOptions: LensOption[] = [
    { title: "Anti-Glare Premium", price: 1200, features: ["6 Months Warranty", "Double Side Anti-Glare", "6 Months Warranty"] },
    { title: "BLU Screen Lenses", price: 1500, features: ["6 Months Warranty", "Crack, Smudge & Scratch Resistant", "Double Side Anti-Glare", "Protects from Digital Rays"] },
    { title: "Thin BLU Screen Lenses", price: 2000, features: ["Thinner & Lighter", "Ideal for High Power", "Includes all BLU Screen features"] },
];

const lensOptionsMap = {
    'Single Vision': singleVisionOptions,
    'Zero Power': [
        { title: "Standard Zero Power", price: 800, features: ["Basic scratch resistance", "UV Protection"] },
        { title: "Zero Power with Blue-Cut", price: 1200, features: ["Protects from Digital Rays", "Anti-Glare Coating", "Smudge Resistant"] }
    ],
    'Progressive': [
        { title: "Standard Progressive", price: 3000, features: ["Smooth transition for all distances", "Basic Anti-Glare"] },
        { title: "Premium Digital Progressive", price: 4500, features: ["Wider field of vision", "Advanced Anti-Glare & Scratch Resistance", "Blue-Cut technology"] }
    ],
    'Bifocal': [
        { title: "Classic Bifocal", price: 1800, features: ["Visible line for distance and near", "Durable and reliable"] },
        { title: "Bifocal with Anti-Glare", price: 2200, features: ["Reduces reflections", "Easier night driving", "Classic bifocal design"] }
    ],
}

interface LensOptionsProps {
    lensType: 'Single Vision' | 'Zero Power' | 'Progressive' | 'Bifocal';
}

export function LensOptions({ lensType }: LensOptionsProps) {
    const options = lensOptionsMap[lensType];

    return (
        <ScrollArea className="h-96 pr-6">
            <div className="space-y-4">
                {options.map((option, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{option.title}</CardTitle>
                                    <p className="font-bold text-primary text-md mt-1">Rs{option.price.toFixed(2)}</p>
                                </div>
                                <Button size="sm">Select</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                                {option.features.map((feature, i) => (
                                    <li key={i}>{feature}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    )
}
