
"use client"

import Link from "next/link";
import { useSession } from "../components/Session"

export default function Account() {
    const {session, isLoading, status, error} = useSession()
    console.log(session);
    

  return (
    <div className="account-page" style={{width: "100%", maxWidth: "500px", margin: "auto"}}>
        <br />
        <Link href="/">Back to Home</Link>
        <br />
        <br />
        {session?.googleId ? (
            <div>
                <img src={session?.image} style={{width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "gray"}}></img>
                <p>{session?.email}</p>
                <p>{session?.name}</p>
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