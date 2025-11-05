'use client';

import { usePathname } from 'next/navigation';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    // Admin routes don't get Navigation, Footer, or AIAssistant
    return <>{children}</>;
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <AIAssistant />
    </>
  );
}




