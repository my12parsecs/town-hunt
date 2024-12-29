// import React from 'react';

// import getFlagEmoji from '../components/GetFlagEmoji';

// const EachTripList = ({ eachTripJson }) => {
//     // Recursive function to render nested children
//     const renderChildren = (children) => {
//         if (!children || children.length === 0) return null;

//         return (
//             <div style={{marginLeft: "15px", marginTop: "10px"}}>
//                 {children.map((child) => (
//                     <div key={child.id} style={{marginTop: "5px", backgroundColor: "#181818", borderRadius: "5px", padding: "10px"}}>
//                         <div>{child.value}</div>
//                         {child.canHaveChildren !== false && renderChildren(child.children)}
//                     </div>
//                 ))}
//             </div>
//         );
//     };

//     return (
//         <div className='each-trip-list'>
//             {eachTripJson.trip.map((item) => (
//                 item.type === "date-line" ? (
//                     <div key={item.id} className='each-trip-list-date-line'></div>
//                 ) : (
//                     <div key={item.id} className='each-trip-list-item'>
//                         <h3 className='each-trip-list-item-title'>{getFlagEmoji(item.countryCode)} {item.value}</h3>
//                         {item.canHaveChildren !== false && renderChildren(item.children)}
//                     </div>
//                 )
//             ))}
//         </div>
//     );
// };

// export default EachTripList;



import React from 'react';
import getFlagEmoji from './GetFlagEmoji';

const EachTripList = ({ eachTripJson }) => {
    // Group items by their date chunks
    const groupByDate = (trip) => {
        const grouped = [];
        let currentGroup = { date: null, items: [] };

        trip.forEach((item) => {
            if (item.type === 'date-line') {
                if (currentGroup.items.length > 0) {
                    grouped.push({ ...currentGroup });
                }
                currentGroup = { date: item.date, items: [] };
            } else {
                currentGroup.items.push(item);
            }
        });

        if (currentGroup.items.length > 0) {
            grouped.push({ ...currentGroup });
        }

        return grouped;
    };

    const groupedTrips = groupByDate(eachTripJson.trip);

    return (
        <div className='each-trip-list'>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {groupedTrips.map((group, index) => (
                    <div key={index} className='each-date-container'>
                        <div className='each-date-left'>
                            {group.date}
                        </div>
                        <div className='each-date-right'>
                            <div>
                                {group.items.map((item) => (
                                    <div key={item.id} className='each-trip-list-item'>
                                        <h3 className='each-trip-list-item-title'>{getFlagEmoji(item.countryCode)} {item.value}</h3>
                                        {item.children && item.children.length > 0 && (
                                            <div style={{marginLeft: "15px", marginTop: "10px"}}>
                                                {item.children.map((child) => (
                                                    <div key={child.id} style={{marginTop: "5px", backgroundColor: "#181818", borderRadius: "5px", padding: "10px"}}>
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
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EachTripList;
