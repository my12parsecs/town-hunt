import { cookies } from "next/headers";
import getFlagEmoji from "../components/GetFlagEmoji";
import MapRender from "../components/MapRender";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCircleInfo, faPlus, faPen, faCheck, faTrash, faMagnifyingGlass, faFilter, faSort, faMap, faBars, faAngleDown, faAngleUp, faArrowDown, faArrowRight, faPlane } from "@fortawesome/free-solid-svg-icons";

const BACKEND_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_DOMAIN;

export default async function Map() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  let data = [];

  const res = await fetch(`${BACKEND_DOMAIN}/places`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // send token as a Bearer token
    },
    credentials: "include", // only needed if you’re using cookies, can omit otherwise
  });
  const responseData = await res.json();
  if (!responseData.error || responseData.error !== "Invalid token") {
    data = responseData;
  }

  return (
    <div>
      <MapRender placeList={data} />
    </div>
  );
}
