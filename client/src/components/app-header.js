import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { toast } from './ui/sonner';
export function AppHeader() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [searchValue, setSearchValue] = useState(searchParams.get('q') ?? '');
    const [randomLoading, setRandomLoading] = useState(false);
    useEffect(() => {
        setSearchValue(searchParams.get('q') ?? '');
    }, [searchParams]);
    const onSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const query = (formData.get('search') ?? '').trim();
        const next = new URLSearchParams();
        if (query) {
            next.set('q', query);
        }
        const search = next.toString();
        navigate({ pathname: '/', search: search ? `?${search}` : '' }, { replace: location.pathname === '/' });
    };
    const navigateToHome = () => {
        navigate('/', { replace: location.pathname === '/' });
    };
    const handleRandom = async () => {
        try {
            setRandomLoading(true);
            const data = await api.getRandomMeal();
            const id = data.meals?.[0]?.idMeal;
            if (!id) {
                throw new Error('No meal returned');
            }
            navigate(`/meal/${id}`);
        }
        catch (err) {
            toast.error('Could not fetch a random recipe. Please try again.');
        }
        finally {
            setRandomLoading(false);
        }
    };
    return (_jsx("header", { className: "sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60", children: _jsxs("div", { className: "mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx("button", { type: "button", onClick: navigateToHome, className: "text-lg font-semibold tracking-tight text-left", children: "Recipes" }), _jsx("div", { className: "sm:hidden", children: _jsx(ThemeToggle, {}) })] }), _jsxs("div", { className: "flex flex-col gap-3 sm:flex-1 sm:flex-row sm:items-center sm:gap-4", children: [_jsxs("form", { className: "flex flex-1 items-center gap-2", onSubmit: onSubmit, role: "search", children: [_jsx("label", { htmlFor: "search", className: "sr-only", children: "Search recipes" }), _jsx(Input, { id: "search", name: "search", value: searchValue, onChange: (event) => setSearchValue(event.target.value), placeholder: "Search recipes...", "aria-label": "Search recipes" }), _jsx(Button, { type: "submit", variant: "secondary", className: "w-full sm:w-auto", children: "Search" })] }), _jsxs("nav", { className: "flex items-center gap-2", "aria-label": "Main navigation", children: [
                            _jsx(Button, { variant: "secondary", className: "flex-1 sm:flex-none sm:w-auto sm:border sm:border-border sm:bg-transparent sm:text-foreground sm:hover:bg-accent sm:hover:text-accent-foreground", onClick: handleRandom, disabled: randomLoading, "aria-label": "Get a random recipe", children: "Random" }),
                            _jsx(Button, { variant: "secondary", className: "flex-1 sm:flex-none sm:w-auto sm:border sm:border-border sm:bg-transparent sm:text-foreground sm:hover:bg-accent sm:hover:text-accent-foreground", onClick: () => {
                                        if (location.pathname === '/favorites') {
                                            navigate('/', { replace: true });
                                        }
                                        else {
                                            navigate('/favorites');
                                        }
                                    }, children: "Favorites" }), _jsx("div", { className: "hidden sm:block", children: _jsx(ThemeToggle, {}) })] })] })] }) }));
}
