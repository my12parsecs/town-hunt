

"use client";

import { useEffect, useState, useRef, use } from "react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCircleInfo, faPlus, faPen, faCheck, faTrash, faMagnifyingGlass, faFilter, faSort, faMap, faBars, faAngleDown, faAngleUp, faArrowDown, faArrowRight, faPlane } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import getUserLocale from "get-user-locale";
import toast from "react-hot-toast";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

import CitySelect from "../components/CitySelect";
import getFlagEmoji from "../components/GetFlagEmoji";
import "../stylesheets/home.css";
import { useSession } from "../components/Session";
import { Logout } from "../components/LogInOut";

export default function MainPlaceList(props) {
  const router = useRouter();

  const queryClient = useQueryClient();

//   const { session, places, isLoading: sessionLoading, error: sessionError, logout } = useSession();
//   const sessionData = props.sessionData
  // console.log(session, places);

  const [sessionData, setSessionData] = useState(props.sessionData);





  const [isInitialized, setIsInitialized] = useState(false);

  const [userLanguage, setUserLanguage] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);

//   const [cityArr, setCityArr] = useState(props.placeList)
    const [cityArr, setCityArr] = useState(Array.isArray(props.placeList) ? props.placeList : []);
  const [isEditing, setIsEditing] = useState(false);

  const [filterType, setFilterType] = useState(null);

  const [sortType, setSortType] = useState({ type: null, nameOrder: true, countryOrder: true });

  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const searchInputButtonRef = useRef(null);

  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [sortMenu, setSortMenu] = useState(false);
  const sortMenuRef = useRef(null);



//   const cityArr = props.placeList
    useEffect(() => {
        setCityArr(props.placeList);
    }, [props.placeList]);
    useEffect(() => {
        setSessionData(props.sessionData);
    }, [props.sessionData]);



  // ADD CITY TO BACKEND
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
          'Authorization': `Bearer ${props.token}`,
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

  // DELETE CITY TO BACKEND
  const deleteCityMutation = useMutation({
    mutationFn: async (city) => {
    //   const token = localStorage.getItem("session_token")
    //   if (!token) {
    //     throw new Error("No token found in localStorage")
    //   }
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/places/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${props.token}`,
        },
        credentials: 'include', // Important for cookie authentication
        body: JSON.stringify(city),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete city');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      toast.success("City Deleted");
    },
    onError: (error) => {
      toast.error(`Error deleting city: ${error.message}`);
    }
  });
  















  useEffect(() => {
    const userLocale = getUserLocale();
    setUserLanguage(userLocale.slice(0, 2));
  }, []);

  const handleAdd = () => {
    if (!selectedCity) return;
    const isCityExist = cityArr.some((city) => city.label === selectedCity.label);
    if (isCityExist) return;

    const updatedCityArr = [...cityArr, selectedCity];
    setCityArr(updatedCityArr);
    setSelectedCity(null);

    // localStorage.setItem("town-hunt-cities", JSON.stringify(updatedCityArr));
    addCityMutation.mutate(selectedCity)
    // toast.success("City Added");
  };

  const handleDelete = (city) => {
    const updatedCityArr = cityArr.filter((c) => c.value !== city.value);
    setCityArr(updatedCityArr);
    // localStorage.setItem("town-hunt-cities", JSON.stringify(updatedCityArr));
    deleteCityMutation.mutate(city)
    // toast.success("City Deleted");
  };

  useEffect(() => {
    const storedCities = localStorage.getItem("town-hunt-cities");
    if (storedCities) {
      // setCityArr(JSON.parse(storedCities));
    }
    setIsInitialized(true);
  }, []);

  // FILTER
  // const displayedCities = filterType ? cityArr.filter((city) => city.fcl === filterType) : cityArr;

  // SORT
  // const handleSort = (type) => {
  //   setSortType(type); // Update the sort type state
  // };

  const sortCities = (cities) => {
    if (!sortType.type) return cities;
    if (sortType.type === "name") {
      return [...cities].sort((a, b) => {
        if (sortType.nameOrder) {
          return a.cityName.localeCompare(b.cityName);
        } else {
          return b.cityName.localeCompare(a.cityName);
        }
      });
    }
    if (sortType.type === "country") {
      return [...cities].sort((a, b) => {
        if (sortType.countryOrder) {
          return a.countryName.localeCompare(b.countryName);
        } else {
          return b.countryName.localeCompare(a.countryName);
        }
      });
    }
    return 0;
  };

  // const displayedCities = filterType
  //   ? sortCities(cityArr.filter((city) => city.fcl === filterType))
  //   : sortCities(cityArr);
  

//   const displayedCities = sortCities(
//     cityArr?.filter(
//         (city) => (filterType ? city.fcl === filterType : true) // Apply filterType if present
//       ).filter(
//         (city) => city.cityName.toLowerCase().includes(searchQuery.toLowerCase()) // Apply search filter
//       )
//   );
const displayedCities = (() => {
    if (!Array.isArray(cityArr)) return []; 
    let filteredCities = cityArr;
    // Apply filter by type if needed
    if (filterType) {
      filteredCities = filteredCities.filter(city => city.fcl === filterType);
    }
    // Apply search filter if needed
    if (searchQuery) {
      filteredCities = filteredCities.filter(city => 
        city.cityName && city.cityName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    // Apply sorting
    return sortCities(filteredCities);
  })();

  const [hoveredCity, setHoveredCity] = useState(null);
  const [activeCity, setActiveCity] = useState(null);
  const [wikiImage, setWikiImage] = useState(null);
  const imageContainerRef = useRef(null);

  async function fetchWikipediaImage(cityName) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch Wikipedia data");
      const data = await response.json();
      return data.thumbnail ? data.thumbnail.source : null;
    } catch (error) {
      console.error("Error fetching Wikipedia image:", error);
      return null;
    }
  }

  const handleCityInteraction = async (cityName, event) => {
    // if(event){event.preventDefault()}
    // If the city is already active, deactivate it
    if (activeCity === cityName) {
      setActiveCity(null);
      setWikiImage(null);
      return;
    }

    // Activate the new city and fetch its image
    setActiveCity(cityName);
    const image = await fetchWikipediaImage(cityName);
    setWikiImage(image);
  };

  const handleMouseEnter = async (cityName, event) => {

    if (!("ontouchstart" in window)) {
      await handleCityInteraction(cityName, event);
    }
  };

  const handleMouseLeave = (event) => {
    // setHoveredCity(null);
    // setWikiImage(null);
    if (!("ontouchstart" in window)) {
      setActiveCity(null);
      setWikiImage(null);
    }
  };

  const handleCityClick = async (cityName, event) => {
    // e.preventDefault(); // Prevent any default behavior
    // await handleCityInteraction(cityName);

    if (event) {
      // event.preventDefault();
      // event.stopPropagation();
    }
    // await handleCityInteraction(cityName, event);
  };

  const handleOutsideClick = (event) => {
    // If we have an active image and the click wasn't on the image container or the city name
    // if (activeCity && imageContainerRef.current && !imageContainerRef.current.contains(e.target) && !e.target.closest(".city-cityname")) {
    //   setActiveCity(null);
    //   setWikiImage(null);
    // }
    if (!event) return;
    if (
      activeCity && imageContainerRef.current && !imageContainerRef.current.contains(event.target) && !event.target.closest(".city-cityname")
    ) {
      setActiveCity(null);
      setWikiImage(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [activeCity]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setSortMenu(false);
      }
      if (searchInputRef.current && !searchInputRef.current.contains(event.target) && searchInputButtonRef.current && !searchInputButtonRef.current.contains(event.target)) {
        setIsSearching(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const randomColorArr = ["red", "orange", "yellow", "green", "blue", "purple", "pink", "brown", "aqua", "yellowGreen", "lime", "indigo", "teal", "violet", "cyan", "magenta", "gold", "silver", "coral", "darkBlue", "crimson", "navy", "olive", "maroon", "lavender", "peru", "turquoise", "sienna", "chocolate", "firebrick", "khaki", "plum", "tan", "slateBlue", "deepPink", "forestGreen"];

  const [randomIndex, setRandomIndex] = useState(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * randomColorArr.length);
    setRandomIndex(randomIndex);
  }, []);

  const [isHighlighted, setIsHighlighted] = useState(false);

  const handleAddClick = () => {
    setIsHighlighted(true);
    setTimeout(() => setIsHighlighted(false), 1000);
  };





  


  return (
    <div className="home-page">
      <div className="home-content">
        <div className="func-row">
          <div className="func-left">
            <input type="text" className="search-input" placeholder="Search List" style={isSearching ? { display: "flex" } : { display: "none" }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} ref={searchInputRef} />
          </div>
          <div className="func-right">
            <div className="func-each">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="func-each-icon"
                ref={searchInputButtonRef}
                onClick={() => {
                  // !setIsSearching(!isSearching);
                  setIsSearching((prev) => !prev);
                  setSearchQuery("");
                }}
              />
            </div>
            <div className="func-each" ref={sortMenuRef}>
              <FontAwesomeIcon
                icon={faSort}
                className="func-each-icon"
                onClick={() => setSortMenu(!sortMenu)}
                // onClick={() => setSortType((prev) => (prev === "name" ? null : "name"))}
              />
              <div className="dropdown-menu" style={sortMenu ? { display: "block" } : { display: "none" }}>
                <div className="dropdown-each" onClick={() => setSortType({ type: "name", nameOrder: !sortType.nameOrder, countryOrder: sortType.countryOrder })}>
                  {sortType.nameOrder ? <FontAwesomeIcon icon={faAngleDown} className="sort-menu-each-icon" /> : <FontAwesomeIcon icon={faAngleUp} className="sort-menu-each-icon" />}Name
                </div>
                <div className="dropdown-each" onClick={() => setSortType({ type: "country", nameOrder: sortType.nameOrder, countryOrder: !sortType.countryOrder })}>
                  {sortType.countryOrder ? <FontAwesomeIcon icon={faAngleDown} className="sort-menu-each-icon" /> : <FontAwesomeIcon icon={faAngleUp} className="sort-menu-each-icon" />}Country
                </div>
              </div>
            </div>
            <div className="func-each">
              <Link href="/map" className="func-each-icon">
                <FontAwesomeIcon icon={faMap} className="func-each-icon" />
              </Link>
            </div>
            {!sessionData?.googleId && (<Link href={`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/google`} className="func-each" style={{marginLeft: "10px"}}>Login</Link>)}
            {/* {data?.googleId && (<Link href={`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/logout`} className="func-each" style={{marginLeft: "10px"}}>Logout</Link>)} */}
            {sessionData?.googleId && (<div onClick={()=>Logout()} className="func-each" style={{marginLeft: "10px", cursor: "pointer"}}>Logout</div>)}

            {/* <div className="func-each" ref={dropdownRef}>
              <FontAwesomeIcon icon={faBars} className="func-each-icon" onClick={() => setDropdown(!dropdown)} />
              <div className="dropdown-menu" style={dropdown ? { display: "block" } : { display: "none" }}>
                <div className="dropdown-each" onClick={() => router.push("/about")}>
                  <FontAwesomeIcon icon={faCircleInfo} className="dropdown-each-icon" />
                  About
                </div>
                <div className="dropdown-each" onClick={() => router.push("/trips")}>
                  <FontAwesomeIcon icon={faPlane} className="dropdown-each-icon" />
                  Trips
                </div>
                <div className="dropdown-each" onClick={() => window.open("https://github.com/my12parsecs/town-hunt", "_blank")}>
                  <FontAwesomeIcon icon={faGithub} className="dropdown-each-icon" />
                  GitHub
                </div>
              </div>
            </div> */}
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
          {cityArr && cityArr?.some((city) => city.fcl === "P") && (
            <button className={`filter-button ${filterType === "P" ? "active" : ""}`} onClick={() => setFilterType(filterType === "P" ? null : "P")}>
              <div>{filterType === "P" ? "Town" : "Town"}</div>
            </button>
          )}
          {cityArr && cityArr?.some((city) => city.fcl === "T") && (
            <button className={`filter-button ${filterType === "T" ? "active" : ""}`} onClick={() => setFilterType(filterType === "T" ? null : "T")}>
              <div>{filterType === "T" ? "Mountain" : "Mountain"}</div>
            </button>
          )}
          {cityArr && cityArr?.some((city) => city.fcl === "H") && (
            <button className={`filter-button ${filterType === "H" ? "active" : ""}`} onClick={() => setFilterType(filterType === "H" ? null : "H")}>
              <div>{filterType === "H" ? "River/Lake" : "River/Lake"}</div>
            </button>
          )}
          {cityArr && cityArr?.some((city) => city.fcl === "L") && (
            <button className={`filter-button ${filterType === "L" ? "active" : ""}`} onClick={() => setFilterType(filterType === "L" ? null : "L")}>
              <div>{filterType === "L" ? "Park" : "Park"}</div>
            </button>
          )}
          {cityArr && cityArr?.some((city) => city.fcl === "R") && (
            <button className={`filter-button ${filterType === "R" ? "active" : ""}`} onClick={() => setFilterType(filterType === "R" ? null : "R")}>
              <div>{filterType === "R" ? "Road/Railway" : "Road/Railway"}</div>
            </button>
          )}
          {cityArr && cityArr?.some((city) => city.fcl === "S") && (
            <button className={`filter-button ${filterType === "S" ? "active" : ""}`} onClick={() => setFilterType(filterType === "S" ? null : "S")}>
              <div>{filterType === "S" ? "Spot" : "Spot"}</div>
            </button>
          )}
          {cityArr && cityArr?.some((city) => city.fcl === "U") && (
            <button className={`filter-button ${filterType === "U" ? "active" : ""}`} onClick={() => setFilterType(filterType === "U" ? null : "U")}>
              <div>{filterType === "U" ? "Undersea" : "Undersea"}</div>
            </button>
          )}
        </div>

        {cityArr?.length === 0 ? (
          <div className="no-city-div">
            {/* <h1 className="title-h1">Bookmark Places<span style={{backgroundColor: randomColorArr[randomIndex]}}></span></h1>
            <h2 className="title-h2">Towns, Mountains, Landmarks, Parks, Roads...</h2>
            <div className="call-to-action-row">
            <Link href="/about" className="title-about title-link">
            About</Link>
            </div> */}
          </div>
        ) : (
          <div className="city-list">
            {displayedCities?.slice()
              .reverse()
              .map((city, index) => (
                <div className="city-list-container" key={index}>
                  <div className="city-list-row">
                    <div className="city-name" onClick={(e) => handleCityClick(e, city.cityName)}>
                      <div className="city-cityname" onMouseEnter={() => handleMouseEnter(city.cityName)} onMouseLeave={handleMouseLeave}>
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

                    {activeCity === city.cityName && wikiImage && (
                      <div className="wiki-image-container" ref={imageContainerRef}>
                        <img src={wikiImage} alt={`${city.cityName} Wikipedia`} className="wiki-image" />
                      </div>
                    )}
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
              {isInitialized && cityArr?.length === 0 && (
                <div className="no-city-div">
                  <h1 className="title-h1">
                    Bookmark Places<span style={{ backgroundColor: randomColorArr[randomIndex] }}></span>
                  </h1>
                  <h2 className="title-h2">Towns, Mountains, Landmarks, Parks, Roads...</h2>
                  <div className="call-to-action-row">
                    <Link href="/about" className="title-about title-link">
                      About
                    </Link>
                  </div>
                </div>
              )}
      </div>

      <div className={`add-city-row ${isHighlighted ? "add-city-row-highlight" : ""}`}>
        <div style={{ display: "flex" }}>
          <CitySelect setSelectedCity={setSelectedCity} isMapPage={false} />
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
