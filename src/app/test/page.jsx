"use client"


// import { useState, useRef, useEffect } from 'react';

// export default function ToggleInput() {
//   const [isInputVisible, setIsInputVisible] = useState(false);
//   const inputRef = useRef(null);

//   const handleDocumentClick = (event) => {
//     if (inputRef.current && !inputRef.current.contains(event.target)) {
//       setIsInputVisible(false);
//     }
//   };

//   useEffect(() => {
//     if (isInputVisible) {
//       document.addEventListener('click', handleDocumentClick);
//     } else {
//       document.removeEventListener('click', handleDocumentClick);
//     }
//     return () => document.removeEventListener('click', handleDocumentClick);
//   }, [isInputVisible]);

//   return (
//     <div ref={inputRef}>
//       {isInputVisible && <input />}
//       <div onClick={() => setIsInputVisible(true)}>Open</div>
//     </div>
//   );
// }


import { useState, useRef, useEffect } from 'react';

export default function ToggleInput() {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const containerRef = useRef(null);

  const handleDocumentClick = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsInputVisible(false);
    }
  };

  useEffect(() => {
    if (isInputVisible) {
      document.addEventListener('click', handleDocumentClick);
    } else {
      document.removeEventListener('click', handleDocumentClick);
    }
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [isInputVisible]);

  return (
    <div ref={containerRef}>
      {isInputVisible && <input />}
      <div onClick={() => setIsInputVisible((prev) => !prev)}>Open</div>
    </div>
  );
}