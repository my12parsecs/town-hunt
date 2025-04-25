"use server"

import { cookies } from 'next/headers'

export async function Logout(){  
    (await cookies()).delete('session_token')
}