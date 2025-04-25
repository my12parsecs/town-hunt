
import { cookies } from 'next/headers'
import getFlagEmoji from "../components/GetFlagEmoji";
import "../stylesheets/home.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCircleInfo, faPlus, faPen, faCheck, faTrash, faMagnifyingGlass, faFilter, faSort, faMap, faBars, faAngleDown, faAngleUp, faArrowDown, faArrowRight, faPlane } from "@fortawesome/free-solid-svg-icons";

const BACKEND_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_DOMAIN


export default async function ServerFetch(){
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value

  const res = await fetch(`${BACKEND_DOMAIN}/places`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`  // send token as a Bearer token
    },
    credentials: 'include',  // only needed if you’re using cookies, can omit otherwise
  })

  const data = await res.json()


  const userLanguage = "JP"

  return (
    <div>

        {data?.slice().reverse().map((city, index) => (
            <div className="city-list-container" key={index} style={{maxWidth: "70%"}}>
                <div className="city-list-row">
                    <div className="city-name">
                        <div className="city-cityname">
                        {city.cityName}
                        </div>
                        <div className="city-countryname">
                        {getFlagEmoji(city.countryCode)} {city.countryName}
                        </div>
                    </div>
                    <div className="city-button">
                        <a href={`https://${userLanguage}.wikipedia.org/wiki/${city.cityName}`} target="_blank" rel="noreferrer" className="city-wiki-link">
                        <FontAwesomeIcon icon={faCircleInfo} className="info-icon" />
                        </a>
                        <a href={`https://www.google.com/maps/search/${city.cityName}`} target="_blank" rel="noreferrer" className="city-map-link">
                        <FontAwesomeIcon icon={faLocationDot} className="map-icon" />
                        </a>
                    </div>


                </div>
                {/* {isEditing && (
                <div className="city-delete-container">
                    <div className="city-delete">
                    <FontAwesomeIcon icon={faTrash} className="delete-icon" onClick={() => handleDelete(city)} />
                    </div>
                </div>
                )} */}
            </div>
        ))}

    </div>
  )
}
