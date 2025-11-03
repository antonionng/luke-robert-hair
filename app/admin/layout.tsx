import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit, DM_Sans } from "next/font/google";
import "../globals.css";

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
  title: "CRM Dashboard | Luke Robert Hair",
  description: "Professional CRM for managing leads, bookings, and partnerships",
  robots: "noindex, nofollow", // Don't index admin area
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${displayFont.variable} ${headingFont.variable} ${bodyFont.variable}`}>
      <body className="font-body admin-dark antialiased">
        {children}
      </body>
    </html>
  );
}



