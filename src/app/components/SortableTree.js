"use client"

import React, { useState, useEffect } from 'react';
import { SimpleTreeItemWrapper, SortableTree } from 'dnd-kit-sortable-tree';

import "../stylesheets/sortableTree.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

export const MinimalViable = ({tripList, newPlace, setNewPlace}) => {
//   const [items, setItems] = useState(initialViableMinimalData);
    const [items, setItems] = useState(tripList);

    console.log("ITEMS", items);
    

    useEffect(() => {
        // setItems(JSON.parse(localStorage.getItem("town-hunt-trip")));
    }, []);


  useEffect(() => {
    // Save the items to localStorage whenever they change
    localStorage.setItem("town-hunt-trip", JSON.stringify(items));
  }, [items]);

  const handleChange = (updatedItems) => {
    setItems(updatedItems);
  };

  const generateUniqueId = () => {
    return `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  }

  useEffect(() => {
    if(newPlace){
      const newItem = {
        id: generateUniqueId(),
        value: newPlace.cityName,
        // children: [{
        //   id: newPlace.cityName,
        //   value: newPlace.cityName,
        //   canHaveChildren: (dragItem) => {return dragItem.type === "date-line" ? false : true;}
        // }],
        canHaveChildren: (dragItem) => {return dragItem.type === "date-line" ? false : true;}
      }
      setItems([...items, newItem]);
      setNewPlace(null);
    }
  }, [newPlace]);


  return (
    <SortableTree
        items={items}
        onItemsChanged={handleChange}
        // TreeItemComponent={MinimalTreeItemComponent}
        TreeItemComponent={(props) => (
            <MinimalTreeItemComponent {...props} items={items} setItems={setItems} />
        )}
    />
  );
};



// const handleDelete = (item) => {
//     console.log(item);
// };
const handleDelete = (item, items, setItems) => {
    // Recursive function to remove an item and its children from the tree
    const deleteItem = (tree, idToDelete) => {
      return tree
        .filter(item => item.id !== idToDelete)
        .map(item => ({
          ...item,
          children: item.children ? deleteItem(item.children, idToDelete) : undefined,
        }));
    };
  
    // Update the tree structure
    const updatedItems = deleteItem(items, item.id);
    setItems(updatedItems);
  };

/*
 * Here's the component that will render a single row of your tree
 */
const MinimalTreeItemComponent = React.forwardRef(function MinimalTreeItemComponent(props, ref) {
    // const { items, setItems } = props; // Add props for items and setItems
    const { item, setItems, items, ...rest } = props; // Extract props to avoid passing them to DOM elements

    return (
        /* you could also use FolderTreeItemWrapper if you want to show vertical lines.  */
        <div className='sortable-tree-row-container'>
            <div className='sortable-tree-row-top'>
                <SimpleTreeItemWrapper {...rest} ref={ref} className={`sortable-tree-row ${props.item.type=== "date-line" ? "date-line-row" : "" }`} showDragHandle={true}>
                    <div className='sortable-tree-text'>{props.item.value}</div>
                </SimpleTreeItemWrapper>
                <div className='sortable-tree-add-icon-container'>
                    <FontAwesomeIcon icon={faPlus} className="sortable-tree-add-icon"/>
                </div>
                <div className='sortable-tree-delete-icon-container'>
                    <FontAwesomeIcon icon={faTrash} className="sortable-tree-delete-icon" onClick={() => handleDelete(props.item, items, setItems)} />
                </div>
            </div>
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



