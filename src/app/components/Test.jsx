"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCircleInfo, faPlus, faPen, faCheck, faTrash, faMagnifyingGlass, faFilter, faSort, faMap, faBars, faAngleDown, faAngleUp, faArrowDown, faArrowRight, faPlane, faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

// DnD Kit imports
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import getUserLocale from "get-user-locale";
import toast from "react-hot-toast";

import CitySelect from "./CitySelect";
import getFlagEmoji from "./GetFlagEmoji";
import "../stylesheets/home.css";
import { useSession } from "./Session";
import { Logout } from "./LogInOut";
import { debounce } from "lodash";


// Create a sortable item component
function SortableItem({ city, index, isEditing, handleDelete, userLanguage, activeCity, wikiImage, handleCityClick, handleMouseEnter, handleMouseLeave, imageContainerRef }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: city.value });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    transformOrigin: "0 0", // Add this
    backgroundColor: "inherit",
    borderRadius: "8px",
  };

  return (
    <div className="city-list-container" ref={setNodeRef} style={style} {...attributes} >
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
          <Link href={`https://${userLanguage}.wikipedia.org/wiki/${city.cityName}`} target="_blank" rel="noreferrer" className="city-wiki-link">
            <FontAwesomeIcon icon={faCircleInfo} className="info-icon" />
          </Link>
          <Link href={`https://www.google.com/maps/search/${city.cityName}${city.adminName ? `, ${city.adminName}` : ""}, ${city.countryName}`} target="_blank" rel="noreferrer" className="city-map-link">
            <FontAwesomeIcon icon={faLocationDot} className="map-icon" />
          </Link>
          {!isEditing && (
            <div className="drag-handle" {...listeners}>
              <FontAwesomeIcon icon={faGripVertical} className="drag-icon" />
            </div>
          )}
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
  );
}

export default function MainPlaceList(props) {
  // ... (keep all your existing state and functions until the return statement)
  const router = useRouter();

  const queryClient = useQueryClient();

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

  // DnD Kit state and functions
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // const sensors = useSensors(
  //   useSensor(PointerSensor, {
  //     // Use distance-based activation instead of delay
  //     activationConstraint: {
  //       distance: 2, // Start dragging after moving 8px (adjust as needed)
  //       tolerance: 5,
  //       modifiers: [
  //         (event) => {
  //           const target = event.target;

  //           // More comprehensive interactive element detection
  //           const isInteractive =
  //             // Standard interactive elements
  //             target.tagName.toLowerCase() === "a" ||
  //             target.tagName.toLowerCase() === "button" ||
  //             target.tagName.toLowerCase() === "input" ||
  //             target.tagName.toLowerCase() === "select" ||
  //             target.tagName.toLowerCase() === "textarea" ||
  //             // ARIA interactive elements
  //             target.getAttribute("role") === "button" ||
  //             target.getAttribute("role") === "link" ||
  //             target.getAttribute("role") === "checkbox" ||
  //             target.getAttribute("role") === "radio" ||
  //             target.getAttribute("role") === "switch" ||
  //             target.getAttribute("role") === "tab" ||
  //             // Check ancestors with those roles too
  //             target.closest("a") ||
  //             target.closest("button") ||
  //             target.closest('[role="button"]') ||
  //             target.closest('[role="link"]') ||
  //             // Elements with pointer cursor
  //             window.getComputedStyle(target).cursor === "pointer";

  //           // Track initial position for detecting small movements
  //           if (!event.data?.initialClientX && isInteractive) {
  //             event.data = {
  //               initialClientX: event.clientX,
  //               initialClientY: event.clientY,
  //               isInteractive,
  //             };
  //           }

  //           // Allow small movements on interactive elements without triggering drag
  //           if (event.data?.isInteractive) {
  //             const deltaX = Math.abs(event.clientX - event.data.initialClientX);
  //             const deltaY = Math.abs(event.clientY - event.data.initialClientY);

  //             // If movement is very small, prevent dragging
  //             if (deltaX < 5 && deltaY < 5) {
  //               return false;
  //             }
  //           }

  //           // Prevent dragging on interactive elements unless significant movement
  //           return !isInteractive || (event.data?.isInteractive && event.pressure > 0);
  //         },
  //       ],
  //     },
  //   }),
  //   // Keep KeyboardSensor unchanged
  //   useSensor(KeyboardSensor, {
  //     coordinateGetter: sortableKeyboardCoordinates,
  //   })
  // );
  // const sensors = useSensors(
  //   useSensor(PointerSensor, {
  //     activationConstraint: {
  //       distance: 8, // Keeps a small distance threshold for better feel
  //     }
  //   }),
  //   useSensor(KeyboardSensor, {
  //     coordinateGetter: sortableKeyboardCoordinates,
  //   })
  // );



  

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setCityArr((items) => {
        const oldIndex = items.findIndex((item) => item.value === active.id);
        const newIndex = items.findIndex((item) => item.value === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        // updateOrderMutation.mutate(newItems);
        // console.log("new Items", newItems);
        const orderArray = newItems.map((item) => item.id);
        // console.log("orderArray", orderArray);
        updateOrderMutation.mutate(orderArray);

        return newItems;
      });
    }
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  // ... (keep all your existing code)

  //   const cityArr = props.placeList
  useEffect(() => {
    setCityArr(props.placeList);
  }, [props.placeList]);
  useEffect(() => {
    setSessionData(props.sessionData);
  }, [props.sessionData]);


  // const handleLogout = async () => {
  //   await Logout();
  //   toast.success("Logged out successfully");
  // };
  const handleLogout = debounce(async () => {
    await Logout();
    toast.success("Logged out successfully");
  }, 1000, { leading: true, trailing: false });


  // ADD CITY TO BACKEND
  const addCityMutation = useMutation({
    mutationFn: async (newCity) => {
      //   const token = localStorage.getItem("session_token")
      //   if (!token) {
      //     throw new Error("No token found in localStorage")
      //   }
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/places/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.token}`,
        },
        credentials: "include", // Important for cookie authentication
        body: JSON.stringify(newCity),
      });

      if (!response.ok) {
        throw new Error("Failed to add city");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
      toast.success("City Added");
    },
    onError: (error) => {
      toast.error(`Error adding city: ${error.message}`);
    },
  });

  // DELETE CITY TO BACKEND
  const deleteCityMutation = useMutation({
    mutationFn: async (city) => {
      //   const token = localStorage.getItem("session_token")
      //   if (!token) {
      //     throw new Error("No token found in localStorage")
      //   }
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/places/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.token}`,
        },
        credentials: "include", // Important for cookie authentication
        body: JSON.stringify(city),
      });

      if (!response.ok) {
        throw new Error("Failed to delete city");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
      toast.success("City Deleted");
    },
    onError: (error) => {
      toast.error(`Error deleting city: ${error.message}`);
    },
  });

  // UPDATE ORDER OF CITIES TO BACKEND
  const updateOrderMutation = useMutation({
    mutationFn: async (orderArray) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/places/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.token}`,
        },
        credentials: "include",
        body: JSON.stringify(orderArray),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update order");
      }
      return response.json();
    },
    // Optimistic updates
    onMutate: async (newOrder) => {
      await queryClient.cancelQueries(["places", props.token]);
      const previousData = queryClient.getQueryData(["places", props.token]);
      queryClient.setQueryData(["places", props.token], newOrder);
      return { previousData };
    },
    onError: (err, newOrder, context) => {
      queryClient.setQueryData(["places", props.token], context?.previousData);
      toast.error(err.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["places", props.token]);
    },
  });

  // USER LANGUAGE DETECTION
  useEffect(() => {
    // const userLocale = getUserLocale();
    // setUserLanguage(userLocale.slice(0, 2));
    setUserLanguage("en");
  }, []);

  const handleAdd = () => {
    if (!sessionData?.googleId) return toast("Please login to add a city");
    if (!selectedCity) return toast("Please input a city to add");
    // const { adminName1, ...rest } = selectedCity;
    const { adminName1, value, label, cityName, countryName, countryCode, lat, lng, fcl, fcodeName } = selectedCity;
    const stringValue = value.toString();
    // setSelectedCity({ adminName: adminName1, value: stringValue, label, cityName, countryName, countryCode, lat, lng, fcl, fcodeName });
    const transformedCity = {
      adminName: adminName1,
      value: stringValue,
      label,
      cityName,
      countryName,
      countryCode,
      lat,
      lng,
      fcl,
      fcodeName,
    };

    const isCityExist = cityArr.some((city) => city.value == value);
    toast("City already exists");
    if (isCityExist) return;

    const updatedCityArr = [transformedCity, ...cityArr];
    setCityArr(updatedCityArr);
    setSelectedCity(null);

    // localStorage.setItem("town-hunt-cities", JSON.stringify(updatedCityArr));
    if (sessionData) addCityMutation.mutate(transformedCity);
    // toast.success("City Added");
  };

  const handleDelete = (city) => {
    const updatedCityArr = cityArr.filter((c) => c.value !== city.value);
    setCityArr(updatedCityArr);
    // localStorage.setItem("town-hunt-cities", JSON.stringify(updatedCityArr));
    deleteCityMutation.mutate(city);
    // toast.success("City Deleted");
  };

  useEffect(() => {
    setIsInitialized(true);
  }, []);

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

  const displayedCities = (() => {
    if (!Array.isArray(cityArr)) return [];
    let filteredCities = cityArr;
    // Apply filter by type if needed
    if (filterType) {
      filteredCities = filteredCities.filter((city) => city.fcl === filterType);
    }
    // Apply search filter if needed
    if (searchQuery) {
      filteredCities = filteredCities.filter((city) => city.cityName && city.cityName.toLowerCase().includes(searchQuery.toLowerCase()));
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
      // if (!response.ok) throw new Error("Failed to fetch Wikipedia data");
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
    if (activeCity && imageContainerRef.current && !imageContainerRef.current.contains(event.target) && !event.target.closest(".city-cityname")) {
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

  // const [mounted, setMounted] = useState(false);
  // useEffect(() => {
  //     setMounted(true)
  // }, []);
  // if (!mounted) return null;

  return (
    <div className="home-page">
      <div className="home-content">
        <div className="func-row">
          <div className="func-left">
            <input type="text" className="search-input" placeholder="Search List" style={isSearching ? { display: "flex" } : { display: "none" }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} ref={searchInputRef} />
          </div>
          <div className="func-right">
            {sessionData?.googleId && (
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
            )}
            {sessionData?.googleId && (
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
            )}
            {sessionData?.googleId && (
              <div className="func-each">
                <Link href="/map" className="func-each-icon">
                  <FontAwesomeIcon icon={faMap} className="func-each-icon" />
                </Link>
              </div>
            )}

            {/* {!sessionData?.googleId && (<Link href={`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/google`} className="login-button" style={{marginLeft: "10px"}}>Login</Link>)} */}
            {/* {!sessionData?.googleId && (
              <Link href="/login" className="login-button" style={{ marginLeft: "10px" }}>Login</Link>
            )} */}
            {/* {data?.googleId && (<Link href={`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/logout`} className="func-each" style={{marginLeft: "10px"}}>Logout</Link>)} */}
            {sessionData?.googleId && (
              <div onClick={handleLogout} className="logout-button" style={{ marginLeft: "10px", cursor: "pointer" }}>Logout</div>
            )}
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
          <div className="no-city-div">{/* ... (keep your empty state) */}</div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            id="unique-dnd-context-id" //NEED THIS OR Hydration failed
          >
            <SortableContext items={displayedCities.map((city) => city.value)} strategy={verticalListSortingStrategy}>
              <div className="city-list">
                {displayedCities?.map((city, index) => (
                  <SortableItem key={city.value} city={city} index={index} isEditing={isEditing} handleDelete={handleDelete} userLanguage={userLanguage} activeCity={activeCity} wikiImage={wikiImage} handleCityClick={handleCityClick} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <div
                  className="city-list-container"
                  style={{
                    //   background: 'white',
                    //   boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                    cursor: "grabbing",
                  }}>
                  <div className="city-list-row">
                    <div className="city-name">
                      <div className="city-cityname">{displayedCities.find((city) => city.value === activeId)?.cityName}</div>
                      <div className="city-countryname">{getFlagEmoji(displayedCities.find((city) => city.value === activeId)?.countryCode)}&nbsp;{displayedCities.find((city) => city.value === activeId)?.countryName}</div>
                    </div>
                    <div className="city-button">
                      <Link href={`https://${userLanguage}.wikipedia.org/wiki/`} target="_blank" rel="noreferrer" className="city-wiki-link">
                        <FontAwesomeIcon icon={faCircleInfo} className="info-icon" />
                      </Link>
                      <Link href={`https://www.google.com/maps/search/`} target="_blank" rel="noreferrer" className="city-map-link">
                        <FontAwesomeIcon icon={faLocationDot} className="map-icon" />
                      </Link>
                      {!isEditing && (
                        <div className="drag-handle">
                          <FontAwesomeIcon icon={faGripVertical} className="drag-icon" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}

        {cityArr?.length === 0 && (
          <div className="no-place-container">
            <h1 style={{ textAlign: "center" }} className="no-place-title">Town Hunt</h1>
            <p style={{ textAlign: "center" }} className="no-place-text">Login to save places.</p>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
              <Link href="/login" className="no-place-login">Login</Link>
              <Link href="/about" style={{ textAlign: "center" }} className="no-place-link">What is this?</Link>
            </div>

            <img src="https://cdn.pixabay.com/photo/2024/06/29/15/16/ai-generated-8861653_640.png" alt="" style={{ width: "200px", margin: "auto", marginTop: "10px", display: "flex", justifyContent: "center", alignItems: "center" }} />
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
