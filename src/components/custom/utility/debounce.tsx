import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
    const id = setTimeout(() => {
      setDebounced(value);
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(id);
  }, [value, delay]);

  return [debounced, isLoading] as const;
}