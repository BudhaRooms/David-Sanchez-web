import type { Metadata } from "next";
import "./globals.css";
import { SocialMediaFloater } from "@/components/SocialMediaFloater";
import { CookieBanner } from "@/components/CookieBanner";
export const metadata: Metadata = {
  title: "Budha Rooms Alicante",
  description: "El mejor alojamiento de toda la provincia de Alicante, descubre nuestras instalaciones.",
  openGraph: {
    title: "Budha Rooms Alicante",
    description: "El mejor alojamiento de toda la provincia de Alicante, descubre nuestras instalaciones.",
    url: "https://budharooms.es",
    siteName: "Budha Rooms",
    images: [
      {
        url: "/logo_stitch.png",
        width: 1200,
        height: 630,
        alt: "Budha Rooms Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Budha Rooms Alicante",
    description: "El mejor alojamiento de toda la provincia de Alicante.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className="dark antialiased scroll-smooth"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Cinzel+Decorative:wght@400;700;900&family=Noto+Serif:ital,wght@0,300;0,400;0,700;1,400&family=Marcellus&family=Manrope:wght@300;400;600&family=Pirata+One&display=swap" rel="stylesheet" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body min-h-screen bg-background text-on-background flex flex-col m-0 p-0 overflow-x-hidden relative">
        {children}
        <SocialMediaFloater />
        <CookieBanner />
      </body>
    </html>
  );
}
