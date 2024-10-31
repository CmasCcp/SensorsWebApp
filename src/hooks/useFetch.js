import { useEffect, useState } from "react";

export const useFetch = (apiUrl) => {
  const [url, setUrl] = useState(apiUrl);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(url,{
          headers:{
            accept: 'application/json',
            'User-agent': 'learning app',
          }
        });
        const responseData = await response.json();
        setData(responseData);
        setIsLoading(false);
        setHasError(null);
      } catch (error) {
        setIsLoading(false);
        setHasError(error);
      }
    };

    fetchData();
  }, [url]);

  return { data, isLoading, hasError, setUrl };
};