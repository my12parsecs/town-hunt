
"use client"

import { useQuery } from '@tanstack/react-query';

export const useSession = () => {
  const { data, status, error } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/session`, {
        credentials: 'include', // Important! For sending cookies
      });
      return res.json();
    },
  });

  return {
    session: data,
    isLoading: status === 'loading',
    status,
    error,
  };
};
