import type { Metadata } from "next";
import "./globals.css";
import { SocialMediaFloater } from "@/components/SocialMediaFloater";
export const metadata: Metadata = {
  title: "Budha Rooms Alicante | Supreme Luxury Experience",
  description: "Exclusividad, confort y la mejor ubicación en el corazón de Alicante.",
  openGraph: {
    title: "Budha Rooms Alicante | Supreme Luxury Experience",
    description: "Experimente el corazón vibrante de la ciudad con un entorno de paz absoluta.",
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
    description: "Exclusividad y diseño de vanguardia.",
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
      </head>
      <body className="font-body min-h-screen bg-background text-on-background flex flex-col m-0 p-0 overflow-x-hidden relative">
        {children}
        <SocialMediaFloater />
      </body>
    </html>
  );
}
