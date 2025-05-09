"use client"

import { useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ShowToast() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    
//     useEffect(() => {
//       // Check for toast parameters
//       const toastType = searchParams.get('toast_type');
//       const message = searchParams.get('toast_message');
      
//       if (toastType && message) {
//         const decodedMessage = decodeURIComponent(message);
        
//         // Show toast based on URL parameters
//         if (toastType === 'success') {
//         //   toast.success(decodedMessage);
//             toast.success("Logged in successfully");
//         } else if (toastType === 'error') {
//           toast.error(decodedMessage);
//         } else {
//           toast(decodedMessage);
//         }
        
//         // Clean up URL
//         const params = new URLSearchParams(searchParams);
//         params.delete('toast_type');
//         params.delete('toast_message');
        
//         // If we have other params, keep them; otherwise just use the pathname
//         const newUrl = params.toString() 
//           ? `${pathname}?${params.toString()}` 
//           : pathname;
          
//         // Replace the URL without causing a navigation
//         router.replace(newUrl);
//       }
//     }, []);

useEffect(() => {
    const toastType = searchParams.get('toast_type');
    const message = searchParams.get('toast_message');
  
    if (toastType && message) {
      const decodedMessage = decodeURIComponent(message);
  
      if (toastType === 'success') {
        toast.success(decodedMessage);
      } else if (toastType === 'error') {
        toast.error(decodedMessage);
      } else {
        toast(decodedMessage);
      }
  
      // Delay URL cleanup
      const timeout = setTimeout(() => {
        const params = new URLSearchParams(searchParams);
        params.delete('toast_type');
        params.delete('toast_message');
        const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
        router.replace(newUrl, { scroll: false });
      }, 200); // Match toast duration
  
      // Cleanup timeout on unmount
      return () => clearTimeout(timeout);
    }
  }, [searchParams, pathname, router]);

    return <></>;
}

