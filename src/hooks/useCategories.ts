// hooks/useCategories.ts
import { useEffect, useState } from "react";
import { getCategories } from "../api/categoryApi";

// Define the Category type here (or import from a shared types file)
export interface Category {
  id: number;
  name: string;
  description?: string;
  // other fields as needed
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(res => {
        // Normalize response
        const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
        setCategories(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
};