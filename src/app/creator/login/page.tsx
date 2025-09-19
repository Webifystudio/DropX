
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { KeyRound } from "lucide-react";
import Link from "next/link";

export default function CreatorLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // This is where you would handle creator authentication
    // For this example, we'll just show a toast and redirect
    
    toast({
      title: "Login Temporarily Disabled",
      description: "Creator login will be enabled soon. Please check back later.",
      variant: "destructive",
    });

    setIsLoading(false);

    // Example of a successful login:
    // try {
    //   // await signInWithCreatorCredentials(username, password);
    //   toast({
    //     title: "Login Successful",
    //     description: "Redirecting to your creator dashboard...",
    //   });
    //   router.push("/creator/dashboard");
    // } catch (error: any) {
    //   toast({
    //     title: "Login Failed",
    //     description: error.message,
    //     variant: "destructive",
    //   });
    // } finally {
    //     setIsLoading(false);
    // }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <KeyRound className="mx-auto h-10 w-10 text-primary" />
          <CardTitle className="mt-4">Creator Login</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="your_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
             <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/creator" className="font-medium text-primary hover:underline">
                    Become a Creator
                </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
