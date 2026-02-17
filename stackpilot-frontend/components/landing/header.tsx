"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export function Header({ onLoginClick, onRegisterClick }: HeaderProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <button
            onClick={scrollToTop}
            className="cursor-pointer transform hover:scale-105 transition-transform duration-300"
          >
            <Image
              src="/images/stackpilot_logo.svg"
              alt="StackPilot"
              width={200}
              height={60}
              className="h-28 w-auto"
              priority
            />
          </button>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="cursor-pointer text-lg font-semibold hover:text-orange-600 transition-colors duration-300"
              onClick={onLoginClick}
            >
              Login
            </Button>
            <Button
              className="bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 cursor-pointer text-lg px-8 py-6 rounded-xl shadow-lg transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 font-bold"
              onClick={onRegisterClick}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
