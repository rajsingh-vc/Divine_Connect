import { useCallback, useEffect, useState } from "react";
import { fetchGalleryItems, type GalleryItem } from "@/lib/gallery-data";

export function useGalleryItems() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchGalleryItems();
      setItems(data);
    } catch (e) {
      setError("Could not load gallery. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = (item: GalleryItem) => setItems((prev) => [item, ...prev]);
  const removeItems = (ids: string[]) =>
    setItems((prev) => prev.filter((i) => !ids.includes(i.id)));

  return { items, isLoading, error, refresh, addItem, removeItems };
}