"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (pathname === "/dashboard") {
      // If already on dashboard, scroll to top smoothly
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Navigate to dashboard
      router.push("/dashboard");
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl shadow-md border"
        style={{
          backgroundColor: "#1a1a1a",
          borderColor: "#2a2a2a",
        }}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" style={{ color: "#f5f0e8" }} />
        ) : (
          <Menu className="h-6 w-6" style={{ color: "#f5f0e8" }} />
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
          w-72 border-r h-screen fixed left-0 top-0 flex flex-col z-40 transition-transform duration-300
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
          backgroundColor: "#0d0d0d",
          borderColor: "#2a2a2a",
        }}
      >
        <div className="p-2 lg:px-6 lg:py-2 border-b" style={{ borderColor: "#2a2a2a" }}>
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 cursor-pointer transform hover:scale-105 transition-transform duration-300"
          >
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "28px",
                fontWeight: 900,
                color: "#F5F0E8",
              }}
            >
              StackPilot
            </div>
          </button>
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 border ${
                  isActive
                    ? "font-medium hover:scale-[1.02]"
                    : "hover:scale-[1.02]"
                }`}
                style={{
                  backgroundColor: isActive ? "rgba(245, 200, 66, 0.1)" : "transparent",
                  color: isActive ? "#f5c842" : "#f5f0e8",
                  borderColor: isActive ? "rgba(245, 200, 66, 0.2)" : "transparent",
                  opacity: isActive ? 1 : 0.8,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.opacity = "1";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.opacity = "0.8";
                  }
                }}
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
