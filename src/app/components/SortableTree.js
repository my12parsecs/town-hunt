"use client"

import React, { useState, useEffect } from 'react';
import { SimpleTreeItemWrapper, SortableTree } from 'dnd-kit-sortable-tree';

import "../stylesheets/sortableTree.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export const MinimalViable = () => {
//   const [items, setItems] = useState(initialViableMinimalData);
    const [items, setItems] = useState(testJson.trip);

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



  return (
    <SortableTree
        items={items}
        onItemsChanged={handleChange}
        TreeItemComponent={MinimalTreeItemComponent}
        // sortableProps={{
        //     strategy: {
        //     // Prevent date-line items from becoming children
        //     validateDrop: ({ active, over }) => {
        //         const activeItem = items.find(item => item.id === active.id);
        //         return !(activeItem?.type === "date-line" && over?.data?.current?.parentId);
        //     }
        //     }
        // }}
        // canDropTargets={({ item, parent }) => {
        //     return item.type !== "date-line" || !parent;
        // }}
    />
  );
};



const handleDelete = (item) => {
    console.log(item);
};

/*
 * Here's the component that will render a single row of your tree
 */
const MinimalTreeItemComponent = React.forwardRef(function MinimalTreeItemComponent(props, ref) {
  return (
    /* you could also use FolderTreeItemWrapper if you want to show vertical lines.  */
    <div className='sortable-tree-row-container'>
        <SimpleTreeItemWrapper {...props} ref={ref} className={`sortable-tree-row ${props.item.type=== "date-line" ? "date-line-row" : "" }`} showDragHandle={true}>
            <div className='sortable-tree-text'>{props.item.value}</div>
        </SimpleTreeItemWrapper>
        <div className='sortable-tree-delete-icon-container'>
            <FontAwesomeIcon icon={faTrash} className="sortable-tree-delete-icon" onClick={() => handleDelete(props.item)} />
        </div>
    </div>

  );
});

const canBeChild = (dragItem, dropItem) => {
    // Date lines should never be children
    if (dragItem.type === "date-line") {
      return false;
    }
    // Allow other items to be children as normal
    return true;
};



const initialViableMinimalData = [
  {
    id: '1',
    value: 'Jane',
    children: [
      { id: '4', value: 'John' },
      { id: '5', value: 'Sally' },
    ],
  },
  { id: '2', value: 'Fred', children: [{ id: '6', value: 'Eugene' }] },
  { id: '3', value: 'Helen', canHaveChildren: false },
];



const testJson = {
    "title": "France Trip",
    "trip": [
        {
            id: '1',
            date: '2024-11-03',
            value: 'Paris',
            children: [
                { id: '4', value: 'Eiffel Tower', canHaveChildren: (dragItem) => {return dragItem.type === "date-line" ? false : true;} },
                { id: '5', value: 'The Louvre', canHaveChildren: (dragItem) => {return dragItem.type === "date-line" ? false : true;} },
            ],
            canHaveChildren: (dragItem) => {return dragItem.type === "date-line" ? false : true;}
        },
        { 
            id: "2",
            date: '2024-11-04',
            value: 'Blois',
            children: [{ id: '6', value: 'Chateau de Blois', canHaveChildren: (dragItem) => {return dragItem.type === "date-line" ? false : true;} }],
            canHaveChildren: (dragItem) => {return dragItem.type === "date-line" ? false : true;}
        },
        { id: "3", date: '2024-11-05', value: 'Date Change', type: "date-line", canHaveChildren: false },
    ]
}