import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  ArrowLeft,
  Check,
  ChevronsUpDown,
  GraduationCap,
  Loader2,
  Lock,
  BookOpen,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Role = "student" | "educator";
type Method = "password" | "otp";

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{6,14}$/, "Use international format, e.g. +15551234567");

const COUNTRIES = [
  { code: "US", name: "United States", dial: "+1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧" },
  { code: "CA", name: "Canada", dial: "+1", flag: "🇨🇦" },
  { code: "AU", name: "Australia", dial: "+61", flag: "🇦🇺" },
  { code: "NG", name: "Nigeria", dial: "+234", flag: "🇳🇬" },
  { code: "GH", name: "Ghana", dial: "+233", flag: "🇬🇭" },
  { code: "KE", name: "Kenya", dial: "+254", flag: "🇰🇪" },
  { code: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦" },
  { code: "IN", name: "India", dial: "+91", flag: "🇮🇳" },
  { code: "DE", name: "Germany", dial: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dial: "+33", flag: "🇫🇷" },
  { code: "BR", name: "Brazil", dial: "+55", flag: "🇧🇷" },
  { code: "JP", name: "Japan", dial: "+81", flag: "🇯🇵" },
  { code: "CN", name: "China", dial: "+86", flag: "🇨🇳" },
  { code: "MX", name: "Mexico", dial: "+52", flag: "🇲🇽" },
] as const;

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("student");
  const [method, setMethod] = useState<Method>("password");
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("US");
  const [countryOpen, setCountryOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/", { replace: true });
    });
  }, [navigate]);

  const selectedCountry = COUNTRIES.find((c) => c.code === country);
  const countryCode = selectedCountry?.dial ?? "+1";

  const handleCountryChange = (code: string) => {
    const newDial = COUNTRIES.find((c) => c.code === code)?.dial ?? "+1";
    const oldDial = countryCode;
    const local = phone.startsWith(oldDial) ? phone.slice(oldDial.length) : phone.replace(/^\+/, "");
    setCountry(code);
    setPhone(newDial + local);
  };

  const validatePhone = () => {
    const parsed = phoneSchema.safeParse(phone);
    if (!parsed.success) {
      toast({ title: "Check your number", description: parsed.error.issues[0].message, variant: "destructive" });
      return false;
    }
    return true;
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone()) return;
    if (password.length < 8) {
      toast({ title: "Enter your password", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ phone, password });
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Welcome back!" });
    navigate("/", { replace: true });
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone()) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    setLoading(false);
    if (error) {
      toast({ title: "Could not send code", description: error.message, variant: "destructive" });
      return;
    }
    setOtpSent(true);
    toast({ title: "Code sent", description: `We sent a 6-digit code to ${phone}.` });
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({ title: "Enter the 6-digit code", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" });
    setLoading(false);
    if (error) {
      toast({ title: "Invalid code", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Welcome back!" });
    navigate("/", { replace: true });
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setLoading(false);
      toast({
        title: "Google sign-in failed",
        description: result.error.message ?? "Try again",
        variant: "destructive",
      });
      return;
    }
    if (result.redirected) return;
    setLoading(false);
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-xl py-8 md:py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="flex flex-col items-center text-center mb-8">
          <img src={logo} alt="EduRapport" className="h-16 w-auto mb-4" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Welcome back
          </h1>
          <p className="text-muted-foreground mt-2 font-body">
            Log in to continue your learning journey.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-sm p-6 md:p-8">
          <Tabs value={role} onValueChange={(v) => setRole(v as Role)} className="mb-6">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="student" className="gap-2 text-sm font-semibold">
                <BookOpen className="h-4 w-4" />
                Student
              </TabsTrigger>
              <TabsTrigger value="educator" className="gap-2 text-sm font-semibold">
                <GraduationCap className="h-4 w-4" />
                Educator
              </TabsTrigger>
            </TabsList>

            <TabsContent value="educator" className="mt-4 space-y-4">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 font-semibold"
                onClick={handleGoogle}
                disabled={loading}
              >
                <GoogleIcon />
                Continue with Google
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    or use phone
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {!otpSent && (
            <div className="flex gap-2 mb-5 p-1 rounded-full bg-muted">
              <button
                type="button"
                onClick={() => setMethod("password")}
                className={cn(
                  "flex-1 h-9 rounded-full text-sm font-semibold transition-colors",
                  method === "password"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setMethod("otp")}
                className={cn(
                  "flex-1 h-9 rounded-full text-sm font-semibold transition-colors",
                  method === "otp"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                One-time code
              </button>
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={method === "password" ? handlePasswordLogin : handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <div className="flex gap-2">
                  <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={countryOpen}
                        className="h-11 w-[140px] shrink-0 justify-between"
                      >
                        <span>
                          {selectedCountry?.flag} {selectedCountry?.dial}
                        </span>
                        <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[260px] p-0">
                      <Command>
                        <CommandInput placeholder="Search country..." />
                        <CommandList>
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {COUNTRIES.map((c) => (
                              <CommandItem
                                key={c.code}
                                value={`${c.name} ${c.dial}`}
                                onSelect={() => {
                                  handleCountryChange(c.code);
                                  setCountryOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    country === c.code ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                <span className="mr-2">{c.flag}</span>
                                {c.name} {c.dial}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone.startsWith(countryCode) ? phone.slice(countryCode.length) : ""}
                    onChange={(e) =>
                      setPhone(countryCode + e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="5551234567"
                    className="h-11 flex-1"
                    autoComplete="tel"
                    required
                  />
                </div>
              </div>

              {method === "password" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:text-accent">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your password"
                      className="pl-9 h-11"
                      autoComplete="current-password"
                      required
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 gradient-primary text-primary-foreground font-bold text-base rounded-full hover:opacity-90"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : method === "password" ? (
                  "Log in"
                ) : (
                  "Send verification code"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center">
                <h2 className="font-heading text-xl font-bold text-foreground">
                  Enter your code
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  We sent a 6-digit code to{" "}
                  <span className="font-semibold text-foreground">{phone}</span>
                </p>
              </div>

              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} className="h-12 w-12 text-lg" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                type="submit"
                className="w-full h-12 gradient-primary text-primary-foreground font-bold text-base rounded-full hover:opacity-90"
                disabled={loading || otp.length !== 6}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & log in"}
              </Button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                  }}
                  className="text-muted-foreground hover:text-foreground font-medium"
                >
                  Use different number
                </button>
                <button
                  type="button"
                  onClick={handleSendOtp as unknown as () => void}
                  disabled={loading}
                  className="text-primary hover:text-accent font-semibold disabled:opacity-50"
                >
                  Resend code
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          New to EduRapport?{" "}
          <Link to="/signup" className="font-semibold text-primary hover:text-accent">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1S8.7 6 12 6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.5 14.6 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.2-1.6H12z"
    />
  </svg>
);

export default Login;
