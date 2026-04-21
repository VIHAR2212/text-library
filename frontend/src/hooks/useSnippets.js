import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchSnippets } from '../lib/api';

/**
 * Custom hook for managing the snippets list with search + infinite scroll
 */
export function useSnippets(search = '') {
  const [snippets, setSnippets] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  // Reset and refetch when search changes
  useEffect(() => {
    setSnippets([]);
    setPage(1);
    setTotalPages(1);
    load(search, 1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const load = useCallback(async (q, pg, fresh = false) => {
    // Cancel previous request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    if (fresh) setLoading(true);
    else setLoadingMore(true);
    setError(null);

    try {
      const data = await fetchSnippets({ search: q, page: pg, limit: 12 });
      setSnippets(prev => (fresh ? data.snippets : [...prev, ...data.snippets]));
      setTotalPages(data.pagination.pages);
    } catch (e) {
      if (e.name !== 'AbortError') setError(e.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (page < totalPages && !loadingMore) {
      const next = page + 1;
      setPage(next);
      load(search, next, false);
    }
  }, [page, totalPages, loadingMore, search, load]);

  const prependSnippet = useCallback((snippet) => {
    setSnippets(prev => [snippet, ...prev]);
  }, []);

  return {
    snippets,
    loading,
    loadingMore,
    error,
    hasMore: page < totalPages,
    loadMore,
    prependSnippet,
  };
}
