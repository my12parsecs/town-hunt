

import React from 'react';

import "../stylesheets/about.css";


const metaInfo = {
    title: "About | Save Places Around the World",
    description: "About Save Places Around the World",
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

const About = () => {

  return (
    <div className="about-page">
      <h1>Save Places Around the World</h1>
      <p>This is a simple Next.js page template using JSX.</p>
    </div>
  );
};

export default About;
