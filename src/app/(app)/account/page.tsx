
'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, UserCircle, Phone } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function AccountPage() {
  const { user, signOut, loading } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // We re-initialize the verifier each time the component mounts.
    // This avoids issues with the container not being ready.
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
    });
  }, []);

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
        toast({ title: "Invalid Phone Number", description: "Please enter a 10-digit phone number.", variant: "destructive" });
        return;
    }
    setIsSendingOtp(true);
    try {
        const appVerifier = window.recaptchaVerifier;
        const result = await signInWithPhoneNumber(auth, `+91${phone}`, appVerifier);
        setConfirmationResult(result);
        toast({ title: "OTP Sent", description: "An OTP has been sent to your phone number." });
    } catch (error) {
        console.error("Error sending OTP:", error);
        // Reset reCAPTCHA on error
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.render().then((widgetId: any) => {
            // @ts-ignore
            if (typeof grecaptcha !== 'undefined') {
                grecaptcha.reset(widgetId);
            }
          });
        }
        toast({ title: "Error", description: "Failed to send OTP. Please refresh and try again.", variant: "destructive" });
    } finally {
        setIsSendingOtp(false);
    }
  };
  
  const handleVerifyOtp = async () => {
      if (!confirmationResult) return;
      if (otp.length !== 6) {
          toast({ title: "Invalid OTP", description: "Please enter a 6-digit OTP.", variant: "destructive" });
          return;
      }
      setIsVerifyingOtp(true);
      try {
          await confirmationResult.confirm(otp);
          toast({ title: "Success!", description: "You are now logged in." });
      } catch (error) {
          console.error("Error verifying OTP:", error);
          toast({ title: "Error", description: "Invalid OTP. Please try again.", variant: "destructive" });
      } finally {
          setIsVerifyingOtp(false);
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
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{user.phoneNumber}</span>
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
              <CardTitle className="mt-4">Login or Sign Up</CardTitle>
              <CardDescription>Enter your phone number to continue.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {!confirmationResult ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Input value="+91" disabled className="w-16" />
                            <Input 
                                type="tel" 
                                placeholder="10-digit mobile number" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                maxLength={10}
                            />
                        </div>
                        <Button onClick={handleSendOtp} disabled={isSendingOtp || phone.length !== 10} className="w-full">
                            {isSendingOtp ? "Sending OTP..." : "Send OTP"}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Input 
                            type="number"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                        />
                        <Button onClick={handleVerifyOtp} disabled={isVerifyingOtp || otp.length !== 6} className="w-full">
                            {isVerifyingOtp ? "Verifying..." : "Verify OTP & Login"}
                        </Button>
                        <Button variant="link" onClick={() => { setConfirmationResult(null); setPhone(''); }}>
                            Use another number
                        </Button>
                    </div>
                )}
            </CardContent>
          </Card>
        )}
        <div id="recaptcha-container" className="mt-4"></div>
      </div>
    </div>
  );
}
