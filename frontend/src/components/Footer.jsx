import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const links = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "Members", path: "/members" },
  ];

  const socials = [
    {
      name: "Instagram",
      href: "#",
      path: "M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm5.5-3.2a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z",
    },
    {
      name: "LinkedIn",
      href: "#",
      path: "M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3V9zm7 0h3.8v1.64h.05c.53-.96 1.83-1.97 3.77-1.97 4.03 0 4.78 2.55 4.78 5.87V21h-4v-5.9c0-1.4-.03-3.2-1.98-3.2-1.98 0-2.28 1.5-2.28 3.1V21h-4V9z",
    },
    {
      name: "X",
      href: "#",
      path: "M3 3h5.6l4 5.6L17.2 3H21l-6.9 8.4L21.4 21h-5.6l-4.4-6.1L5.4 21H2l7.4-9L3 3z",
    },
  ];

  return (
    <footer className="border-t-4 border-blue-600 bg-slate-900 px-6 pt-16 text-slate-300 sm:px-12 md:px-16 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Logo + tagline */}
          <div>
            <Link to="/" className="inline-block">
              <span className="bg-gradient-to-b from-white to-blue-400 bg-clip-text text-3xl font-extrabold text-transparent">
                ISA
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
              International Society of Automation — HIT Student Chapter.
              Building the next generation of automation engineers.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 transition hover:text-blue-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + socials */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">
              Connect
            </h3>
            <p className="mt-4 text-sm text-slate-400">isa.hit@example.com</p>
            <div className="mt-5 flex gap-4">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition hover:bg-blue-600 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 py-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} ISA HIT Student Chapter. All rights reserved.</p>
          <p>Made by the ISA HIT Student Chapter team</p>
        </div>
      </div>
    </footer>
  );
}