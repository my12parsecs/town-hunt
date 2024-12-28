"use client"

import React, { useState } from 'react';

import CitySelect from "@/app/components/CitySelect"
import { MinimalViable } from "@/app/components/SortableTree"



export default function EachTrip() {

    const [selectedCity, setSelectedCity] = useState(null);
    const [newPlace, setNewPlace] = useState(null);

    const handleAdd = () => {
        if (!selectedCity) return;
        setNewPlace(selectedCity);
    };

    return (
        <div className="each-trip-page" style={{paddingTop: "50px", height: "100dvh", overflowY: "none"}}>
            <MinimalViable newPlace={newPlace} setNewPlace={setNewPlace} />
            <CitySelect setSelectedCity={setSelectedCity} isMapPage={false} />
            <div onClick={handleAdd}>Add</div>
        </div>
    )

}