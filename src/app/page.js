"use client"

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faCircleInfo, faPlus,faPen, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';

import CitySelect from "./components/CitySelect";
import getFlagEmoji from "./components/GetFlagEmoji";
import "./stylesheets/home.css"

export default function Home() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityArr, setCityArr] = useState([]);
  const [isEditing, setIsEditing] = useState(false);


  const handleAdd = () => {
    console.log(selectedCity);
    if(!selectedCity) return;
    const isCityExist = cityArr.some(city => city.label === selectedCity.label);
    if (isCityExist) return;

    const updatedCityArr = [...cityArr, selectedCity];
    setCityArr(updatedCityArr);
    setSelectedCity(null);
    
    localStorage.setItem('town-hunt-cities', JSON.stringify(updatedCityArr))
  };

  useEffect(() => {
    const storedCities = localStorage.getItem('town-hunt-cities');
    if (storedCities) {
      setCityArr(JSON.parse(storedCities));
    }
  }, []);

  return (
    <div className="home-page">
      {/* <h1>Welcome to the Town Hunt</h1> */}

    <div className="home-content">
      {cityArr.length === 0 ? 
        <div className="no-city-div">
          <h1 className="title-h1">Town Hunt</h1>
          <h2 className="title-h2">Quickly record towns.</h2>
        </div> :
        <div className="city-list">
          {cityArr.map((city, index) => (
            <div className="city-list-container" key={index}>
              <div className="city-list-row">
                <div className="city-name">
                  <div className="city-cityname">{city.cityName}</div>
                  <div className="city-countryname">{getFlagEmoji(city.countryCode)} {city.countryName}</div>
                </div>
                <div className="city-button">
                  <a href={`https://en.wikipedia.org/wiki/${city.cityName}`} target="_blank" rel="noreferrer" className="city-wiki-link">
                    <FontAwesomeIcon icon={faCircleInfo} className="info-icon" />
                  </a>
                  <a href={`https://www.google.com/maps/search/${city.cityName}`} target="_blank" rel="noreferrer" className="city-map-link">
                    <FontAwesomeIcon icon={faLocationDot} className="map-icon" />
                  </a>
                </div>
              </div>
              {isEditing && (
                <div className="city-delete-container">
                  <div className="city-delete">
                    <FontAwesomeIcon icon={faTrash} className="delete-icon" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      }
    </div>



      <div className="add-city-row">
        <div style={{ display: "flex" }}>
          <CitySelect setSelectedCity={setSelectedCity} />
        </div>
        <div className='city-add-button' onClick={handleAdd}>
          <FontAwesomeIcon icon={faPlus} className="add-icon" />
        </div>
        <div className="city-edit-button" onClick={() => setIsEditing(!isEditing)}>
          {/* <FontAwesomeIcon icon={faPen} className="edit-icon" /> */}
          {isEditing ? (<FontAwesomeIcon icon={faCheck} className="edit-icon" />) : (<FontAwesomeIcon icon={faPen} className="edit-icon" />)}
        </div>
      </div>

    </div>
  );
}
