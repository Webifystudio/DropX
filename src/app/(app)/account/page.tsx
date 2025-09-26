
'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { LogIn, AtSign, KeyRound, Eye, EyeOff, User, Camera, LogOut, Save } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function AccountPage() {
  const { user, signOut, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (user) {
        setDisplayName(user.displayName || '');
        setPhotoURL(user.photoURL || '');
    }
  }, [user]);

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
      const defaultDisplayName = `DropXUser${Math.floor(1000 + Math.random() * 9000)}`;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: defaultDisplayName });
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: defaultDisplayName,
        photoURL: '',
      });
      toast({ title: "Account Created!", description: "You have been successfully signed up and logged in." });
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast({ title: "Sign Up Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    try {
        let updatedPhotoURL = photoURL;
        
        if (newAvatarFile) {
            const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
             if (!imgbbApiKey) {
                toast({ title: "Error", description: "IMGBB API Key is not configured.", variant: "destructive" });
                setIsSubmitting(false);
                return;
            }
            const formData = new FormData();
            formData.append("image", newAvatarFile);
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
            if (result.success) {
                updatedPhotoURL = result.data.url;
            } else {
                throw new Error(`Image upload failed: ${result.error.message}`);
            }
        }
        
        await updateProfile(user, { displayName, photoURL: updatedPhotoURL });

        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
            displayName,
            photoURL: updatedPhotoURL,
            email: user.email,
        }, { merge: true });

        setPhotoURL(updatedPhotoURL);
        toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });

    } catch (error: any) {
        console.error("Error updating profile:", error);
        toast({ title: "Update Error", description: error.message, variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setNewAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    }
  }


  if (loading) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-lg mx-auto space-y-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    );
  }
  
  if (user) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-lg mx-auto">
                <Card className="overflow-hidden">
                    <div className="bg-muted/30 p-8 flex flex-col items-center gap-4">
                        <div className="relative">
                            <Avatar className="h-24 w-24 border-4 border-background">
                                <AvatarImage src={avatarPreview || photoURL} alt={displayName} />
                                <AvatarFallback className="text-3xl">
                                    {displayName ? displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                             <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90">
                                <Camera className="h-4 w-4" />
                                <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={onAvatarChange} />
                            </label>
                        </div>

                        <div className="text-center">
                            <h1 className="text-2xl font-bold">{displayName}</h1>
                            <p className="text-muted-foreground">{user.email}</p>
                        </div>
                         <Button onClick={signOut} variant="outline">
                            <LogOut className="mr-2 h-4 w-4" /> Sign Out
                        </Button>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input 
                                id="displayName"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Enter your display name"
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                        </Button>
                    </form>
                </Card>
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
                <h1 className="text-2xl font-bold tracking-tight">Sign in to your account</h1>
                <p className="mt-2 text-muted-foreground">
                    Enter your email below to login or create an account.
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
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
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
                            {isSubmitting ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </form>
                </TabsContent>

            </Tabs>
        </div>
    </div>
  );
}

    