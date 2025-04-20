

// 'use client'

// import { useEffect } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'

// export default function AuthCallback() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
  
//   useEffect(() => {
//     const token = searchParams.get('token')
//     if (token) {
//       // Store the token in localStorage
//       localStorage.setItem('session_token', token)
      
//       // Redirect to home or dashboard
//       router.push('/')
//     }
//   }, [searchParams, router])

//   return (
//         // <div>Authenticating...</div>
//         <div></div>
//     )
// }

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      localStorage.setItem('session_token', token)
      router.push('/')
    }
  }, [router])

  return <div></div>
}
