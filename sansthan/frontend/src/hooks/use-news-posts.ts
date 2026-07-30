import { useCallback, useEffect, useState } from "react";
import { fetchNewsPosts, type NewsPost } from "@/lib/news-data";

export function useNewsPosts() {
  const [items, setItems] = useState<NewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchNewsPosts();
      setItems(data);
    } catch (e) {
      setError("Could not load news posts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = (item: NewsPost) => setItems((prev) => [item, ...prev]);

  const updateItem = (item: NewsPost) =>
    setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));

  const removeItems = (ids: string[]) =>
    setItems((prev) => prev.filter((i) => !ids.includes(i.id)));

  return { items, isLoading, error, refresh, addItem, updateItem, removeItems };
}