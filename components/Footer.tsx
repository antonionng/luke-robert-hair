import Link from 'next/link';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-sage text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-playfair font-light">Luke Robert Hair</h3>
            <p className="text-sage-light text-sm leading-relaxed">
              Precision hairdressing and professional education in Cheshire & Berkshire.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-medium text-lg">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/salon" className="text-sage-light hover:text-white transition-colors">
                  Salon Services
                </Link>
              </li>
              <li>
                <Link href="/education" className="text-sage-light hover:text-white transition-colors">
                  Education
                </Link>
              </li>
              <li>
                <Link href="/insights" className="text-sage-light hover:text-white transition-colors">
                  Insights
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-sage-light hover:text-white transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/referrals" className="text-sage-light hover:text-white transition-colors inline-flex items-center gap-1">
                  Refer a Friend 
                  <span className="inline-block px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">£10 Off</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-medium text-lg">Contact</h4>
            <ul className="space-y-3 text-sm text-sage-light">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>Cheshire & Berkshire</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="flex-shrink-0" />
                <span>07862 054292</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="flex-shrink-0" />
                <span>luke@lukeroberthair.com</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="font-medium text-lg">Follow</h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/lukerobert_hair"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Instagram - @lukerobert_hair"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.facebook.com/luke.hawkins.54/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Facebook - Luke Robert Hair"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="divider-sage my-8 opacity-20"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-sage-light">
          <p>&copy; {new Date().getFullYear()} Luke Robert Hair. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
