"use client";

import { useEffect, useState, useRef } from "react";
import { redirect, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCircleInfo, faPlus, faPen, faCheck, faTrash, faMagnifyingGlass, faFilter, faSort, faMap, faBars } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import getUserLocale from "get-user-locale";

import CitySelect from "./components/CitySelect";
import getFlagEmoji from "./components/GetFlagEmoji";
import "./stylesheets/home.css";

export default function Home() {
  const router = useRouter()

  const [userLanguage, setUserLanguage] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityArr, setCityArr] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [filterType, setFilterType] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const userLocale = getUserLocale();
    setUserLanguage(userLocale.slice(0, 2));
  }, []);

  const handleAdd = () => {
    // console.log(selectedCity);
    if (!selectedCity) return;
    const isCityExist = cityArr.some((city) => city.label === selectedCity.label);
    if (isCityExist) return;
    console.log(selectedCity);

    const updatedCityArr = [...cityArr, selectedCity];
    setCityArr(updatedCityArr);
    setSelectedCity(null);

    localStorage.setItem("town-hunt-cities", JSON.stringify(updatedCityArr));
  };

  const handleDelete = (city) => {
    const updatedCityArr = cityArr.filter((c) => c.value !== city.value);
    setCityArr(updatedCityArr);
    localStorage.setItem("town-hunt-cities", JSON.stringify(updatedCityArr));
  };

  useEffect(() => {
    const storedCities = localStorage.getItem("town-hunt-cities");
    if (storedCities) {
      setCityArr(JSON.parse(storedCities));
    }
  }, []);


  const displayedCities = filterType ? cityArr.filter((city) => city.fcl === filterType) : cityArr;

  // const [hoveredCity, setHoveredCity] = useState(null);
  // const [wikiImage, setWikiImage] = useState(null);

  // async function fetchWikipediaImage(cityName) {
  //   const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`;
  //   try {
  //     const response = await fetch(url);
  //     if (!response.ok) throw new Error("Failed to fetch Wikipedia data");
  //     const data = await response.json();
  //     return data.thumbnail ? data.thumbnail.source : null;
  //   } catch (error) {
  //     console.error("Error fetching Wikipedia image:", error);
  //     return null;
  //   }
  // }

  // const handleMouseEnter = async (cityName) => {
  //   setHoveredCity(cityName);
  //   const image = await fetchWikipediaImage(cityName);
  //   setWikiImage(image);
  // };

  // const handleMouseLeave = () => {
  //   setHoveredCity(null);
  //   setWikiImage(null);
  // };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="home-page">
      <div className="home-content">
        <div className="func-row">
          <div className="func-left">
            <input type="text" className="search-input" placeholder="Search Your List" style={isSearching ? {display: "flex"} : {display: "none"}} />
          </div>
          <div className="func-right">
            <div className="func-each">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="func-each-icon" onClick={() => setIsSearching(!isSearching)} />
            </div>
            {/* <div className="func-each">
              <FontAwesomeIcon icon={faFilter} className="func-each-icon" />
            </div> */}
            <div className="func-each">
              <FontAwesomeIcon icon={faSort} className="func-each-icon" />
            </div>
            <div className="func-each">
              <FontAwesomeIcon icon={faMap} className="func-each-icon" onClick={() => router.push("/map")} />
            </div>
            <div className="func-each" ref={dropdownRef}>
              <FontAwesomeIcon icon={faBars} className="func-each-icon" onClick={() => setDropdown(!dropdown)} />
              <div className="dropdown-menu" style={dropdown ? {display: "block"} : {display: "none"}}>
                <div className="dropdown-each" onClick={() => router.push("/about")}>
                  <FontAwesomeIcon icon={faCircleInfo} className="dropdown-each-icon" />About
                </div>
                <div className="dropdown-each" onClick={() => window.open("https://github.com/my12parsecs/town-hunt", "_blank")}>
                  <FontAwesomeIcon icon={faGithub} className="dropdown-each-icon" />GitHub
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="control-row">
          {/* ["P", "T", "H", "L", "R", "S", "U", "V"], */}
          {/* // P - city, village
          // T - mountain, hill, rock
          // H - stream, lake
          // L - parks, area
          // R - road, railroad
          // S - spot, building, farm
          // U - undersea
          // V - forest, heath */}
          {cityArr.some((city) => city.fcl === "P") && (
            <button
              className={`filter-button ${filterType === "P" ? "active" : ""}`}
              onClick={() => setFilterType(filterType === "P" ? null : "P")}
            >
              <div>{filterType === "P" ? "Town" : "Town"}</div>
            </button>
          )}
          {cityArr.some((city) => city.fcl === "T") && (
            <button
              className={`filter-button ${filterType === "T" ? "active" : ""}`}
              onClick={() => setFilterType(filterType === "T" ? null : "T")}
            >
              <div>{filterType === "T" ? "Mountain" : "Mountain"}</div>
            </button>
          )}
          {cityArr.some((city) => city.fcl === "H") && (
            <button
              className={`filter-button ${filterType === "H" ? "active" : ""}`}
              onClick={() => setFilterType(filterType === "H" ? null : "H")}
            >
              <div>{filterType === "H" ? "River/Lake" : "River/Lake"}</div>
            </button>
          )}
          {cityArr.some((city) => city.fcl === "L") && (
            <button
              className={`filter-button ${filterType === "L" ? "active" : ""}`}
              onClick={() => setFilterType(filterType === "L" ? null : "L")}
            >
              <div>{filterType === "L" ? "Park" : "Park"}</div>
            </button>
          )}
          {cityArr.some((city) => city.fcl === "R") && (
            <button
              className={`filter-button ${filterType === "R" ? "active" : ""}`}
              onClick={() => setFilterType(filterType === "R" ? null : "R")}
            >
              <div>{filterType === "R" ? "Road/Railway" : "Road/Railway"}</div>
            </button>
          )}
          {cityArr.some((city) => city.fcl === "S") && (
            <button
              className={`filter-button ${filterType === "S" ? "active" : ""}`}
              onClick={() => setFilterType(filterType === "S" ? null : "S")}
            >
              <div>{filterType === "S" ? "Spot" : "Spot"}</div>
            </button>
          )}
          {cityArr.some((city) => city.fcl === "U") && (
            <button
              className={`filter-button ${filterType === "U" ? "active" : ""}`}
              onClick={() => setFilterType(filterType === "U" ? null : "U")}
            >
              <div>{filterType === "U" ? "Undersea" : "Undersea"}</div>
            </button>
          )}

          {/* <button className={`filter-button ${filterType === "T" ? "active" : ""}`} onClick={() => setFilterType(filterType === "T" ? null : "T")}>
            <div>{filterType === "T" ? "Mountains" : "Mountains"}</div>
          </button>
          <button className={`filter-button ${filterType === "P" ? "active" : ""}`} onClick={() => setFilterType(filterType === "P" ? null : "P")}>
            <div>{filterType === "P" ? "Towns" : "Towns"}</div>
          </button>
          <button className={`filter-button ${filterType === "L" ? "active" : ""}`} onClick={() => setFilterType(filterType === "L" ? null : "L")}>
            <div>{filterType === "L" ? "Parks" : "Parks"}</div>
          </button> */}
        </div>

        {cityArr.length === 0 ? (
          <div className="no-city-div">
            <h1 className="title-h1">Town Hunt</h1>
            <h2 className="title-h2">Quickly record towns.</h2>
          </div>
        ) : (
          <div className="city-list">
            {console.log(cityArr)}
            {displayedCities.map((city, index) => (
              <div className="city-list-container" key={index}>
                <div className="city-list-row">
                  <div className="city-name">
                    <div
                      className="city-cityname"
                      // onMouseEnter={() => handleMouseEnter(city.cityName)}
                      // onMouseLeave={handleMouseLeave}
                    >
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

                  {/* {hoveredCity === city.cityName && wikiImage && (
                  <div className="wiki-image-container">
                    <img src={wikiImage} alt={`${city.cityName} Wikipedia`} className="wiki-image" />
                  </div>
                )} */}
                </div>
                {isEditing && (
                  <div className="city-delete-container">
                    <div className="city-delete">
                      <FontAwesomeIcon icon={faTrash} className="delete-icon" onClick={() => handleDelete(city)} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="add-city-row">
        <div style={{ display: "flex" }}>
          <CitySelect setSelectedCity={setSelectedCity} />
        </div>
        <div className="city-add-button" onClick={handleAdd}>
          <FontAwesomeIcon icon={faPlus} className="add-icon" />
        </div>
        <div className="city-edit-button" onClick={() => setIsEditing(!isEditing)}>
          {/* <FontAwesomeIcon icon={faPen} className="edit-icon" /> */}
          {isEditing ? <FontAwesomeIcon icon={faCheck} className="edit-icon" /> : <FontAwesomeIcon icon={faPen} className="edit-icon" />}
        </div>
      </div>
    </div>
  );
}
 