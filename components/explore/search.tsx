'use client';

import { searchAction } from '@/app/(main)/explore/actions';
import { SearchResponse } from '@/lib/search';
import { useState, useTransition } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Search as SearchIcon } from 'lucide-react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Route } from 'next';

export default function Search() {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="p-6">
          <SearchIcon size={20} /> Search
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="center">
        <SearchContent />
      </PopoverContent>
    </Popover>
  );
}

function SearchContent() {
  const [query, setQuery] = useState('');
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const debouncedSearch = useDebouncedCallback((currentQuery: string) => {
    setQuery(currentQuery);
    if (currentQuery.trim().length > 1) {
      startTransition(async () => {
        const res = await searchAction({ query: currentQuery, limit: 20 });
        setSearchResponse(res);
      });
    } else {
      setSearchResponse(null);
    }
  }, 300);

  const generatePath = (result: SearchResponse['results'][number]): string => {
    switch (result.type) {
      case 'player':
        return `/players/${result.id}`;
      case 'team':
        return `/teams/${result.id}`;
      case 'user':
        return `/users/${result.label}`;
      default:
        return '/';
    }
  };

  return (
    <Command filter={() => 1} className="w-[400px] text-left">
      <CommandInput
        onValueChange={debouncedSearch}
        placeholder="Search players, users, or teams..."
        autoFocus
      />
      <CommandList>
        {isPending && (
          <div className="text-muted-foreground p-2 text-sm">Searching...</div>
        )}
        {!isPending && searchResponse && searchResponse.results.length === 0 && (
          <CommandEmpty>No results found for &quot;{query}&quot;.</CommandEmpty>
        )}
        {!isPending && searchResponse && searchResponse.results.length > 0 && (
          <CommandGroup heading="Results">
            {searchResponse.results.map((result) => {
              const path = generatePath(result);
              return (
                <CommandItem
                  key={`${result.type}-${result.id}`}
                  value={result.label}
                  onSelect={() => {
                    router.push(path as Route);
                  }}
                >
                  <span>
                    {result.label}
                    <span className="text-muted-foreground ml-2 text-xs">
                      ({result.type})
                    </span>
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
}
