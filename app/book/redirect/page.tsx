'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import RedirectTransition from '@/components/booking/RedirectTransition';

function RedirectContent() {
  const searchParams = useSearchParams();
  
  const customerName = searchParams.get('name') || 'Customer';
  const salonName = searchParams.get('salon') || '';
  const salonCity = searchParams.get('city') || '';
  const salonAddress = searchParams.get('address') || '';
  const salonPhone = searchParams.get('phone') || '';
  const redirectUrl = searchParams.get('url') || '';

  if (!redirectUrl || !salonName) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Invalid Request</h1>
          <p className="text-graphite/70 mb-6">
            Sorry, we couldn't process your redirect request.
          </p>
          <a href="/book" className="btn-primary inline-block">
            Return to Booking
          </a>
        </div>
      </div>
    );
  }

  return (
    <RedirectTransition
      customerName={customerName}
      salonName={salonName}
      salonCity={salonCity}
      salonAddress={salonAddress}
      salonPhone={salonPhone}
      redirectUrl={redirectUrl}
      autoRedirectSeconds={5}
    />
  );
}

export default function RedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sage/30 border-t-sage rounded-full animate-spin mx-auto mb-4" />
          <p className="text-graphite/70">Loading...</p>
        </div>
      </div>
    }>
      <RedirectContent />
    </Suspense>
  );
}






