
"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function useSession() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [token, setToken] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Use useEffect to safely access localStorage after component mounts
  useEffect(() => {
    setIsClient(true);
    const storedToken = localStorage.getItem('session_token');
    setToken(storedToken);
  }, []);

  // Helper to get the token - safely checks for client-side
  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('session_token');
  };

  // Helper for authenticated fetch requests
  // const authFetch = async (url, options = {}) => {
  //   const currentToken = typeof window !== 'undefined' ? localStorage.getItem('session_token') : token;
    
  //   const res = await fetch(url, {
  //     ...options,
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: currentToken ? `Bearer ${currentToken}` : '',
  //       ...(options.headers || {}),
  //     }
  //   });
    
  //   if (res.status === 401) {
  //     // Handle unauthorized - clear token and redirect to login
  //     if (typeof window !== 'undefined') {
  //       localStorage.removeItem('session_token');
  //     }
  //     queryClient.clear(); // Clear all query cache
  //     router.push('/login');
  //     throw new Error('Unauthorized');
  //   }
    
  //   if (!res.ok) {
  //     throw new Error('Request failed');
  //   }
    
  //   return res.json();
  // };
  
  // Get current session
  const session = useQuery({
    queryKey: ['session'],
    queryFn: () => fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/session`, {
      credentials: 'include',
    }),
    // retry: false,
    // Only try to fetch if we have a token and we're client-side
    // enabled: isClient && !!token,
  });

  // Logout function
  const logout = useMutation({
    mutationFn: () => fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/logout`, { 
      method: 'POST' ,
      credentials: 'include',
    }),
    onSuccess: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('session_token');
      }
      setToken(null);
      queryClient.clear();
      router.push('/');
      toast.success('Logged out!');
    }
  });
  

  return {
    session: session?.data,
    // session: session?.data?.session,
    // places: session?.data?.places,
    isLoading: session.isLoading || !isClient, // Consider still loading if we're not client-side yet
    isAuthenticated: !!session.data?.authenticated,
    error: session.error,
    logout: logout.mutate,
    // authFetch
  };
}