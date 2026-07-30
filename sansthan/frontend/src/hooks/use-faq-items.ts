import { useCallback, useEffect, useState } from "react";
import { api, unwrap } from "@/lib/api";

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export function useFaqItems() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get("/content/faqs/", { params: { ordering: "order" } });
      setItems(unwrap<FaqItem>(res.data));
    } catch (err) {
      setError("Failed to load FAQs.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = useCallback(async (payload: Pick<FaqItem, "question" | "answer" | "order" | "is_published">) => {
    const { data } = await api.post("/content/faqs/", payload);
    setItems((prev) => [...prev, data].sort((a, b) => a.order - b.order));
    return data as FaqItem;
  }, []);

  const updateItem = useCallback(async (id: number, payload: Partial<FaqItem>) => {
    const { data } = await api.patch(`/content/faqs/${id}/`, payload);
    setItems((prev) => prev.map((it) => (it.id === id ? data : it)).sort((a, b) => a.order - b.order));
    return data as FaqItem;
  }, []);

  const removeItems = useCallback(async (ids: number[]) => {
    await Promise.all(ids.map((id) => api.delete(`/content/faqs/${id}/`)));
    setItems((prev) => prev.filter((it) => !ids.includes(it.id)));
  }, []);

  return { items, isLoading, error, fetchItems, addItem, updateItem, removeItems };
}