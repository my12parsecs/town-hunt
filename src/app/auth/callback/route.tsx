

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







// 'use client'

// import { useEffect } from 'react'
// import { useRouter } from 'next/navigation'

// export default function AuthCallback() {
//   const router = useRouter()

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search)
//     const token = params.get('token')
//     if (token) {
//       // localStorage.setItem('session_token', token)
//       router.push('/')
//     }
//   }, [router])

//   return <div></div>
// }





// app/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  // Get the token from the URL search params
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  
  if (!token) {
    // Redirect to login page or show an error if no token is provided
    return NextResponse.redirect(new URL('/login?error=no_token', request.url));
  }

  const cookieStore = await cookies()
  
  try {
    // Store the token in a cookie
    // You can adjust maxAge, httpOnly, secure, etc. based on your requirements
    cookieStore.set({
      name: 'session_token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    
    // Redirect the user to the intended destination after successful login
    // This could be the dashboard or homepage
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Auth callback error:', error);
    
    // Redirect to login page with error
    return NextResponse.redirect(new URL('/login?error=auth_error', request.url));
  }
}