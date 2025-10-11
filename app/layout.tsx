import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit, DM_Sans } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
// import FloatingBookButton from "@/components/FloatingBookButton";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-display",
  display: "swap",
});

const headingFont = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luke Robert Hair | Precision Hairdressing & Professional Education",
  description: "Expert hairdressing and professional education in Cheshire & Oxford. Precision cuts, colour, and advanced training for stylists.",
  keywords: "hairdressing, hair salon, professional education, precision cutting, Cheshire, Oxford, Luke Robert",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${displayFont.variable} ${headingFont.variable} ${bodyFont.variable}`}>
      <body className="font-body bg-offwhite text-graphite antialiased">
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <AIAssistant />
        {/* <FloatingBookButton /> */}
      </body>
    </html>
  );
}
