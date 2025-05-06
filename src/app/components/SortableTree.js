"use client"

import React, { useState, useEffect } from 'react';
import { SimpleTreeItemWrapper, SortableTree } from 'dnd-kit-sortable-tree';

import "../stylesheets/sortableTree.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

export const MinimalViable = ({tripList, setTripList, newPlace, setNewPlace, insertId, setInsertId, uniqueCountries, setUniqueCountries}) => {
//   const [items, setItems] = useState(initialViableMinimalData);
    const [items, setItems] = useState(tripList.trip);

    // console.log("ITEMS", items);


  useEffect(() => {
    // Save the items to localStorage whenever they change
    // localStorage.setItem("town-hunt-trip", JSON.stringify(items));
  }, [items]);

    useEffect(() => {
        setItems(tripList.trip);
        setUniqueCountries(getUniqueCountryCodes(tripList));
    }, [tripList.trip]);


  const handleChange = (updatedItems) => {
    // setItems(updatedItems);
    let dateLineCounter = 0;
    
    const updateDateLineIds = (items) => {
        return items.map(item => {
            const newItem = { ...item };
            // If this is a date line, update its dateId
            if (item.type === "date-line") {
                newItem.dateId = dateLineCounter;
                newItem.value = `Date Line ${dateLineCounter + 1}`;
                dateLineCounter++;
            }
            return newItem;
        });
    };
    // const reorderedItems = updateDateLineIds(updatedItems);
    // setItems(reorderedItems);
    // setTripList({...tripList, trip: reorderedItems});
    // localStorage.setItem("town-hunt-trip", JSON.stringify({...tripList, trip: reorderedItems}));
    const reorderedItems = updateDateLineIds(updatedItems);
    setItems(reorderedItems);
    setTripList(prevState => ({...prevState, trip: reorderedItems}));
  };

  const generateUniqueId = () => {
    return `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  }

  useEffect(() => {
    console.log("newPlace", newPlace);
    console.log("items inside", items);

    if(!newPlace) {
        console.log("newPlace is null");
        return
    };
    
    if(newPlace){
        const dateLines = items.filter(item => item.type === "date-line");
        const maxDateId = dateLines.reduce((max, dateLine) => {
            const currentId = parseInt(dateLine.dateId);
            return currentId > max ? currentId : max;
        }, -1);

        const newItem = newPlace.type === "date-line" ? {
            id: newPlace.id,
            dateId: newPlace.dateId,
            value: newPlace.value,
            type: newPlace.type,
            canHaveChildren: false
        } : {
            id: generateUniqueId(),
            value: newPlace.cityName,
            cityName: newPlace.cityName,
            adminName1: newPlace.adminName1,
            countryName: newPlace.countryName,
            countryCode: newPlace.countryCode,
            fcl: newPlace.fcl,
            fcodeName: newPlace.fcodeName,
            label: newPlace.label,
            lat: newPlace.lat,
            lng: newPlace.lng,
            geonameId: newPlace.value,
            // children: [{
            //   id: newPlace.cityName,
            //   value: newPlace.cityName,
            //   canHaveChildren: (dragItem) => {return dragItem.type === "date-line" ? false : true;}
            // }],
            canHaveChildren: (dragItem) => {return dragItem.type === "date-line" ? false : true;}
        }
        // setItems([...items, newItem]);
        // setNewPlace(null);
        // setTripList({...tripList, trip: [...tripList.trip, newItem]});
        // localStorage.setItem("town-hunt-trip", JSON.stringify(tripList));

        // const updatedItems = [...items, newItem];
        // setItems(updatedItems);
        // setTripList(prevState => ({...prevState, trip: updatedItems}));
        // setNewPlace(null);
    }
  }, [newPlace]);


  return (
    <SortableTree
        items={items}
        onItemsChanged={handleChange}
        // TreeItemComponent={MinimalTreeItemComponent}
        TreeItemComponent={(props) => (
            <MinimalTreeItemComponent {...props} items={items} setItems={setItems} tripList={tripList} setTripList={setTripList} insertId={insertId} setInsertId={setInsertId} uniqueCountries={uniqueCountries} setUniqueCountries={setUniqueCountries} />
        )}
    />
  );
};

const handleInsert = (item, setInsertId) => {
    console.log("handleInsert");
    console.log(item);
    console.log(item.id);
    
    setInsertId(item.id);
};

const handleDelete = (item, items, setItems, tripList, setTripList, setUniqueCountries) => {
    // Recursive function to remove an item and its children from the tree
    const deleteItem = (tree, idToDelete) => {
      return tree.filter(item => item.id !== idToDelete).map(item => ({
          ...item,
          children: item.children ? deleteItem(item.children, idToDelete) : undefined,
        }));
    };

        // Update the tree structure
        const filteredItems = deleteItem(items, item.id);

        // Reorder date line IDs after deletion
        let dateLineCounter = 0;
        const reorderDateLines = (items) => {
            return items.map(item => {
                const newItem = { ...item };
                
                if (item.type === "date-line") {
                    newItem.dateId = dateLineCounter;
                    dateLineCounter++;
                }
                
                if (item.children && item.children.length > 0) {
                    newItem.children = reorderDateLines(item.children);
                }
                
                return newItem;
            });
        };

        const updatedItems = reorderDateLines(filteredItems);
        setItems(updatedItems);
        setTripList({...tripList, trip: updatedItems});
        setUniqueCountries(getUniqueCountryCodesInner(updatedItems));
        // localStorage.setItem("town-hunt-trip", JSON.stringify({...tripList, trip: updatedItems}));
  };

/*
 * Here's the component that will render a single row of your tree
 */
const MinimalTreeItemComponent = React.forwardRef(function MinimalTreeItemComponent(props, ref) {
    // const { items, setItems } = props; // Add props for items and setItems
    const { item, setItems, items, tripList, setTripList, insertId, setInsertId, uniqueCountries, setUniqueCountries, ...rest } = props; // Extract props to avoid passing them to DOM elements

    return (
        /* you could also use FolderTreeItemWrapper if you want to show vertical lines.  */
        <div className='sortable-tree-row-container'>
            <div className='sortable-tree-row-top'>
                <SimpleTreeItemWrapper {...rest} ref={ref} className={`sortable-tree-row ${props.item.type=== "date-line" ? "date-line-row" : "" }`} showDragHandle={true} manualDrag={true}>
                    <div className='sortable-tree-text'>{props.item.label ? props.item.label : props.item.value}</div>
                </SimpleTreeItemWrapper>
                <div className='sortable-tree-add-icon-container'>
                    <FontAwesomeIcon icon={faPlus} className="sortable-tree-add-icon" onClick={() => handleInsert(props.item, setInsertId)} />
                </div>
                <div className='sortable-tree-delete-icon-container'>
                    <FontAwesomeIcon icon={faTrash} className="sortable-tree-delete-icon" onClick={() => handleDelete(props.item, items, setItems, tripList, setTripList, setUniqueCountries)} />
                </div>
            </div>
            <div className='insert-line' style={insertId === item.id ? {display: "flex"} : {display: "none"}}></div>
            {/* <div className='sortable-tree-row-bottom'>
                <div className='sortable-tree-add-button'>Add</div>
            </div> */}
        </div>

    );
});

const canBeChild = (dragItem, dropItem) => {
    if (dragItem.type === "date-line") {
      return false;
    }
    return true;
};



const getUniqueCountryCodes = (tripData) => {
    if (!tripData?.trip) return new Set();
    
    const countrySet = new Set();
    
    const processItem = (item) => {
      // Skip date-line items
      if (item.type === 'date-line') return;
      
      // Add country code if it exists
      if (item.countryCode) {
        countrySet.add(item.countryCode);
      }
      
      // Recursively process children
      if (item.children && item.children.length > 0) {
        item.children.forEach(processItem);
      }
    };
    
    // Process all items in the trip array
    tripData.trip.forEach(processItem);
    
    return Array.from(countrySet);
  };

const getUniqueCountryCodesInner = (tripData) => {
    if (!tripData) return new Set();
    
    const countrySet = new Set();
    
    const processItem = (item) => {
      // Skip date-line items
      if (item.type === 'date-line') return;
      
      // Add country code if it exists
      if (item.countryCode) {
        countrySet.add(item.countryCode);
      }
      
      // Recursively process children
      if (item.children && item.children.length > 0) {
        item.children.forEach(processItem);
      }
    };
    
    // Process all items in the trip array
    tripData.forEach(processItem);
    
    return Array.from(countrySet);
  };