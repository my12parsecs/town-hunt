


import React from 'react';
import Link from 'next/link';

import "../stylesheets/about.css";
import "../stylesheets/home.css";
import getFlagEmoji from '../components/GetFlagEmoji';
import Demo from './demo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faCircleInfo, faLocationDot } from '@fortawesome/free-solid-svg-icons';


const metaInfo = {
    title: "About | Bookmark Places Around the World",
    description: "About Bookmark Places",
}

export const metadata = {
  title: metaInfo.title,
  description: metaInfo.description,
  keywords: ["destination", "travel", "map", "bookmark", "location"],
  openGraph: {
    title: metaInfo.title,
    description: metaInfo.description,
    images: [
      {
        url: 'https://utfs.io/f/XBVzUJO68SmlrX8z5gM13s50u9ZcTLxUedCh6PlDAnz72REm',
        width: 500,
        height: 500,
        alt: '',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: metaInfo.title,
    description: metaInfo.description,
    images: ['https://utfs.io/f/XBVzUJO68SmlrX8z5gM13s50u9ZcTLxUedCh6PlDAnz72REm'],
  },
};







export default function Loading(){

  return (
    <div className="about-page">
      <div style={{marginTop: "20px", marginBottom: "20px"}}>
          <Link href="/"><FontAwesomeIcon icon={faAngleLeft} style={{width: "20px", height: "20px"}} /></Link>
      </div>
      {/* <h1>Bookmark Places Around the World</h1> */}
      <h1>Town Hunt</h1>
      <p>Quickly bookmark places - Towns, Mountains, Landmarks, Parks, Roads...</p>

      {/* <img src="https://utfs.io/f/XBVzUJO68SmleETAPiagkEfviNmOUGcXW17rB5ndQZ8I6zyt" alt="" className='image' /> */}


      <p>You can quickly make a list like below.</p>

      <Demo />

    </div>
  );
};