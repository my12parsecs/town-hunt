// "use client"

import React, { useEffect } from 'react';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faLocationDot } from '@fortawesome/free-solid-svg-icons';

import dayjs from 'dayjs';
// import 'dayjs/locale/en';
// import 'dayjs/locale/es';
// import 'dayjs/locale/fr';

import getFlagEmoji from './GetFlagEmoji';

const EachTripList = ({ eachTripJson, userLanguage, numOfDays, setNumOfDays }) => {
    // Group items by their date chunks
    const groupByDate = (trip) => {
        const grouped = [];
        let currentGroup = { date: null, items: [], lastGeonameId: null, lastItem: null };
        let lastGeonameId = null;
        let lastGroupIndex = -1;

        trip.forEach((item) => {
            if (item.type === 'date-line') {
                if (currentGroup.items.length > 0) {
                    grouped.push({ ...currentGroup });
                    lastGroupIndex = grouped.length - 1;
                }
                currentGroup = { date: item.date, items: [], lastGeonameId: currentGroup.lastGeonameId, lastItem: currentGroup.lastItem };
            } else {
                const isSameAsPrevious = item.geonameId === lastGeonameId;

                if (currentGroup.items.length === 0 && isSameAsPrevious && lastGroupIndex >= 0) {
                    // Mark the last item of the previous group
                    const prevGroup = grouped[lastGroupIndex];
                    if (prevGroup.items.length > 0) {
                        const lastItem = prevGroup.items[prevGroup.items.length - 1];
                        lastItem.isSameLast = true;
                    }
                    
                    // Add the current item as a new group with isSameFirst flag
                    currentGroup.items.push({
                        ...item,
                        isSameFirst: true,
                        isSameBetween: true // Add this flag for items that are both first and last
                    });
                } else {
                    // Add item to current group normally
                    currentGroup.items.push({
                        ...item,
                        isSameFirst: currentGroup.items.length === 0 && isSameAsPrevious,
                        isSameLast: false
                    });
                }

                lastGeonameId = item.geonameId;

            }
        });

        if (currentGroup.items.length > 0) {
            grouped.push({ ...currentGroup });
        }

        return grouped;
    };

    const getItemClassNames = (item) => {
        const classNames = ['each-trip-list-item'];
        
        if (item.isSameLast) classNames.push('each-trip-list-item-same-last');
        if (item.isSameFirst) classNames.push('each-trip-list-item-same-first');
        if (item.isSameLast && item.isSameFirst) classNames.push('each-trip-list-item-same-between');
        
        return classNames.join(' ');
    };

    const groupedTrips = groupByDate(eachTripJson.trip);
    const startDate = eachTripJson.startDate;
    const nextDay = dayjs(startDate).add(1, 'day').format('YYYY-MM-DD');
    // console.log(nextDay);

    // setNumOfDays(groupedTrips.length);
    useEffect(() => {
        setNumOfDays(groupedTrips.length);
    }, [groupedTrips.length, setNumOfDays]);

    return (
        <div className='each-trip-list'>
            {/* <div> */}
                {groupedTrips.map((group, index) => (          
                    <div key={index} className='each-date-container'>
                        <div className='each-date-left'>
                            {index === 0 ? (
                                <div className='each-date-left-inner'>
                                    <div className='each-date-left-month'>{dayjs(startDate).add(index, 'day').format('MMM')}</div>
                                    <div className='each-date-left-day'>{dayjs(startDate).add(index, 'day').format('D')}</div>
                                </div>
                            ) : (
                                <div className='each-date-left-inner'>
                                    <div className='each-date-left-month'>{dayjs(startDate).add(index, 'day').format('MMM')}</div>
                                    <div className='each-date-left-day'>{dayjs(startDate).add(index, 'day').format('D')}</div>
                                </div>
                            )}
                            {/* { index !== 0 && group.date ? group.date.slice(8, 10) : ""} */}
                        </div>
                        <div className='each-date-right'>
                            {/* <div className='each-date-right-inner'> */}
                                {group.items.map((item) => (
                                    <div key={item.id} className={getItemClassNames(item)}>
                                        <div className='each-trip-list-item-title-row' style={item.isSameFirst ? {display: "none"} : {}}>
                                            <h3 className='each-trip-list-item-title'>{getFlagEmoji(item.countryCode)} {item.value}</h3>
                                            <div className='each-trip-list-item-buttons'>
                                                <Link href={`https://${userLanguage}.wikipedia.org/wiki/${item.value}`} target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faCircleInfo} className="each-trip-list-item-info-icon"/></Link>
                                                <Link href={`https://www.google.com/maps/search/${item.value}`} target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faLocationDot} className="each-trip-list-item-map-icon"/></Link>
                                            </div>
                                        </div>
                                        {item.children && item.children.length > 0 && (
                                            <div style={{marginLeft: "18px"}}>
                                                {item.children.map((child) => (
                                                    <div key={child.id} style={{ borderRadius: "5px", padding: "10px"}}>
                                                        <div>{child.value}</div>
                                                        {child.children && child.children.length > 0 && (
                                                            <div>
                                                                {child.children.map((grandchild) => (
                                                                    <div key={grandchild.id}>{grandchild.value}</div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            {/* </div> */}
                        </div>
                    </div>
                ))}
            {/* </div> */}
        </div>
    );
};

export default EachTripList;
