import { useEffect, useState } from "react";

export const useFetch = (url) => {
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
        console.log(response);
        const responseData = await response.json();
        setData(responseData.data);
        setIsLoading(false);
        setHasError(null);
      } catch (error) {
        setIsLoading(false);
        setHasError(error);
      }
    };

    fetchData();
  }, [url]);

  return { data, isLoading, hasError };
};