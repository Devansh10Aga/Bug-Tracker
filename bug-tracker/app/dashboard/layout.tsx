"use client"

import { AuthContext } from "@/hooks/AuthContext"
import { useContext, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function DashboardLayout({children} : {children : React.ReactNode}) {
  const {loggedIn, isLoading} = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !loggedIn) {
      const timeout = setTimeout(() => {
        router.push('/login');
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [loggedIn, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <ShieldAlert className="w-12 h-12 text-red-500" />
            </div>
            <CardTitle className="text-2xl mb-2">Access Restricted</CardTitle>
            <CardDescription>
              You need to be logged in to view this page. You will be redirected to the login page shortly.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button 
              onClick={() => router.push('/login')}
              className="w-full max-w-xs"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}