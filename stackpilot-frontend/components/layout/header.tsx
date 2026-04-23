"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, FileText, Briefcase, Target, User, Menu, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader, SheetClose } from "@/components/ui/sheet";
import { useState, useRef, useEffect } from "react";
import { TruncatedText } from "@/components/shared/truncated-text";

export function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/resumes", label: "Resumes", icon: FileText },
    { href: "/jobs", label: "Jobs", icon: Briefcase },
    { href: "/matches", label: "Matches", icon: Target },
  ];

  return (
    <header 
      className="h-16 border-b flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 transition-colors duration-300"
      style={{ backgroundColor: "#0d0d0d", borderColor: "#2a2a2a" }}
    >
      {/* Branding */}
      <div className="flex items-center gap-6">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 cursor-pointer transform hover:scale-105 transition-transform duration-300"
          onClick={(e) => {
            if (pathname === "/dashboard") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "22px",
              fontWeight: 900,
              color: "#F5F0E8",
            }}
          >
            StackPilot
          </div>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                isActive ? "bg-white/10 text-[#f5c842]" : "text-[#a0a0a0] hover:text-[#f5f0e8] hover:bg-white/10"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right Side */}
      <div className="flex items-center gap-2 sm:gap-4">
        {user?.role === "admin" && (
           <Link href="/admin" className="hidden lg:block text-sm text-[#a0a0a0] hover:text-[#f5c842]">
             Admin Area
           </Link>
        )}
        
        {/* Desktop Avatar Dropdown */}
        <div className="relative hidden md:block" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 hover:bg-white/10 p-2 rounded-lg transition-colors duration-200"
          >
            <span className="text-sm font-medium hidden lg:block" style={{ color: "#f5f0e8" }}>
              {user?.name || user?.email}
            </span>
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 shadow-sm"
              style={{ backgroundColor: "#f5c842", color: "#0d0d0d" }}
            >
              {(user?.name || user?.email)?.charAt(0).toUpperCase()}
            </div>
            <ChevronDown className="w-4 h-4 text-[#a0a0a0] hidden lg:block" />
          </button>

          {dropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-48 py-2 rounded-xl shadow-xl border flex flex-col overflow-hidden animate-fade-in-up"
              style={{ backgroundColor: "#0d0d0d", borderColor: "#2a2a2a" }}
            >
              <Link 
                href="/profile" 
                onClick={() => setDropdownOpen(false)}
                className="px-4 py-2.5 text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-colors"
                style={{ color: "#f5f0e8" }}
              >
                <User className="w-4 h-4" />
                My Profile
              </Link>
              <div className="my-1 border-t border-[#2a2a2a]" />
              <button 
                onClick={() => { setDropdownOpen(false); logout(); }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-2 text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Sidebar Trigger */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" style={{ color: "#f5f0e8" }} className="hover:bg-white/10">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" style={{ backgroundColor: "#0d0d0d", borderColor: "#2a2a2a", color: "#f5f0e8" }} className="[&>button]:text-white [&>button]:hover:text-[#f5c842] [&>button]:opacity-100  w-[280px] sm:w-[320px]">
            <SheetHeader>
              <SheetTitle style={{ color: "#f5f0e8", fontFamily: "'Playfair Display', serif" }}>Navigation</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-2 mt-8">
              {/* User info on mobile */}
              <div className="flex items-center gap-3 px-4 py-3 mb-2 border-b border-[#2a2a2a]">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0"
                  style={{ backgroundColor: "#f5c842", color: "#0d0d0d" }}
                >
                  {(user?.name || user?.email)?.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <TruncatedText 
                    text={user?.name || "User"} 
                    className="text-sm font-semibold text-[#f5f0e8]" 
                  />
                  <TruncatedText 
                    text={user?.email || ""} 
                    className="text-xs text-[#a0a0a0]" 
                  />
                </div>
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

                return (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive ? "bg-white/10 text-[#f5c842]" : "text-[#a0a0a0] hover:text-[#f5f0e8] hover:bg-white/10"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </SheetClose>
                );
              })}

              {user?.role === "admin" && (
                <SheetClose asChild>
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#f5c842] hover:bg-white/10 transition-colors"
                  >
                    <span className="font-medium">Admin Area</span>
                  </Link>
                </SheetClose>
              )}

              <div className="my-4 border-t border-[#2a2a2a]" />

              <SheetClose asChild>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#a0a0a0] hover:text-[#f5f0e8] hover:bg-white/10 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </Link>
              </SheetClose>

              <Button
                variant="ghost"
                onClick={() => { setSheetOpen(false); logout(); }}
                className="flex items-center gap-3 px-4 py-3 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg justify-start"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
