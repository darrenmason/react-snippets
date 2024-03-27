import { useState, useEffect } from "react";

export default function useApi(url) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function getData(url) {
    setIsLoading(true);
    try {
      await fetch(url)
        .then((res) => res.json())
        .then((data) => setData(data));
    } catch (err) {
      setError(err);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getData(url);
  }, []);

  return { data, isLoading, error };
}
