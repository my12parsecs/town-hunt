"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import getUserLocale from "get-user-locale";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faHome, faCircleInfo, faLocationDot } from "@fortawesome/free-solid-svg-icons";

import CitySelect from "./CitySelect";
import getFlagEmoji from "./GetFlagEmoji";
import { useMutation, useQueryClient } from '@tanstack/react-query'

import "../stylesheets/map.css";

export default function MapRender(props) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const popups = useRef([]);

  const [prefersDarkScheme, setPrefersDarkScheme] = useState(true);
  const [userLanguage, setUserLanguage] = useState("");
  const [cityArr, setCityArr] = useState(props.placeList);

  useEffect(()=>{
    setCityArr(props.placeList)
  }, [props.placeList])

  useEffect(() => {
    const userLocale = getUserLocale();
    setUserLanguage(userLocale.slice(0, 2));

    setPrefersDarkScheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
    // const storedCities = localStorage.getItem("town-hunt-cities");
    // if (storedCities) {
    //   setCityArr(JSON.parse(storedCities));
    // }

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN;

    if (map.current) return; // Initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      //   style: 'mapbox://styles/mapbox/streets-v11',
      style: window.matchMedia("(prefers-color-scheme: dark)").matches ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/light-v11",
      projection: "mercator",
      center: [60, 35], // Initial map center [longitude, latitude]
      zoom: 1.2, // Initial zoom level
    });

    const handleDrag = () => (map.current.getCanvas().style.cursor = "grab");
    const handleDragEnd = () => (map.current.getCanvas().style.cursor = "default");
    map.current.on("drag", handleDrag);
    map.current.on("dragend", handleDragEnd);

    //  map.current.getCanvas().style.cursor = 'default';

    //  map.current.on('drag', () => {
    //     map.current.getCanvas().style.cursor = 'grab';
    //  })
    //  map.current.on('dragend', () => {
    //     map.current.getCanvas().style.cursor = 'default';
    //  })

    return () => {
      if (map.current) map.current.remove();
      map.current.off("drag", handleDrag);
      map.current.off("dragend", handleDragEnd);
    };
  }, []);

  useEffect(() => {
    // if (!map.current) return;
    if (!cityArr.length) return;

    popups.current.forEach((popup) => popup.remove());
    popups.current = [];

    cityArr.forEach((city) => {
      let customMarker = document.createElement("div");
      customMarker.className = "custom-marker";

      const marker = new mapboxgl.Marker().setLngLat([city.lng, city.lat]).addTo(map.current);

      const markerElement = marker.getElement();
      markerElement.style.cursor = "pointer";

      // Create a popup
      const popupContent = document.createElement("div");
      popupContent.className = "popup-content";
      popupContent.innerHTML = `
          <h3 class="popup-name">${city.cityName}</h3>
          <p class="popup-country">${getFlagEmoji(city.countryCode)} ${city.countryName}</p>
          <div class="popup-link-row">
            <a href="https://${userLanguage}.wikipedia.org/wiki/${city.cityName}" target="_blank" class="popup-link-info">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="24" height="24" fill="currentColor"><path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-12a1 1 0 0 0-1 1v5a1 1 0 0 0 2 0V9a1 1 0 0 0-1-1zm0-1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path></svg>
            </a>
            <a href="https://www.google.com/maps/search/${city.cityName}" target="_blank" class="popup-link-map">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"></path></svg>
            </a>
          </div>
        `;
      // <a href="${city}" target="_blank" class="popup-link">Visit</a>

      const popup = new mapboxgl.Popup({ offset: 25 }) // Offset for better alignment
        .setDOMContent(popupContent);

      // Link the marker to the popup
      marker.setPopup(popup);

      popups.current.push(popup);
    });
  }, [cityArr]);

  const [selectedCity, setSelectedCity] = useState(null);



  const addCityMutation = useMutation({
    mutationFn: async (newCity) => {
    //   const token = localStorage.getItem("session_token")
    //   if (!token) {
    //     throw new Error("No token found in localStorage")
    //   }
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/places/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        //   'Authorization': `Bearer ${token}`,
        },
        credentials: 'include', // Important for cookie authentication
        body: JSON.stringify(newCity),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add city');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      toast.success("City Added");
    },
    onError: (error) => {
      toast.error(`Error adding city: ${error.message}`);
    }
  });




  const handleAdd = () => {
    if (!selectedCity) return;
    const isCityExist = cityArr.some((city) => city.label === selectedCity.label);
    if (isCityExist) return;

    const updatedCityArr = [...cityArr, selectedCity];
    setCityArr(updatedCityArr);
    setSelectedCity(null);

    // localStorage.setItem("town-hunt-cities", JSON.stringify(updatedCityArr));
    addCityMutation.mutate(selectedCity)

    popups.current.forEach((popup) => popup.remove());
    popups.current = [];
  };

  return (
    <div className="map-page" style={{ position: "relative" }}>
      <div ref={mapContainer} className="map-container" style={{ width: "100dvw", height: "100dvh" }}></div>

      <Link href="/" className="home-button">
        <FontAwesomeIcon icon={faHome} className="home-icon" />
      </Link>

      <div className="map-add-city-row" style={{ position: "absolute", bottom: "15px", left: "50%", transform: "translateX(-50%)" }}>
        <div style={{ display: "flex" }}>
          <CitySelect setSelectedCity={setSelectedCity} isMapPage={true} />
        </div>
        <div className="map-city-add-button" onClick={handleAdd}>
          <FontAwesomeIcon icon={faPlus} className="map-add-icon" />
        </div>
      </div>
    </div>
  );
};
