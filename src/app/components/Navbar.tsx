"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname hook
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname(); // Get current path

  return (
    <nav className="bg-white border-b-1 text-gray-900 fixed top-0 left-0 w-full z-50 h-[120px] flex items-center">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold tracking-wide"
        >
          <span
            className="text-4xl p-1 border-r-2 text-right leading-tight"
            style={{ fontFamily: "'Special Elite', cursive" }}
          >
            The<br />Moho Blog
          </span>
          <span className="text-sm">
            Mohtasim
            <br />Hadi Rafi
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6 text-lg font-semibold">
          <NavItem href="/" label="Home" pathname={pathname} />
          <NavItem href="/blogs" label="Blogs" pathname={pathname} />
          <NavItem href="/research" label="Research" pathname={pathname} />
          <NavItem href="/books" label="Books" pathname={pathname} />
          <NavItem href="/about" label="About" pathname={pathname} />
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded bg-gray/20 hover:bg-gray/30 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-100 text-white text-lg flex flex-col items-start px-6 space-y-4 py-4 w-full absolute top-full left-0">
          <NavItem href="/" label="Home" pathname={pathname} />
          <NavItem href="/blogs" label="Blogs" pathname={pathname} />
          <NavItem href="/research" label="Research" pathname={pathname} />
          <NavItem href="/books" label="On Writing" pathname={pathname} />
          <NavItem href="/about" label="About" pathname={pathname} />
        </div>
      )}
    </nav>
  );
}

function NavItem({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) {
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={`relative px-4 py-2 transition duration-300 text-gray-900 hover:text-gray-500 ${
          isActive ? "text-stone-500" : "text-gray-500"
        }`}
      >
        {label}
      </Link>
    </li>
  );
}
