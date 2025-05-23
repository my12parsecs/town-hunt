import { Toaster } from "react-hot-toast";

import { Inter, Geist_Mono } from "next/font/google";
import "./stylesheets/globals.css";

import Provider from "./provider";

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const inter = Inter({
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const metaInfo = {
  title: "Town Hunt",
  description: "Quickly bookmark places - Towns, Mountains, Landmarks, Parks, Roads...",
  url: "https://town-hunt.vercel.app",
  image: "https://utfs.io/f/XBVzUJO68SmleETAPiagkEfviNmOUGcXW17rB5ndQZ8I6zyt",
};

export const metadata = {
  title: metaInfo.title,
  description: metaInfo.description,
  keywords: ["destination", "travel", "map", "bookmark", "location"],
  openGraph: {
    title: metaInfo.title,
    description: metaInfo.description,
    url: metaInfo.url,
    images: [
      {
        url: metaInfo.image,
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
    images: [metaInfo.image],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <Toaster />
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
