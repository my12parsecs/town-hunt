

import { cookies } from 'next/headers'
import getFlagEmoji from "./components/GetFlagEmoji";
import "./stylesheets/home.css";
import MainPlaceList from './components/MainPlaceList';
import Test from './components/Test';
import ShowToast from './components/ShowToast';


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCircleInfo, faPlus, faPen, faCheck, faTrash, faMagnifyingGlass, faFilter, faSort, faMap, faBars, faAngleDown, faAngleUp, faArrowDown, faArrowRight, faPlane } from "@fortawesome/free-solid-svg-icons";

const BACKEND_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_DOMAIN


export default async function ServerFetch(){
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value

  let data = []

  const res = await fetch(`${BACKEND_DOMAIN}/places`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`  // send token as a Bearer token
    },
    credentials: 'include',  // only needed if you’re using cookies, can omit otherwise
  })
  const responseData = await res.json()
  if (!responseData.error || responseData.error !== "Invalid token") {
    // data = responseData.sort((a, b) => a.sortOrder - b.sortOrder)
    data = responseData
  }


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
    <div>
        <ShowToast />
        {/* <MainPlaceList placeList={data} sessionData={sessionData} token={token} /> */}
        <Test placeList={data} sessionData={sessionData} token={token} />
    </div>
  )
}

