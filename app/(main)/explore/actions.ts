'use server';
import { searchParamsSchema, search, type SearchParams } from '@/lib/search';

export async function searchAction(input: SearchParams) {
  const validation = searchParamsSchema.safeParse(input);

  if (!validation.success) return { query: input.query, results: [] };

  const searchResults = await search(validation.data);

  return searchResults;
}
