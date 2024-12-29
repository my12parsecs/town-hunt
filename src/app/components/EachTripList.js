import React from 'react';

import getFlagEmoji from '../components/GetFlagEmoji';

const EachTripList = ({ eachTripJson }) => {
    // Recursive function to render nested children
    const renderChildren = (children) => {
        if (!children || children.length === 0) return null;

        return (
            <div style={{marginLeft: "15px", marginTop: "10px"}}>
                {children.map((child) => (
                    <div key={child.id} style={{marginTop: "5px", backgroundColor: "#181818", borderRadius: "5px", padding: "10px"}}>
                        <div>{child.value}</div>
                        {child.canHaveChildren !== false && renderChildren(child.children)}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className='each-trip-list'>
            {eachTripJson.trip.map((item) => (
                item.type === "date-line" ? (
                    <div key={item.id} className='each-trip-list-date-line'></div>
                ) : (
                    <div key={item.id} className='each-trip-list-item'>
                        <h3 className='each-trip-list-item-title'>{getFlagEmoji(item.countryCode)} {item.value}</h3>
                        {item.canHaveChildren !== false && renderChildren(item.children)}
                    </div>
                )
            ))}
        </div>
    );
};

export default EachTripList;
