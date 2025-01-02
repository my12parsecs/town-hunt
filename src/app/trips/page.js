// import Link from "next/link"
// import { redirect } from "next/navigation"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

// import "../stylesheets/trips.css"

// export default function Trips() {

//     const addNewTrip = () => {
//         const newTripKey = `town-hunt-trip-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
//         localStorage.setItem(newTripKey, JSON.stringify({title: "Enter Trip Title", startDate: "", trip: []}));
//         redirect(`/trips/${newTripKey}`);
//     }

//     return (
//         <div className="trips-page">
//             {/* <div className="trips-nav"></div> */}
//             <div className="trips-nav">
//                 <div style={{marginTop: "20px", marginBottom: "20px"}}><Link href="/"><FontAwesomeIcon icon={faAngleLeft} style={{width: "20px", height: "20px"}} /></Link></div>
//             </div>

//             <div className="trips-header">
//                 <h1>Trips</h1>
//                 <div className="trips-new-trip-button" onClick={addNewTrip}>New Trip</div>
//             </div>

//             <div className="trips-list">
//                 <Link href="/trips/us-road-trip" className="trips-each">
//                     <div className="trips-title">US Road Trip</div>
//                     <div className="trips-date">Nov13~30</div>
//                     <div className="trips-country">United States, Canada</div>
//                 </Link>
//                 <div className="trips-each">
//                     <div className="trips-title"></div>
//                 </div>
//             </div>
//         </div>
//     )

// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

import "../stylesheets/trips.css";

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Load all trips from localStorage
    const loadTrips = () => {
      const allTrips = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("town-hunt-trip-")) {
          try {
            const tripData = JSON.parse(localStorage.getItem(key));
            allTrips.push({ ...tripData, id: key });
          } catch (error) {
            console.error("Error parsing trip data:", error);
            // Handle corrupted data by removing it
            localStorage.removeItem(key);
          }
        }
      }
      setTrips(allTrips);
    };

    loadTrips();
  }, []);

  const addNewTrip = () => {
    const newTripId = `${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
    const newTripKey = `town-hunt-trip-${newTripId}`;
    const newTrip = {
      title: "Enter Trip Title",
      id: newTripId,
      startDate: "",
      trip: [],
    };
    localStorage.setItem(newTripKey, JSON.stringify(newTrip));
    router.push(`/trips/${newTripKey}`);
  };

  return (
    <div className="trips-page">
      <div className="trips-nav" style={{marginTop: "20px", marginBottom: "20px"}}>
          <Link href="/">
            <FontAwesomeIcon icon={faAngleLeft} className="w-5 h-5" />
          </Link>
      </div>

      <div className="trips-header">
        <h1>Trips</h1>
        <div className="trips-new-trip-button" onClick={addNewTrip}>New Trip</div>
      </div>

      <div className="trips-list">
        {trips.map((trip) => (
          <Link key={trip.id} href={`/trips/${trip.id}`} className="trips-each">
            <div className="trips-title">{trip.title}</div>
            {trip.startDate && <div className="trips-date">{trip.startDate}</div>}
            {trip.country && <div className="trips-country">{trip.country}</div>}
          </Link>
        ))}
        {/* US Road Trip example - you can remove this if not needed */}
        {/* <Link href="/trips/us-road-trip" className="trips-each">
          <div className="trips-title">US Road Trip</div>
          <div className="trips-date">Nov13~30</div>
          <div className="trips-country">United States, Canada</div>
        </Link> */}
      </div>
      {trips.length === 0 && (
          <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100px"}}>
            <div>No Trips</div>
          </div>
      )}
    </div>
  );
};

export default Trips;
