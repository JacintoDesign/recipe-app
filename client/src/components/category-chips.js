import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../lib/utils';
import { useEffect } from 'react';
export function CategoryChips({ categories, activeCategory, onSelect, onCategoriesLoaded }) {
    useEffect(() => {
        onCategoriesLoaded?.(categories);
    }, [onCategoriesLoaded, categories]);
    return (_jsx("div", { className: "flex flex-wrap gap-2", children: categories.map((category) => (_jsx("button", { type: "button", onClick: () => onSelect(category), className: cn('rounded-full border px-4 py-1 text-sm transition-colors focus:outline-none focus-visible:ring-2', activeCategory === category ? 'bg-brand text-white' : 'bg-muted text-muted-foreground hover:bg-brand/10'), children: category }, category))) }));
}
