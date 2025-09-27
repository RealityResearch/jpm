"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { label: "X", href: "https://x.com/JPMonSOL", external: true },
    { label: "Dex", href: "https://dexscreener.com", external: true },
    { label: "Pump", href: "https://pump.fun", external: true },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur border-b border-neutral-200 shadow-sm">
      <nav className="mx-auto flex h-12 max-w-6xl items-start justify-between px-4 md:px-6">
        {/* Brand */}
        <div className="flex items-center gap-6 font-century">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <Image
              src="/jpm-brown-line.png"
              alt="J.P. Moregain"
              width={120}
              height={32}
              priority
              className="h-10 w-auto mt-0"
              style={{ width: "auto", height: "2rem" }}
            />
            <span className="sr-only">J.P. Moregain</span>
          </Link>
          <Link
            href="/cap-table"
            className={cn(
              "hidden md:inline-block mt-2 text-base text-neutral-700 hover:underline",
              pathname.startsWith("/cap-table") && "underline"
            )}
          >
            Cap Table
          </Link>
          <Link
            href="/whitepaper"
            className={cn(
              "hidden md:inline-block mt-2 text-base text-neutral-700 hover:underline",
              pathname.startsWith("/whitepaper") && "underline"
            )}
          >
            Whitepaper
          </Link>
        </div>

        {/* Desktop links */}
        <ul className="hidden gap-6 md:flex font-century items-start mt-2">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener noreferrer" : undefined}
                className="text-base text-neutral-700 hover:underline"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden mt-2 inline-flex items-center justify-center w-9 h-9 rounded hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          aria-label="Menu"
        >
          <svg
            className="h-5 w-5 text-neutral-800"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div
        className={cn(
          "md:hidden border-t border-neutral-200 bg-white px-4 pt-4 pb-4 flex-col space-y-3",
          open ? "flex" : "hidden"
        )}
      >
        <Link href="/cap-table" className="text-base text-neutral-700 hover:underline font-century" onClick={() => setOpen(false)}>
          Cap Table
        </Link>
        <Link
          href="/whitepaper"
          className={cn(
            "text-base text-neutral-700 hover:underline font-century",
            pathname.startsWith("/whitepaper") && "underline"
          )}
          onClick={() => setOpen(false)}
        >
          Whitepaper
        </Link>
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target={l.external ? "_blank" : undefined}
            rel={l.external ? "noopener noreferrer" : undefined}
            className="text-base text-neutral-700 hover:underline font-century"
            onClick={() => setOpen(false)}
          >
            {l.label}
          </a>
        ))}
      </div>
    </header>
  );
}
