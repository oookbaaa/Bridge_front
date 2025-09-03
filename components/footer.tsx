import Link from 'next/link';
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Tunisian Bridge Federation"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-heading font-bold text-xl">
                Federation Tunisienne de Bridge
              </span>
            </div>
            <p className="font-body text-primary-foreground/80 mb-4 max-w-md">
              Promouvoir l'art du bridge en Tunisie depuis 1985.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 hover:text-accent cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 hover:text-accent cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 hover:text-accent cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">
              Liens rapides
            </h3>
            <ul className="font-body space-y-2">
              <li>
                <Link
                  href="/rankings"
                  className="hover:text-accent transition-colors"
                >
                  Classement
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="hover:text-accent transition-colors"
                >
                  Evenements
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-accent transition-colors"
                >
                  A propos
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-accent transition-colors"
                >
                  Contactez-nous
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">
              Contactez-nous
            </h3>
            <div className="font-body space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Tunis, Tunisia</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+216 71 123 456</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">info@ftb.tn</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="font-body text-primary-foreground/60">
            © 2024 Tunisian Bridge Federation. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
