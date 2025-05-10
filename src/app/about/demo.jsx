
"use client"

import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useState, useEffect } from "react";
import CitySelect from "../components/CitySelect";
import getFlagEmoji from "../components/GetFlagEmoji";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCircleInfo, faPlus, faPen, faCheck, faTrash, faMagnifyingGlass, faFilter, faSort, faMap, faBars, faAngleDown, faAngleUp, faArrowDown, faArrowRight, faPlane, faGripVertical } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const cityData = [
  {
    id: "0",
    value: "123",
    cityName: "Paris",
    countryName: "France",
    countryCode: "FR",
    fcl: "P",
    fcodeName: "capital of a political entity",
    label: "Paris, France",
    lat: "48.85661",
    lng: "2.35222",
    // order: 2
  },
  {
    id: "1",
    value: "456",
    cityName: "Merlion",
    countryName: "Singapore",
    countryCode: "SG",
    fcl: "P",
    fcodeName: "capital of a political entity",
    label: "Merlion, Singapore",
    lat: "1.29028",
    lng: "103.8419",
    // order: 1
  },
  {
    id: "2",
    value: "789",
    cityName: "Darjeeling Himalayan Railway",
    countryName: "India",
    countryCode: "IN",
    fcl: "P",
    fcodeName: "railway",
    label: "Darjeeling Himalayan Railway, India",
    lat: "26.6867",
    lng: "88.1734",
    // order: 0
  },
];

function SortableCity({ city, isEditing, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: city.value });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="city-list-container">
      <div className="city-list-row">
        <div className="city-name">
          <div className="city-cityname">{city.cityName}</div>
          <div className="city-countryname">{getFlagEmoji(city.countryCode)} {city.countryName}</div>
        </div>
        {/* <div className="city-button">
          <a href={`https://en.wikipedia.org/wiki/${city.cityName}`} target="_blank" rel="noreferrer" className="city-wiki-link">
            <FontAwesomeIcon icon={faCircleInfo} className="info-icon" />
          </a>
          <a href={`https://www.google.com/maps/search/${city.cityName}`} target="_blank" rel="noreferrer" className="city-map-link">
            <FontAwesomeIcon icon={faLocationDot} className="map-icon" />
          </a>
        </div> */}
        <div className="city-button">
          <Link href={`https://en.wikipedia.org/wiki/${city.cityName}`} target="_blank" rel="noreferrer" className="city-wiki-link">
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
      </div>
      
      {isEditing && (
        <div className="city-delete-container">
          <div className="city-delete">
            <FontAwesomeIcon icon={faTrash} className="delete-icon" onClick={() => onDelete(city)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Demo() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [sampleCityArr, setSampleCityArr] = useState(cityData);

//   useEffect(() => {
//     setSampleCityArr(cityData);
//   }, []);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true)
    }, []);
    if (!mounted) return null;



  const handleAdd = () => {
    if (!selectedCity) return;
    const { adminName1, value, label, cityName, countryName, countryCode, lat, lng, fcl, fcodeName } = selectedCity;
    const stringValue = value.toString();
    const transformedCity = {
      id: stringValue,
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
    //   order: sampleCityArr.length
    };

    const isCityExist = sampleCityArr.some((city) => city.value === selectedCity.value);
    if (isCityExist) return;

    setSampleCityArr([transformedCity, ...sampleCityArr]);
    setSelectedCity(null);
  };

  const handleDelete = (city) => {
    const updatedCityArr = sampleCityArr.filter((c) => c.value !== city.value);
    setSampleCityArr(updatedCityArr);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = sampleCityArr.findIndex(city => city.value === active.id);
      const newIndex = sampleCityArr.findIndex(city => city.value === over?.id);

      setSampleCityArr((items) => arrayMove(items, oldIndex, newIndex));
        // const newArr = arrayMove(sampleCityArr, oldIndex, newIndex).map((city, index) => ({ ...city, order: index }));
        // setSampleCityArr(newArr);
    }
  };

  return (
    <div>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sampleCityArr.map(city => city.value)} strategy={verticalListSortingStrategy}>
          {sampleCityArr.map((city) => (
            <SortableCity
              key={city.value}
              city={city}
              isEditing={isEditing}
              onDelete={handleDelete}
            />
          ))}
        </SortableContext>
      </DndContext>

      <div className="add-city-row">
        <div style={{ display: "flex" }}>
          <CitySelect setSelectedCity={setSelectedCity} isMapPage={false} />
        </div>
        <div className="city-add-button" onClick={handleAdd}>
          <FontAwesomeIcon icon={faPlus} className="add-icon" />
        </div>
        <div className="city-edit-button" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? <FontAwesomeIcon icon={faCheck} className="edit-icon" /> : <FontAwesomeIcon icon={faPen} className="edit-icon" />}
        </div>
      </div>
    </div>
  );
}
