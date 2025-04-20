
// NORMAL IMPLEMENTATION
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function Provider({ children }) {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}


// SSR IMPLEMENTATION
// 'use client'
// import {
//   isServer,
//   QueryClient,
//   QueryClientProvider,
// } from '@tanstack/react-query'

// function makeQueryClient() {
//   return new QueryClient({
//     defaultOptions: {
//       queries: {
//         staleTime: 60 * 1000,
//       },
//     },
//   })
// }

// let browserQueryClient = undefined

// function getQueryClient() {
//   if (isServer) {
//     return makeQueryClient()
//   } else {
//     if (!browserQueryClient) browserQueryClient = makeQueryClient()
//     return browserQueryClient
//   }
// }

// export default function Provider({ children }) {
//   const queryClient = getQueryClient()
//   return (
//     <QueryClientProvider client={queryClient}>
//       {children}
//     </QueryClientProvider>
//   )
// }
