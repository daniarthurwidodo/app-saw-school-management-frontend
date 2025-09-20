import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold">
            School Management
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-primary/80"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop menu */}
          <ul className="hidden md:flex space-x-6">
            <li>
              <Link href="/" className="hover:text-primary-foreground/80 transition-colors">
                Login
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-primary-foreground/80 transition-colors">
                Register
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-primary-foreground/80 transition-colors">
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-primary-foreground/20">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="block py-2 hover:text-primary-foreground/80 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="block py-2 hover:text-primary-foreground/80 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="block py-2 hover:text-primary-foreground/80 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}