import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
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

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = ((formData.get('search') as string) ?? '').trim();
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
    } catch (err) {
      toast.error('Could not fetch a random recipe. Please try again.');
    } finally {
      setRandomLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={navigateToHome}
            className="text-lg font-semibold tracking-tight text-left"
          >
            Recipes
          </button>
          <div className="sm:hidden">
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-1 sm:flex-row sm:items-center sm:gap-4">
          <form className="flex flex-1 items-center gap-2" onSubmit={onSubmit} role="search">
            <label htmlFor="search" className="sr-only">
              Search recipes
            </label>
            <Input
              id="search"
              name="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search recipes..."
              aria-label="Search recipes"
            />
            <Button type="submit" variant="secondary" className="w-full sm:w-auto">
              Search
            </Button>
          </form>
          <nav className="flex items-center gap-2" aria-label="Main navigation">
            <Button
              variant="secondary"
              className="flex-1 sm:flex-none sm:w-auto sm:border sm:border-border sm:bg-transparent sm:text-foreground sm:hover:bg-accent sm:hover:text-accent-foreground"
              onClick={handleRandom}
              disabled={randomLoading}
              aria-label="Get a random recipe"
            >
              Random
            </Button>
            <Button
              variant="secondary"
              className="flex-1 sm:flex-none sm:w-auto sm:border sm:border-border sm:bg-transparent sm:text-foreground sm:hover:bg-accent sm:hover:text-accent-foreground"
              onClick={() => {
                if (location.pathname === '/favorites') {
                  navigate('/', { replace: true });
                } else {
                  navigate('/favorites');
                }
              }}
            >
              Favorites
            </Button>
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
