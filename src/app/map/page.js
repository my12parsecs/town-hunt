"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import CitySelect from '../components/CitySelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faHome } from '@fortawesome/free-solid-svg-icons';

import "../stylesheets/map.css";

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const [prefersDarkScheme, setPrefersDarkScheme] = useState(true);
  const [cityArr, setCityArr] = useState([]);

console.log(cityArr);


  useEffect(() => {
    setPrefersDarkScheme(window.matchMedia("(prefers-color-scheme: dark)").matches)
    const storedCities = localStorage.getItem("town-hunt-cities");
    if (storedCities) {
      setCityArr(JSON.parse(storedCities));
    }

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN;

    if (map.current) return; // Initialize map only once

    map.current = new mapboxgl.Map({
        container: mapContainer.current,
    //   style: 'mapbox://styles/mapbox/streets-v11',
        style: window.matchMedia("(prefers-color-scheme: dark)").matches ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/light-v11",
        projection: "mercator",
        center: [139.6917, 35.6895], // Initial map center [longitude, latitude]
        zoom: 1.2, // Initial zoom level
    });


     map.current.getCanvas().style.cursor = 'default'; // Use a default or custom cursor style

     map.current.on('drag', () => {
        map.current.getCanvas().style.cursor = 'grab';
     })
     map.current.on('dragend', () => {
        map.current.getCanvas().style.cursor = 'default';
     })

    // map.current.on('mouseenter', () => {
    //     map.current.getCanvas().style.cursor = 'pointer';
    //   });

    return () => {
      if (map.current) map.current.remove(); // Clean up the map on component unmount
    };
  }, []);

//   useEffect(() => { 
//     // if (!map.current) return;
//     // if (!cityArr.length) return;
    

//     cityArr.forEach((city) => {
//         let customMarker = document.createElement('div');
//         customMarker.className = 'custom-marker';

//         const marker = new mapboxgl.Marker()
//           .setLngLat([city.lng, city.lat])
//           .addTo(map.current);

//         const markerElement = marker.getElement();
//         markerElement.style.cursor = 'pointer';
  
//         // Create a popup
//         const popupContent = document.createElement('div');
//         popupContent.className = 'popup-content';
//         popupContent.innerHTML = `
//           <h3 class="popup-name">${city.cityName}</h3>
//           <p class="popup-country">${city.countryName}</p>
//         `;
//         // <a href="${city}" target="_blank" class="popup-link">Visit</a>
  
//         const popup = new mapboxgl.Popup({ offset: 25 }) // Offset for better alignment
//           .setDOMContent(popupContent);
  
//         // Link the marker to the popup
//         marker.setPopup(popup);

//       });
//   }, [cityArr]);



  const [selectedCity, setSelectedCity] = useState(null);

  const handleAdd = () => {
    if (!selectedCity) return;
    const isCityExist = cityArr.some((city) => city.label === selectedCity.label);
    if (isCityExist) return;

    const updatedCityArr = [...cityArr, selectedCity];
    setCityArr(updatedCityArr);
    setSelectedCity(null);

    localStorage.setItem("town-hunt-cities", JSON.stringify(updatedCityArr));
  };

  return (
    <div className="map-page" style={{position: "relative"}}>

      <div ref={mapContainer} className="map-container" style={{width: "100dvw", height: "100dvh"}}></div>

        <Link href="/" className='home-button'>
            <FontAwesomeIcon icon={faHome} className="home-icon" />
        </Link>

      <div className="map-add-city-row" style={{position: "absolute", bottom: "15px", left: "50%", transform: "translateX(-50%)"}}>
        <div style={{ display: "flex" }}>
          <CitySelect setSelectedCity={setSelectedCity} isMapPage={true} />
        </div>
        <div className="city-add-button" onClick={handleAdd}>
          <FontAwesomeIcon icon={faPlus} className="add-icon" />
        </div>
      </div>
    </div>
  );
};

export default Map;
