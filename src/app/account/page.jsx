

import Link from "next/link";
import { cookies } from 'next/headers'

const BACKEND_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_DOMAIN

export default async function Account() {
    const cookieStore = await cookies()
    const token = cookieStore.get('session_token')?.value

    let sessionData = []

    try {
    const session = await fetch(`${BACKEND_DOMAIN}/session`, {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
    })
    if (session.ok) {
        const json = await session.json()
        // sessionData = Array.isArray(json) ? json : []
        sessionData = json
    }
    } catch (error) {
    console.error('Fetch error:', error)
    }
    
  return (
    <div className="account-page" style={{width: "100%", maxWidth: "500px", margin: "auto"}}>
        <br />
        <Link href="/">Back to Home</Link>
        <br />
        <br />
        {sessionData?.googleId ? (
            <div>
                <img src={sessionData?.image} style={{width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "gray"}}></img>
                <p>{sessionData?.email}</p>
                <p>{sessionData?.name}</p>
            </div>
        ) : (
        <div>
            <p>Not logged in</p>
            <br />
            <Link href={`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/google`}>Login</Link>
        </div>
        )}


    </div>
  )
}