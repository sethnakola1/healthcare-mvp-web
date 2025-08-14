import { useState, useEffect } from 'react';

export const useApi = (url: string) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    // Fetch data logic
  }, [url]);
  return { data };
};