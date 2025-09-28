import { cn } from '../lib/utils';
import { useEffect } from 'react';

interface CategoryChipsProps {
  categories: string[];
  activeCategory?: string;
  onSelect: (category: string) => void;
  onCategoriesLoaded?: (categories: string[]) => void;
}

export function CategoryChips({ categories, activeCategory, onSelect, onCategoriesLoaded }: CategoryChipsProps) {
  useEffect(() => {
    onCategoriesLoaded?.(categories);
  }, [onCategoriesLoaded, categories]);

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          type="button"
          key={category}
          onClick={() => onSelect(category)}
          className={cn(
            'rounded-full border px-4 py-1 text-sm transition-colors focus:outline-none focus-visible:ring-2',
            activeCategory === category ? 'bg-brand text-white' : 'bg-muted text-muted-foreground hover:bg-brand/10',
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
