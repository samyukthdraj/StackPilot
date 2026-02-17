"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Home, FileText, Briefcase, Target, User, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/resumes", label: "Resumes", icon: FileText },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/matches", label: "Matches", icon: Target },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-md"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-gray-700" />
        ) : (
          <Menu className="h-6 w-6 text-gray-700" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-72 bg-white border-r h-screen fixed left-0 top-0 flex flex-col z-40 transition-transform duration-300
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-2 lg:px-6 lg:py-2 border-b">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/images/stackpilot_logo.svg"
              alt="StackPilot"
              width={160}
              height={40}
              className="h-52 lg:h-28 w-auto"
            />
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-orange-50 text-orange-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
