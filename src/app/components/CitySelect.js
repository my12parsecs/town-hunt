"use client"

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faLocationDot, faMountain, faWater, faRoad, faTrain, faLandmark, faSignsPost } from '@fortawesome/free-solid-svg-icons';
import getUserLocale from "get-user-locale";

import getFlagEmoji from "./GetFlagEmoji";


// Dynamically import AsyncSelect to disable SSR
const AsyncSelect = dynamic(() => import('react-select/async'), {
  ssr: false,
  loading: () => 
    <div className="loading-select">
        <div className="loading-placeholder">Search Town</div>
        <div className="loading-icon">
            <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="css-tj5bde-Svg"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg>
        </div>
    </div>
});

const CitySelect = ({ setSelectedCity }) => {
  const [userLanguage, setUserLanguage] = useState("");



  const fetchCities = async (inputValue) => {
    try {
      const response = await fetch(`/api/city?name=${inputValue}&lang=${userLanguage}`);
      const data = await response.json();

        if (data.geonames && Array.isArray(data.geonames)) {
          console.log(data.geonames);
          
            return data.geonames.map((city) => ({
                value: city.geonameId,
                label: `${city.name}, ${city.countryName}`,
                cityName: city.name,
                adminName1: city.adminName1,
                countryName: city.countryName,
                countryCode: city.countryCode,
                lat: city.lat,
                lng: city.lng,
                fcl: city.fcl,
                fcodeName: city.fcodeName
            })).reverse();
        }else{
            return []
        }
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  };

  const debouncedFetchCities = (inputValue, callback) => {
    clearTimeout(debouncedFetchCities.timer); // Clear any pending timer
    debouncedFetchCities.timer = setTimeout(async () => {
      const results = await fetchCities(inputValue);
      callback(results); // Pass the results back to AsyncSelect
    }, 200); // Adjust debounce delay here
  };




  const [prefersDarkScheme, setPrefersDarkScheme] = useState(true);
  const [dataTheme, setDataTheme] = useState("dark");



  useEffect(() => {
    setPrefersDarkScheme(window.matchMedia("(prefers-color-scheme: dark)"))
    setDataTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")

    const userLocale = getUserLocale();
    setUserLanguage(userLocale.slice(0, 2));
  }, []);

  useEffect(() => {
    setDataTheme(prefersDarkScheme.matches ? "dark" : "light")
  }, [prefersDarkScheme]);

  // console.log(dataTheme);
  // console.log(userLanguage);


  const customComponents = {
    Option: ({ data, innerRef, innerProps }) => (
      <div ref={innerRef} {...innerProps} style={{ padding: "10px", cursor: "pointer" }}>
        {/* {getFlagEmoji(data.countryCode)} */}
        {data.fcl === "P" && <FontAwesomeIcon icon={faLocationDot} className="option-icon" />}
        {data.fcl === "T" && <FontAwesomeIcon icon={faMountain} className="option-icon" />}
        {data.fcl === "H" && <FontAwesomeIcon icon={faWater} className="option-icon" />}
        {data.fcl === "L" && <FontAwesomeIcon icon={faSignsPost} className="option-icon" />}
        {data.fcl === "S" && <FontAwesomeIcon icon={faLandmark} className="option-icon" />}
        {data.fcl === "U" && <FontAwesomeIcon icon={faWater} className="option-icon" />}
        {data.fcl === "V" && <FontAwesomeIcon icon={faTree} className="option-icon" />}
        {data.fcodeName === "road" && <FontAwesomeIcon icon={faRoad} className="option-icon" />}
        {data.fcodeName === "railroad" && <FontAwesomeIcon icon={faTrain} className="option-icon" />}
        <strong>{data.cityName}</strong>
        {/* <span className="option-fcodename">{data.fcl !== "P" ? data.fcodeName.charAt(0).toUpperCase() + data.fcodeName.slice(1) : null}</span> */}
        <br />
        <div className="option-bottom"><span className="option-flag">{getFlagEmoji(data.countryCode)}</span> {data.fcl !== "P" && data.fcodeName ? `${data.fcodeName.charAt(0).toUpperCase() + data.fcodeName.slice(1)} in` : null} {data.adminName1 ? `${data.adminName1},` : null} {data.countryName}</div>
      </div>
    ),
    // SingleValue: ({ data }) => (
    //   <div>{data.label}</div>
    // ),
  };

  

  const countrySelectStyle = {
    control: (provided, state) => ({
      display: "flex",
      alignItems: "center",
      border: dataTheme === "dark" ? 0 : "0.5px solid gray",
      cursor: 'pointer',
    //   backgroundColor: dataTheme === "dark" ? "#181818" : "#fff",
        backgroundColor: "transparent",
      color: dataTheme === "dark" ? "#fff" : "black",
      borderRadius: "5px",
      border: "#696969 0.5px solid",
      boxShadow: 'none',
      width: "163px",
      height: "39px",
      cursor: "text",

      backgroundColor: dataTheme === "dark" ? "rgba(255, 255, 255, 0.04)" : "#fff",
      backgroundColor: dataTheme === "dark" ? "#181818" : "#fff",
      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(5.4px)",
      webkitBackdropFilter: "blur(5.4px)"
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      height: '30px',
      paddingLeft: "10px",
      paddingTop: "2px",
      fontSize: "16px",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: dataTheme === "dark" ? "#fff" : "black",
      padding: '5px 0px',
      borderRadius: '4px',
      fontSize: "16px",
      whiteSpace: 'nowrap',
      overflow: 'visible',
      textOverflow: 'clip',
      lineHeight: '10px',
    }),
    option: (provided, state) => ({
      ...provided,
      cursor: 'pointer',
      backgroundColor: state.isFocused
        ? (dataTheme === "dark" ? "#444" : "#e6e6e6")
        : (dataTheme === "dark" ? "#181818" : "#fff"),
      color: state.isSelected
        ? (dataTheme === "dark" ? "white" : "#000")
        : state.isFocused
        ? (dataTheme === "dark" ? "white" : "black")
        : dataTheme === "dark"
        ? "#fff"
        : "black",
      fontSize: "13px",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: dataTheme === "dark" ? "#181818" : '#fff',
      // width: "163px",
      width: "280px",
      height: "auto",
      borderRadius: "5px",
    }),
    indicatorSeparator: () => ({
      display: 'none'
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: '20px',
      padding: "0px",
      margin: "auto",
      marginRight: "5px"
    }),
    dropdownIndicator: (provided, state) => ({
      color: state.isSelected
        ? (dataTheme === "dark" ? "white" : "#1E1E1E")
        : state.isFocused
        ? (dataTheme === "dark" ? "white" : "#1E1E1E")
        : dataTheme === "dark"
        ? "#fff"
        : "#1E1E1E",
      width: "20px",
      height: "20px",
      opacity: "1",
      transition: "none",
      borderLeft: "none",
      padding: "auto"
    }),
    input: (provided) => ({
      ...provided,
      color: (dataTheme === "dark" ? "white" : "#1E1E1E"),
    }),
  };

  return (
    <AsyncSelect
      loadOptions={(inputValue, callback) => debouncedFetchCities(inputValue, callback)}
      styles={countrySelectStyle}
      components={customComponents}
      isSearchable={true}
    //   onChange={onCityChange}
      onChange={(selectedOption)=>setSelectedCity(selectedOption)}
      placeholder="Search Town"
      menuPlacement="top"
    />
  );
};

export default CitySelect;
