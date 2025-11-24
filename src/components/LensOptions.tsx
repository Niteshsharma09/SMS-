'use client';

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

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
    onClose: () => void;
}

interface PrescriptionFormProps {
    lensType: string;
    lensOption: LensOption;
    onBack: () => void;
    onClose: () => void;
}


function PrescriptionForm({ lensType, lensOption, onBack, onClose }: PrescriptionFormProps) {
    return (
        <div className="flex flex-col h-full">
            <h2 className="text-xl font-headline text-center">{lensType} ({lensOption.title})</h2>
            <p className="text-center text-muted-foreground text-sm mt-2 mb-6">
                Upload a prescription for the selected lens type to proceed, or you can manually enter your eye vision details.
            </p>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="prescription-file">Upload Prescription</Label>
                    <Input id="prescription-file" type="file" />
                </div>
                
                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-muted" />
                    <span className="mx-4 text-xs uppercase text-muted-foreground">Or</span>
                    <div className="flex-grow border-t border-muted" />
                </div>
                
                <p className="text-center font-semibold">Manually Enter Eye Vision</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="left-eye">Left Eye (DV-OD)</Label>
                        <Input id="left-eye" placeholder="e.g., -2.00" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="right-eye">Right Eye (DV-OS)</Label>
                        <Input id="right-eye" placeholder="e.g., -1.75" />
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-6 flex justify-end gap-2">
                <Button variant="outline" onClick={onBack}>Back</Button>
                <Button onClick={onClose} variant="secondary">Close</Button>
                <Button>Proceed to Buy</Button>
            </div>
        </div>
    )
}

export function LensOptions({ lensType, onClose }: LensOptionsProps) {
    const [selectedOption, setSelectedOption] = useState<LensOption | null>(null);
    const options = lensOptionsMap[lensType];

    if (selectedOption) {
        return <PrescriptionForm 
                    lensType={lensType} 
                    lensOption={selectedOption} 
                    onBack={() => setSelectedOption(null)}
                    onClose={onClose}
                />
    }

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
                                <Button size="sm" onClick={() => setSelectedOption(option)}>Select</Button>
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
