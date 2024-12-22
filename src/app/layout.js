import { Inter, Geist_Mono } from "next/font/google";
import "./stylesheets/globals.css";

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
  title: "Save Places Around the World",
  description: "Quickly bookmark places.",
  url: "https://town-hunt.vercel.app",
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
        url: 'https://utfs.io/f/XBVzUJO68SmlXBO3VNF68SmlRODV7F6NTniEb5ZJYULg4Qsv',
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
    images: ['https://utfs.io/f/XBVzUJO68SmlXBO3VNF68SmlRODV7F6NTniEb5ZJYULg4Qsv'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
