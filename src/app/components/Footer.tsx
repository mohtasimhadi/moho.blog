"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Linkedin, Github, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    fetch("/data/home.json")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Error fetching home data:", err));
  }, []);

  if (!data) return <p className="text-center mt-10 text-lg">Loading...</p>;

  // Check if data.contact exists before accessing
  if (!data.contact) {
    return (
      <p className="text-center mt-10 text-lg">
        Error: Contact information is missing.
      </p>
    );
  }

  return (
    <div className="w-full bg-black text-white p-4 mt-2">
      {/* Two Columns Layout */}
      <div className="grid grid-cols-2 gap-6 pb-4 border-b-1 border-white">
        <div>
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold tracking-wide"
          >
            <span
              className="text-xl p-1 border-r-2 text-right leading-tight"
              style={{ fontFamily: "'Special Elite', cursive" }}
            >
              The
              <br />
              Moho Blog
            </span>
            <span className="text-xs">
              Journal of
              <br />
              Mohtasim Hadi Rafi
            </span>
          </Link>
        </div>

        <div className="flex justify-end items-center">
          <SocialIcon href={data.contact.linkedin} Icon={Linkedin} />
          <SocialIcon href={data.contact.github} Icon={Github} />
          <SocialIcon href={data.contact.facebook} Icon={Facebook} />
          <SocialIcon href={data.contact.instagram} Icon={Instagram} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Left Column - Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Left Column */}
            <div>
              <ul className="space-y-2">
                <li>
                  <Link href="/blogs/poetries" className="text-sm hover:text-gray-200">
                    Poetries
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blogs/short-stories"
                    className="text-sm hover:text-gray-200"
                  >
                    Short Stories
                  </Link>
                </li>
                <li>
                  <Link href="/blogs/articles" className="text-sm hover:text-gray-200">
                    Articles
                  </Link>
                </li>
                <li>
                  <Link href="/blogs/class-notes" className="text-sm hover:text-gray-200">
                    Class Notes
                  </Link>
                </li>
              </ul>
            </div>

            {/* Right Column */}
            <div>
            <ul className="space-y-2">
                <li>
                  <Link href="/research/projects" className="text-sm hover:text-gray-200">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/research/publications"
                    className="text-sm hover:text-gray-200"
                  >
                    Publications
                  </Link>
                </li>
                <li>
                  <Link href="/research/presentations" className="text-sm hover:text-gray-200">
                    Presentations
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column - Newsletter Sign-up Form */}
        <div className="border-white border-l-1 pl-4">
          <h3 className="text-lg font-semibold mb-4">
            Sign Up for Our Newsletter
          </h3>
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full px-4 py-2 border border-white focus:gray-500 focus:gray-500"
                placeholder="Enter your email"
              />
            </div>
            <button
              type="submit"
              className="w-1/2 bg-black border text-white py-2 hover:bg-gray-200 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Single Column Layout */}
      <div className="text-center border-white border-t-1">
        <div className="flex justify-center space-x-4 mt-2">
          <p className="text-sm">&copy; 2025 Mohtasim Hadi Rafi</p>
          <Link
            href="/privacy-policy"
            className="text-sm text-white hover:text-gray-400"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-use"
            className="text-sm text-white hover:text-gray-400"
          >
            Term of Use
          </Link>
          <Link
            href="/contact"
            className="text-sm text-white hover:text-gray-400"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}

function SocialIcon({ href, Icon }: { href: string; Icon: any }) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      <Icon className="w-8 h-8 text-white hover:text-gray-100 transition" />
    </Link>
  );
}
