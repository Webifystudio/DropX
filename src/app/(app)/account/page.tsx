
'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, UserCircle, Phone, AtSign, KeyRound } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AccountPage() {
  const { user, signOut, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Success!", description: "You are now logged in." });
    } catch (error: any) {
      console.error("Error logging in:", error);
      toast({ title: "Login Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: "Account Created!", description: "You have been successfully signed up and logged in." });
    } catch (error: any) {
        console.error("Error signing up:", error);
        toast({ title: "Sign Up Error", description: error.message, variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  if (loading) {
      return (
          <div className="container mx-auto px-4 py-8">
              <div className="max-w-md mx-auto">
                 <Card>
                    <CardHeader className="text-center">
                        <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                        <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
                        <Skeleton className="h-4 w-3/4 mx-auto mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                 </Card>
              </div>
          </div>
      )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        {user ? (
          <Card>
            <CardHeader className="text-center">
              <UserCircle className="mx-auto h-12 w-12 text-primary" />
              <CardTitle className="mt-4">My Account</CardTitle>
              <CardDescription>Welcome back!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 rounded-md border p-3">
                  <AtSign className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{user.email}</span>
              </div>
              <Button onClick={signOut} className="w-full">
                Sign Out
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
             <CardHeader className="text-center">
                <LogIn className="mx-auto h-12 w-12 text-primary" />
                <CardTitle className="mt-4">Welcome</CardTitle>
                <CardDescription>Login or create an account to continue.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <form onSubmit={handleLogin} className="space-y-4 pt-4">
                             <div className="space-y-2">
                                <Label htmlFor="login-email">Email</Label>
                                <Input id="login-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="login-password">Password</Label>
                                <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Logging in..." : "Login"}
                            </Button>
                        </form>
                    </TabsContent>
                    <TabsContent value="signup">
                        <form onSubmit={handleSignUp} className="space-y-4 pt-4">
                           <div className="space-y-2">
                                <Label htmlFor="signup-email">Email</Label>
                                <Input id="signup-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-password">Password</Label>
                                <Input id="signup-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Creating account..." : "Create Account"}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
