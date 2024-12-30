"use client"

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { getUserLocale } from 'get-user-locale';
import dayjs from 'dayjs';

import CitySelect from "@/app/components/CitySelect"
import getFlagEmoji from "@/app/components/GetFlagEmoji"
import getUserLanguage from "@/app/components/GetUserLanguage"
import { MinimalViable } from "@/app/components/SortableTree"
import EachTripList from '@/app/components/EachTripList';


import "../../stylesheets/tripEach.css"

export default function EachTrip() {

    const [userLanguage, setUserLanguage] = useState("");

    const [isEditing, setIsEditing] = useState(false);

    const [selectedCity, setSelectedCity] = useState(null);
    const [newPlace, setNewPlace] = useState(null);

    const [numOfDays, setNumOfDays] = useState(0);

    const handleAdd = () => {
        if (!selectedCity) return;
        setNewPlace(selectedCity);
    };

    const addDateLine = () => {
        setNewPlace({
            id: "date-line-0",
            date: '2024-11-05',
            value: 'Date Line 1',
            type: "date-line",
            canHaveChildren: false,
        });
    };

    useEffect(() => {
        setUserLanguage(getUserLanguage());
    }, []);

    useEffect(() => {
        const userLocale = getUserLocale();
        let langy = userLocale.slice(0, 2)
        // langy = "en"
        require(`dayjs/locale/${langy}`);
        dayjs.locale(langy);

        let localizedFormat = require(`dayjs/plugin/localizedFormat`);
        dayjs.extend(localizedFormat)
    }, []);




    const eachTripJson = {
        "title": "France Trip",
        "startDate": "2024-02-10",
        "trip": [
            {
                id: '1',
                geonameId: "878979",
                value: 'Paris',
                countryCode: 'FR',
                countryName: 'France',
                children: [
                    { id: '4', value: 'Eiffel Tower', children: [{ id: '7', value: 'Observation Deck', canHaveChildren: (dragItem) => {return dragItem.type === "date-line" ? false : true;} }], canHaveChildren: (dragItem) => {return dragItem.type === "date-line" ? false : true;} },
                    { id: '5', value: 'The Louvre', canHaveChildren: (dragItem) => {return dragItem.type === "date-line" ? false : true;} },
                ],
                canHaveChildren: (dragItem) => {return dragItem.type === "date-line" ? false : true;}
            },
            { 
                id: "2",
                geonameId: "234097",
                value: 'Blois',
                countryCode: 'FR',
                countryName: 'France',
                children: [{ id: '6', value: 'Chateau de Blois', canHaveChildren: (dragItem) => {return dragItem.type === "date-line" ? false : true;} }],
                canHaveChildren: (dragItem) => {return dragItem.type === "date-line" ? false : true;}
            },
            { id: "date-line-0", dateId: 0, value: 'Date Line 1', type: "date-line", canHaveChildren: false },
            // { id: "3", date: '2024-11-05', value: 'Date Change', type: "date-line", canHaveChildren: true },
            { 
                id: "38457289574",
                geonameId: "1234",
                value: 'Amboise',
                countryCode: 'FR',
                countryName: 'France',
                children: [{ id: '9898', value: 'Chateau de Amboise', canHaveChildren: (dragItem) => {return dragItem.type === "date-line" ? false : true;} }],
                canHaveChildren: (dragItem) => {return dragItem.type === "date-line" ? false : true;}
            },
            { id: "date-line-1", dateId: 1, value: 'Date Line 1', type: "date-line", canHaveChildren: false },
            { 
                id: "384579898289574",
                geonameId: "1234",
                value: 'Amboise',
                countryCode: 'FR',
                countryName: 'France',
                children: [{ id: '9808998', value: 'Amboise Hotel', canHaveChildren: (dragItem) => {return dragItem.type === "date-line" ? false : true;} }],
                canHaveChildren: (dragItem) => {return dragItem.type === "date-line" ? false : true;}
            },
            { id: "date-line-9", dateId: 2, value: 'Date Line 1', type: "date-line", canHaveChildren: false },
            { 
                id: "38457989828958774",
                geonameId: "1234",
                value: 'Amboise',
                countryCode: 'FR',
                countryName: 'France',
                children: [{ id: '980878', value: 'Amboise Hotel', canHaveChildren: (dragItem) => {return dragItem.type === "date-line" ? false : true;} }],
                canHaveChildren: (dragItem) => {return dragItem.type === "date-line" ? false : true;}
            },
        ]
    }



    return (
        <div className="each-trip-page">
            <div className="each-trip-nav">
                <div style={{marginTop: "20px", marginBottom: "20px"}}><Link href="/trips"><FontAwesomeIcon icon={faAngleLeft} style={{width: "20px", height: "20px"}} /></Link></div>
            </div>


            {!isEditing ? (
                <div className='each-trip-content'>
                    <div className='each-trip-info'>
                        <div className='each-trip-title-row'>
                            <h1>{eachTripJson.title}</h1>
                            <div onClick={() => setIsEditing(!isEditing)} className='each-trip-edit-button'>{isEditing ? "Done" : "Edit"}</div>
                        </div>
                        <div className='each-trip-date-row'>
                            {dayjs(eachTripJson.startDate).format("YYYY") === dayjs(eachTripJson.startDate).add(numOfDays-1, 'day').format("YYYY") ? (
                                <p>{dayjs(eachTripJson.startDate).format("l")} ~ {dayjs(eachTripJson.startDate).add(numOfDays-1, 'day').format('l')}</p>
                            ) : (
                                <p>{dayjs(eachTripJson.startDate).format("l")} ~ {dayjs(eachTripJson.startDate).add(numOfDays-1, 'day').format('l')}</p>
                            )}
                        </div>
                        <div className='each-trip-flag-row'>
                            <p>{getFlagEmoji(eachTripJson.trip[0].countryCode)}</p>
                        </div>
                    </div>
                    <div className='each-trip-list-container'>
                        <EachTripList eachTripJson={eachTripJson} userLanguage={userLanguage} numOfDays={numOfDays} setNumOfDays={setNumOfDays} />
                    </div>
                </div>
            ) : (
                <div>
                    <div className='each-trip-info'>
                        {/* <h1>INPUT {eachTripJson.title}</h1> */}
                        <div className='each-trip-title-row'>
                            <input type="text" className="each-trip-title-input" placeholder="Trip Title" style={{width: "100%"}} value={eachTripJson.title} onChange={(e) => setEachTripJson({...eachTripJson, title: e.target.value})} />
                            <div onClick={() => setIsEditing(!isEditing)} className={`each-trip-edit-button ${isEditing ? "each-trip-edit-button-done" : ""}`}>{isEditing ? "Done" : "Edit"}</div>
                        </div>
                        <div className='each-trip-date-row'>
                            {dayjs(eachTripJson.startDate).format("YYYY") === dayjs(eachTripJson.startDate).add(numOfDays-1, 'day').format("YYYY") ? (
                                <p>{dayjs(eachTripJson.startDate).format("l")} ~ {dayjs(eachTripJson.startDate).add(numOfDays-1, 'day').format('l')}</p>
                            ) : (
                                <p>{dayjs(eachTripJson.startDate).format("l")} ~ {dayjs(eachTripJson.startDate).add(numOfDays-1, 'day').format('l')}</p>
                            )}
                        </div>
                        <div className='each-trip-flag-row'>
                            <p>{getFlagEmoji(eachTripJson.trip[0].countryCode)}</p>
                        </div>
                    </div>
                    <div className='each-trip-edit-list'>
                        <MinimalViable tripList={eachTripJson.trip} newPlace={newPlace} setNewPlace={setNewPlace} />
                    </div>
                    <div className='add-next-day-button'>
                        <FontAwesomeIcon icon={faPlus} className="add-next-day-button-icon"/>
                        Next Day
                    </div>
                    <CitySelect setSelectedCity={setSelectedCity} isMapPage={false} />
                    <div onClick={handleAdd}>Add</div>
                </div>
            )}
        </div>
    )

}