"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass } from "lucide-react";

const navItems = [
  { label: "Search", href: "/" },
  { label: "Trips", href: "/trips" },
  { label: "FAQ", href: "/faq" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-10 py-5 backdrop-blur border-b">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #c4714a, #a85a38)" }}
        >
          <svg viewBox="0 0 28 28" width="20" height="20" fill="none">
            <circle cx="14" cy="14" r="12" stroke="white" strokeWidth="1.5" />
            <text
              x="14" y="19"
              textAnchor="middle"
              fontFamily="Georgia, serif"
              fontSize="14"
              fontWeight="400"
              fill="white"
            >
              G
            </text>
            <circle cx="23" cy="5" r="2.5" fill="white" opacity="0.7" />
          </svg>
        </div>
        <span
          className="text-xl font-semibold tracking-wide"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#1a1714" }}
        >
          Getaway
        </span>
      </div>

      <div className="flex items-center gap-3">

        <nav
          className="flex gap-1 rounded-full px-1 py-1"
          style={{
            background: "rgba(255,255,255,0.5)",
            border: "1px solid rgba(26,23,20,0.08)",
          }}
        >
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="text-[13px] font-medium px-4 py-1.5 rounded-full transition-all duration-200"
                style={
                  active
                    ? { background: "linear-gradient(135deg, #c4714a, #a85a38)", color: "#fdfcf9" }
                    : { color: "#6b6560" }
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/discovery"
          className="flex items-center gap-1.5 text-[13px] font-medium px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #c4714a, #a85a38)",
            color: "white",
            boxShadow: "0 2px 12px rgba(196,113,74,0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "brightness(1.08)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(196,113,74,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "brightness(1)";
            e.currentTarget.style.boxShadow = "0 2px 12px rgba(196,113,74,0.3)";
          }}
        >
          <Compass size={13} strokeWidth={2} />
          Discover
        </Link>

      </div>
    </header>
  );
}