"use client"

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

import getUserLocale from "get-user-locale";


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


  // Fetch cities based on user input
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
                countryName: city.countryName,
                countryCode: city.countryCode,
                lat: city.lat,
                lng: city.lng,
                fcl: city.fcl
            })).reverse();
        }else{
            return []
        }
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  };

  const [prefersDarkScheme, setPrefersDarkScheme] = useState(true);
  const [dataTheme, setDataTheme] = useState("dark");



  useEffect(() => {
    setPrefersDarkScheme(window.matchMedia("(prefers-color-scheme: dark)"))

    const userLocale = getUserLocale();
    setUserLanguage(userLocale.slice(0, 2));
  }, []);

  useEffect(() => {
    setDataTheme(prefersDarkScheme.matches ? "dark" : "light")
  }, [prefersDarkScheme]);

  // console.log(dataTheme);
  console.log(userLanguage);
  

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
      width: "163px",
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
      loadOptions={fetchCities}
      styles={countrySelectStyle}
      isSearchable={true}
    //   onChange={onCityChange}
        onChange={(selectedOption)=>setSelectedCity(selectedOption)}
      placeholder="Search Town"
      menuPlacement="top"
    />
  );
};

export default CitySelect;
