// "use client";

// import React, { use, useState, useEffect } from "react";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPlus, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
// import { getUserLocale } from "get-user-locale";
// import dayjs from "dayjs";

// import CitySelect from "../../components/CitySelect";
// import getFlagEmoji from "../../components/GetFlagEmoji";
// import getUserLanguage from "../../app/components/GetUserLanguage";
// import { MinimalViable } from "../../app/components/SortableTree";
// import EachTripList from "../../app/components/EachTripList";

// import "../../stylesheets/tripEach.css";

// export default function EachTrip() {
//   const { slug } = useParams();
//   console.log(slug);

//   const [userLanguage, setUserLanguage] = useState("");

//   const [isEditing, setIsEditing] = useState(false);

//   const [selectedCity, setSelectedCity] = useState(null);
//   const [newPlace, setNewPlace] = useState(null);

//   const [isInitialized, setIsInitialized] = useState(false);
//   const [tripList, setTripList] = useState({
//     title: "Enter Trip Title",
//     startDate: "",
//     numOfDays: 0,
//     uniqueCountries: [],
//     trip: [],
//   });
//   const [tripExists, setTripExists] = useState(true);

//   const [numOfDays, setNumOfDays] = useState(0);
//   const [uniqueCountries, setUniqueCountries] = useState([]);

//   const [insertId, setInsertId] = useState(null);

//   const handleAdd = () => {
//     console.log("selectedCity", selectedCity);

//     if (!selectedCity) return;
//     setNewPlace(selectedCity);
//   };

//   useEffect(() => {
//     if (!newPlace) return;

//     const newCity = {
//       id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
//       value: newPlace.cityName,
//       cityName: newPlace.cityName,
//       adminName1: newPlace.adminName1,
//       countryName: newPlace.countryName,
//       countryCode: newPlace.countryCode,
//       fcl: newPlace.fcl,
//       fcodeName: newPlace.fcodeName,
//       label: newPlace.label,
//       lat: newPlace.lat,
//       lng: newPlace.lng,
//       geonameId: newPlace.value,
//       canHaveChildren: (dragItem) => {
//         return dragItem.type === "date-line" ? false : true;
//       },
//     };
//     window.localStorage.setItem(slug, JSON.stringify({ ...tripList, trip: [...tripList.trip, newCity] }));
//     setTripList({ ...tripList, trip: [...tripList.trip, newCity] });
//   }, [newPlace]);

//   const generateUniqueId = () => {
//     return `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
//   };

//   const addDateLine = () => {
//     const dateLines = tripList.trip.filter((item) => item.type === "date-line");
//     // Get the highest dateId
//     const maxDateId = dateLines.reduce((max, dateLine) => {
//       const currentId = parseInt(dateLine.dateId);
//       return currentId > max ? currentId : max;
//     }, -1);

//     const newDateLine = {
//       id: generateUniqueId(),
//       dateId: maxDateId + 1,
//       value: `Date Line ${maxDateId + 2}`,
//       type: "date-line",
//       canHaveChildren: false,
//     };

//     // setNewPlace(newDateLine);
//     const updatedTrip = [...tripList.trip, newDateLine];
//     setTripList((prev) => ({ ...prev, trip: updatedTrip }));
//     // localStorage.setItem("town-hunt-trip", JSON.stringify({...tripList, trip: [...tripList.trip, newDateLine]}));
//     // setTripList({...tripList, trip: [...tripList.trip, newDateLine]});
//   };

//   useEffect(() => {
//     setUserLanguage(getUserLanguage());
//   }, []);

//   useEffect(() => {
//     const userLocale = getUserLocale();
//     let langy = userLocale.slice(0, 2);
//     // langy = "en"
//     require(`dayjs/locale/${langy}`);
//     dayjs.locale(langy);

//     let localizedFormat = require(`dayjs/plugin/localizedFormat`);
//     dayjs.extend(localizedFormat);
//   }, []);


//   useEffect(() => {
//     const storedTrip = window.localStorage.getItem(slug);
//     if (storedTrip) {
//       try {
//         setTripList(JSON.parse(storedTrip));
//         setUniqueCountries(JSON.parse(storedTrip).uniqueCountries);
//         setNumOfDays(JSON.parse(storedTrip).numOfDays);
//       } catch (e) {
//         console.error("Error parsing stored trip data:", e);
//         setTripExists(false);
//       }
//     } else {
//       setTripExists(false);
//     }
//     setIsInitialized(true);
//   }, []); // Runs once on mount

//   useEffect(() => {
//     if(isInitialized && tripExists){
//       setTripList({...tripList, numOfDays: numOfDays});
//     }
//   }, [numOfDays, isInitialized]);

//   useEffect(() => {
//     if(isInitialized && tripExists){
//       setTripList({...tripList, uniqueCountries: uniqueCountries});
//     }
//   }, [uniqueCountries, isInitialized]);

//   useEffect(() => {
//     // Only start syncing to localStorage after initial load
//     if (isInitialized && tripExists) {
//       console.log("PARENT useeffect trip list", tripList);
//       window.localStorage.setItem(slug, JSON.stringify(tripList));
//     }
//   }, [tripList, isInitialized]);

//   const eachTripJson = {
//     title: "France Trip",
//     startDate: "2024-02-10",
//     trip: [
//       {
//         id: "1",
//         geonameId: "878979",
//         value: "Paris",
//         countryCode: "FR",
//         countryName: "France",
//         children: [
//           {
//             id: "4",
//             value: "Eiffel Tower",
//             children: [
//               {
//                 id: "7",
//                 value: "Observation Deck",
//                 children: [
//                   {
//                     id: "7-1",
//                     value: "Third Floor",
//                     canHaveChildren: (dragItem) => {
//                       return dragItem.type === "date-line" ? false : true;
//                     },
//                   },
//                 ],
//                 canHaveChildren: (dragItem) => {
//                   return dragItem.type === "date-line" ? false : true;
//                 },
//               },
//             ],
//             canHaveChildren: (dragItem) => {
//               return dragItem.type === "date-line" ? false : true;
//             },
//           },
//           {
//             id: "5",
//             value: "The Louvre",
//             canHaveChildren: (dragItem) => {
//               return dragItem.type === "date-line" ? false : true;
//             },
//           },
//         ],
//         canHaveChildren: (dragItem) => {
//           return dragItem.type === "date-line" ? false : true;
//         },
//       },
//       {
//         id: "2",
//         geonameId: "234097",
//         value: "Blois",
//         countryCode: "FR",
//         countryName: "France",
//         children: [
//           {
//             id: "6",
//             value: "Chateau de Blois",
//             canHaveChildren: (dragItem) => {
//               return dragItem.type === "date-line" ? false : true;
//             },
//           },
//         ],
//         canHaveChildren: (dragItem) => {
//           return dragItem.type === "date-line" ? false : true;
//         },
//       },
//       { id: "date-line-0", dateId: 0, value: "", type: "date-line", canHaveChildren: false },
//       {
//         id: "38457289574",
//         geonameId: "1234",
//         value: "Amboise",
//         countryCode: "FR",
//         countryName: "France",
//         children: [
//           {
//             id: "9898",
//             value: "Chateau de Amboise",
//             canHaveChildren: (dragItem) => {
//               return dragItem.type === "date-line" ? false : true;
//             },
//           },
//         ],
//         canHaveChildren: (dragItem) => {
//           return dragItem.type === "date-line" ? false : true;
//         },
//       },
//       { id: "date-line-1", dateId: 1, value: "", type: "date-line", canHaveChildren: false },
//       {
//         id: "384579898289574",
//         geonameId: "1234",
//         value: "Amboise",
//         countryCode: "FR",
//         countryName: "France",
//         children: [
//           {
//             id: "9808998",
//             value: "Amboise Hotel",
//             canHaveChildren: (dragItem) => {
//               return dragItem.type === "date-line" ? false : true;
//             },
//           },
//         ],
//         canHaveChildren: (dragItem) => {
//           return dragItem.type === "date-line" ? false : true;
//         },
//       },
//       { id: "date-line-9", dateId: 2, value: "", type: "date-line", canHaveChildren: false },
//       {
//         id: "38457989828958774",
//         geonameId: "1234",
//         value: "Amboise",
//         countryCode: "FR",
//         countryName: "France",
//         children: [
//           {
//             id: "980878",
//             value: "Amboise Hotel",
//             canHaveChildren: (dragItem) => {
//               return dragItem.type === "date-line" ? false : true;
//             },
//           },
//         ],
//         canHaveChildren: (dragItem) => {
//           return dragItem.type === "date-line" ? false : true;
//         },
//       },
//     ],
//   };

//   return (
//     <div className="each-trip-page">
//       <div className="each-trip-nav">
//         <div style={{ marginTop: "20px", marginBottom: "20px" }}>
//           <Link href="/trips">
//             <FontAwesomeIcon icon={faAngleLeft} style={{ width: "20px", height: "20px" }} />
//           </Link>
//         </div>
//       </div>

//       {!tripExists ? (
//         <div>Trip Not Found</div>
//       ) : !isEditing ? (
//         <div className="each-trip-content">
//           <div className="each-trip-info">
//             <div className="each-trip-title-row">
//               <h1>{tripList.title ? tripList.title : ""}</h1>
//               <div onClick={() => setIsEditing(!isEditing)} className="each-trip-edit-button">
//                 {isEditing ? "Done" : "Edit"}
//               </div>
//             </div>
//             <div className="each-trip-date-row">
//               {tripList.startDate ? (
//                 numOfDays > 0 ? (
//                   dayjs(tripList.startDate).format("YYYY") === dayjs(tripList.startDate).add(numOfDays - 1, "day").format("YYYY") ? (
//                     <p>{dayjs(tripList.startDate).format("l")} ~{" "}{dayjs(tripList.startDate).add(numOfDays - 1, "day").format("l")}</p>
//                   ) : (
//                     <p>{dayjs(tripList.startDate).format("l")} ~{" "}{dayjs(tripList.startDate).add(numOfDays - 1, "day").format("l")}</p>
//                   )
//                 ) : (
//                   <p>{dayjs(tripList.startDate).format("l")}</p>
//                 )
//               ) : numOfDays > 0 ? (
//                 <p>
//                   {numOfDays} {numOfDays > 1 ? "Days" : "Day"}
//                 </p>
//               ) : (
//                 <p>No Date</p>
//               )}
//             </div>
//             <div className="each-trip-flag-row">
//               {/* <p>{getFlagEmoji(tripList?.trip?.[0]?.countryCode ?? "")}</p> */}
//                 {tripList.uniqueCountries && <div className="trips-country">{tripList.uniqueCountries.map((countryCode) => getFlagEmoji(countryCode)).join(" ")}</div>}
//             </div>
//           </div>
//           <div className="each-trip-list-container">
//             {tripList?.trip?.length > 0 ? (
//               <EachTripList eachTripJson={tripList} userLanguage={userLanguage} numOfDays={numOfDays} setNumOfDays={setNumOfDays} />
//             ) : (
//               isInitialized && (
//                 <div className="each-trip-list-empty">
//                   <p style={{ fontSize: "1.2rem" }}>No Trip Data</p>
//                 </div>
//               )
//             )}
//           </div>
//         </div>
//       ) : (
//         <div>
//           <div className="each-trip-info">
//             <div className="each-trip-title-row">
//               <textarea type="text" className="each-trip-title-input" placeholder="Enter Trip Title" style={{ width: "100%" }} value={tripList.title} onChange={(e) => setTripList({ ...tripList, title: e.target.value })} />
//               <div onClick={() => setIsEditing(!isEditing)} className={`each-trip-edit-button ${isEditing ? "each-trip-edit-button-done" : ""}`}>
//                 {isEditing ? "Done" : "Edit"}
//               </div>
//             </div>
//             <div className="each-trip-date-row">
//               {tripList.startDate ? (
//                 numOfDays > 0 ? (
//                   dayjs(tripList.startDate).format("YYYY") ===
//                   dayjs(tripList.startDate)
//                     .add(numOfDays - 1, "day")
//                     .format("YYYY") ? (
//                     <p>
//                       {dayjs(tripList.startDate).format("l")} ~{" "}
//                       {dayjs(tripList.startDate)
//                         .add(numOfDays - 1, "day")
//                         .format("l")}
//                     </p>
//                   ) : (
//                     <p>
//                       {dayjs(tripList.startDate).format("l")} ~{" "}
//                       {dayjs(tripList.startDate)
//                         .add(numOfDays - 1, "day")
//                         .format("l")}
//                     </p>
//                   )
//                 ) : (<p>{dayjs(tripList.startDate).format("l")}</p>)
//               ) : numOfDays > 0 ? (
//                 <p>{numOfDays} {numOfDays > 1 ? "Days" : "Day"}</p>
//               ) : (
//                 <p>No Date</p>
//               )}
//             </div>
//             <div className="each-trip-flag-row">
//               {tripList.uniqueCountries && <div className="trips-country">{tripList.uniqueCountries.map((countryCode) => getFlagEmoji(countryCode)).join(" ")}</div>}
//             </div>
//           </div>
//           <div className="each-trip-edit-starting-date-row">
//             Starting Date: <input type="date" placeholder="YYYY-MM-DD" value={tripList.startDate} onChange={(e) => setTripList({ ...tripList, startDate: e.target.value })} className="starting-date-input" />
//             <div className="starting-date-clear-button" onClick={() => setTripList({ ...tripList, startDate: "" })}>
//               Clear
//             </div>
//           </div>
//           <div className="each-trip-edit-list">{tripList?.trip?.length > 0 ? <MinimalViable tripList={tripList} setTripList={setTripList} newPlace={newPlace} setNewPlace={setNewPlace} insertId={insertId} setInsertId={setInsertId} uniqueCountries={uniqueCountries} setUniqueCountries={setUniqueCountries} /> : <div style={{textAlign: "center"}}>No Items</div>}</div>
//           <div className="add-next-day-button" onClick={addDateLine}>
//             <FontAwesomeIcon icon={faPlus} className="add-next-day-button-icon" />Add Day
//           </div>
//           <div className="each-trip-add-container">
//             <div className="each-trip-add-select-container">
//               <CitySelect setSelectedCity={setSelectedCity} isMapPage={false} />
//             </div>
//             <div onClick={handleAdd} className="each-trip-add-button-container">
//               <FontAwesomeIcon icon={faPlus} className="add-icon" />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




export default function TripsEach() {
  return(
    <div>Trips Each</div>
  )
}