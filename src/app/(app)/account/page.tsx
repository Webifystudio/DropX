
'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { LogIn, AtSign, KeyRound, Eye, EyeOff } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';

export default function AccountPage() {
  const { user, signOut, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Skeleton className="h-96 w-full max-w-md" />
        </div>
    );
  }
  
  if (user) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <h1 className="text-2xl font-bold mb-4">Welcome back!</h1>
                    <p className="text-muted-foreground mb-6">{user.email}</p>
                    <Button onClick={signOut} className="w-full">Sign Out</Button>
                </div>
            </div>
        </div>
    )
  }

  return (
    <div 
        className="flex min-h-screen flex-col items-center justify-center p-4 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554141323-c3164a6f445d?q=80&w=2070&auto=format&fit=crop')"}}
    >
        <div className="absolute top-4 left-4">
            <Link href="/" className="flex items-center gap-2">
                <div className="bg-white p-2 rounded-md shadow-md">
                     <LogIn className="h-5 w-5 text-black" />
                </div>
                <span className="font-bold text-lg text-gray-800">Ebolt</span>
            </Link>
        </div>
        <div className="w-full max-w-md rounded-2xl bg-white/60 p-8 shadow-2xl backdrop-blur-lg">
            <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border">
                    <LogIn className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Sign in with email</h1>
                <p className="mt-2 text-muted-foreground">
                    Make a new doc to bring your words, data, and teams together. For free
                </p>
            </div>
            
            <Tabs defaultValue="login" className="w-full mt-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                    <form onSubmit={handleLogin} className="mt-6 space-y-4">
                        <div className="relative">
                            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="email"
                                placeholder="Email"
                                className="pl-10"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                         <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="pl-10 pr-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        <div className="text-right text-sm">
                            <Link href="#" className="font-medium text-primary hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <Button type="submit" className="w-full bg-gray-900 text-white hover:bg-gray-800" disabled={isSubmitting}>
                            {isSubmitting ? 'Signing in...' : 'Get Started'}
                        </Button>
                    </form>
                </TabsContent>
                
                <TabsContent value="signup">
                     <form onSubmit={handleSignUp} className="mt-6 space-y-4">
                        <div className="relative">
                            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="signup-email"
                                type="email"
                                placeholder="Email"
                                className="pl-10"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="relative">
                           <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="signup-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="pl-10 pr-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                             <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        <Button type="submit" className="w-full bg-gray-900 text-white hover:bg-gray-800" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating account...' : 'Get Started'}
                        </Button>
                    </form>
                </TabsContent>

            </Tabs>
        </div>
    </div>
  );
}
