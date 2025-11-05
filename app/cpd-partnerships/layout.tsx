import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CPD Partnerships for Colleges | Luke Robert Hair',
  description: 'Partner with us to deliver accredited CPD training in communication, coaching, and leadership for your students. Flexible, engaging, results-driven.',
  keywords: [
    'CPD training',
    'college partnerships',
    'accredited courses',
    'student development',
    'NLP training',
    'coaching courses',
    'emotional intelligence',
    'leadership training',
    'college CPD',
    'education partnerships',
  ],
  openGraph: {
    title: 'CPD Partnerships for Colleges | Luke Robert Hair',
    description: 'Partner with us to deliver accredited CPD training for your students',
    type: 'website',
  },
};

export default function CPDPartnershipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}






