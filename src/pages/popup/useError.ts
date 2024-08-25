/* eslint-disable consistent-return */
import { useCallback, useEffect, useState } from 'react';

const useError = () => {
  const [error, setError] = useState<string | null>();

  const onError = useCallback((err: unknown) => {
    console.trace(error);
    setError(String(err));
  }, [error]);

  // hide error after 3s
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => { clearTimeout(timeout); };
    }
  }, [error]);

  return { error, onError };
};

export default useError;
