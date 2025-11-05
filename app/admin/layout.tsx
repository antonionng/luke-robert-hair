import type { Metadata } from "next";

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
  return children;
}



