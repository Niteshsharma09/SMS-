'use client';

import { brands, styles, types } from '@/lib/products';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel } from './ui/sidebar';
import type { Filters } from '@/app/page';
import { Button } from './ui/button';

interface ProductFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const lensStyles = ['Single Vision', 'Bifocal', 'Progressive', 'Zero Power'];

export function ProductFilters({ filters, setFilters }: ProductFiltersProps) {
  const handleCheckboxChange = (category: keyof Filters, value: string) => {
    setFilters((prevFilters) => {
      const newValues = prevFilters[category].includes(value)
        ? prevFilters[category].filter((v) => v !== value)
        : [...prevFilters[category], value];
      return { ...prevFilters, [category]: newValues };
    });
  };
  
  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0);

  const clearFilters = () => {
    setFilters({ type: [], brand: [], style: [] });
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-2xl">Filters</h2>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>Clear</Button>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Accordion type="multiple" defaultValue={['type', 'brand', 'style']} className="w-full">
            <AccordionItem value="type">
              <AccordionTrigger className="font-semibold">Type</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-2">
                  {types.map((type) => (
                    <div key={type} className="flex items-center gap-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={filters.type.includes(type)}
                        onCheckedChange={() => handleCheckboxChange('type', type)}
                      />
                      <Label htmlFor={`type-${type}`} className="capitalize">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="brand">
              <AccordionTrigger className="font-semibold">Brand</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-2">
                  {brands.map((brand) => (
                    <div key={brand} className="flex items-center gap-2">
                      <Checkbox
                        id={`brand-${brand}`}
                        checked={filters.brand.includes(brand)}
                        onCheckedChange={() => handleCheckboxChange('brand', brand)}
                      />
                      <Label htmlFor={`brand-${brand}`}>{brand}</Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="style">
              <AccordionTrigger className="font-semibold">Style</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-2">
                  {styles.map((style) => (
                    <div key={style} className="flex items-center gap-2">
                      <Checkbox
                        id={`style-${style}`}
                        checked={filters.style.includes(style)}
                        onCheckedChange={() => handleCheckboxChange('style', style)}
                      />
                      <Label htmlFor={`style-${style}`}>{style}</Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}
