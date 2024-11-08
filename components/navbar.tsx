"use client"

import React, { useContext } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, LayoutDashboard, User } from 'lucide-react';
import Link from 'next/link';
import { AuthContext } from '@/hooks/AuthContext';

export const Navbar = () => {
  const { loggedIn, logout } = useContext(AuthContext);

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              BugTracker Pro
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {loggedIn ? (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>

                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>

                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="default" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;