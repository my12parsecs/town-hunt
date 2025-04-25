// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faAngleLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
// import { getUserLocale } from "get-user-locale";
// import dayjs from "dayjs";

// import getFlagEmoji from "@/app/components/GetFlagEmoji";
// import "../stylesheets/trips.css";

// const Trips = () => {

//   const [isInitialized, setIsInitialized] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   const [trips, setTrips] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     // Load all trips from localStorage
//     const loadTrips = () => {
//       const allTrips = [];
//       for (let i = 0; i < localStorage.length; i++) {
//         const key = localStorage.key(i);
//         if (key.startsWith("town-hunt-trip-")) {
//           try {
//             const tripData = JSON.parse(localStorage.getItem(key));
//             allTrips.push({ ...tripData, id: key });
//           } catch (error) {
//             console.error("Error parsing trip data:", error);
//             // Handle corrupted data by removing it
//             localStorage.removeItem(key);
//           }
//         }
//       }
//       setTrips(allTrips);
//       setIsInitialized(true);
//     };

//     loadTrips();


//     const userLocale = getUserLocale();
//     let langy = userLocale.slice(0, 2);
//     // langy = "en"
//     require(`dayjs/locale/${langy}`);
//     dayjs.locale(langy);

//     let localizedFormat = require(`dayjs/plugin/localizedFormat`);
//     dayjs.extend(localizedFormat);
//   }, []);


//   const addNewTrip = () => {
//     const newTripId = `${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
//     const newTripKey = `town-hunt-trip-${newTripId}`;
//     const newTrip = {
//       title: "Enter Trip Title",
//       id: newTripId,
//       startDate: "",
//       numOfDays: 0,
//       uniqueCountries: [],
//       trip: [],
//     };
//     localStorage.setItem(newTripKey, JSON.stringify(newTrip));
//     router.push(`/trips/${newTripKey}`);
//   };

//   const deleteTrip = (tripId) => {
//     localStorage.removeItem(tripId);
//     setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId));
//   };

//   return (
//     <div className="trips-page">
//       <div className="trips-nav" style={{marginTop: "20px", marginBottom: "20px"}}>
//           <Link href="/">
//             <FontAwesomeIcon icon={faAngleLeft} style={{width: "20px", height: "20px"}} />
//           </Link>
//       </div>

//       <div className="trips-header">
//         <h1>Trips</h1>
//         <div style={{display: "flex", alignItems: "center"}}>
//           <div className="trips-edit-button" onClick={() => setIsEditing(!isEditing)}>{isEditing ? "Done" : "Edit"}</div>
//           <div className="trips-new-trip-button" onClick={addNewTrip}>New Trip</div>
//         </div>
//       </div>

//       <div className="trips-list">
        
//           {trips.map((trip) => (
//             <div className="trips-each-container" key={trip.id}>
//               <Link href={`/trips/${trip.id}`} className="trips-each">
//                 <div className="trips-title">{trip.title}</div>
//                 <div className="trips-date-row">
//                   {trip.numOfDays !== 0 && <div className="trips-date">{trip.numOfDays} {trip.numOfDays === 1 ? "Day" : "Days" }</div>}
//                   {trip.startDate && <div className="trips-date">&nbsp;- {dayjs(trip.startDate).format("l")} ~{" "}{dayjs(trip.startDate).add(trip.numOfDays - 1, "day").format("l")}</div>}
//                 </div>
//                 {trip.uniqueCountries && <div className="trips-country">{trip.uniqueCountries.map((countryCode) => getFlagEmoji(countryCode)).join(" ")}</div>}
//               </Link>
//               {isEditing && (
//                   <div className="trips-delete-button" onClick={() => deleteTrip(trip.id)}>
//                     <FontAwesomeIcon icon={faTrash} style={{width: "15px", height: "15px"}} />
//                   </div>
//               )}
//             </div>
//           ))}


//       </div>
//       {isInitialized && trips.length === 0 && (
//           <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100px"}}>
//             <div>No Trips</div>
//           </div>
//       )}
//     </div>
//   );
// };

// export default Trips;


export default function Trips() {
  return(
    <div>Trips</div>
  )
}