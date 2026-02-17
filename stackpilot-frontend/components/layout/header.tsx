"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Mobile: Avatar and Email on Left */}
      <div className="flex items-center gap-3 lg:hidden flex-1 min-w-0">
        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold shrink-0">
          {(user?.name || user?.email)?.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm text-gray-600 truncate">
          {user?.name || user?.email}
        </span>
      </div>

      {/* Desktop: Spacer */}
      <div className="flex-1 hidden lg:block" />

      {/* Desktop: Avatar, Email, and Logout on Right */}
      <div className="hidden lg:flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {user?.name || user?.email}
        </span>
        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
          {(user?.name || user?.email)?.charAt(0).toUpperCase()}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-gray-600 hover:text-gray-900"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Mobile: Logout Button on Right (Rightmost) */}
      <div className="lg:hidden shrink-0 ml-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-gray-600 hover:text-gray-900"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}
