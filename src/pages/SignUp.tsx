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
  User,
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
import AccessibilityMenu from "@/components/AccessibilityMenu";

type Role = "student" | "educator";
type Step = "details" | "otp";

const detailsSchema = z
  .object({
    display_name: z.string().trim().min(2, "Please enter your name").max(80),
    phone: z
      .string()
      .trim()
      .regex(/^\+[1-9]\d{6,14}$/, "Use international format, e.g. +15551234567"),
    password: z.string().min(8, "Password must be at least 8 characters").max(72),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

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

const SignUp = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("student");
  const [step, setStep] = useState<Step>("details");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [country, setCountry] = useState("US");
  const [countryOpen, setCountryOpen] = useState(false);

  const [form, setForm] = useState({ display_name: "", phone: "", password: "", confirmPassword: "" });

  // Redirect signed-in users away from sign-up
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
    const local = form.phone.startsWith(oldDial)
      ? form.phone.slice(oldDial.length)
      : form.phone.replace(/^\+/, "");
    setCountry(code);
    setForm((f) => ({ ...f, phone: newDial + local }));
  };

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = detailsSchema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Check your details",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      phone: parsed.data.phone,
      password: parsed.data.password,
      options: {
        data: {
          display_name: parsed.data.display_name,
          role,
          phone: parsed.data.phone,
        },
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Sign-up failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: "Verification code sent",
      description: `We sent a 6-digit code to ${parsed.data.phone}.`,
    });
    setStep("otp");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({ title: "Enter the 6-digit code", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      phone: form.phone,
      token: otp,
      type: "sms",
    });
    setLoading(false);
    if (error) {
      toast({ title: "Invalid code", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Welcome to EduRapport!", description: "Your account is ready." });
    navigate("/", { replace: true });
  };

  const handleResend = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resend({ type: "sms", phone: form.phone });
    setLoading(false);
    if (error) {
      toast({ title: "Could not resend", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Code resent" });
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
    if (result.redirected) return; // browser is navigating away
    setLoading(false);
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <AccessibilityMenu />
      <main className="container max-w-xl py-8 md:py-12">
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
            Create your account
          </h1>
          <p className="text-muted-foreground mt-2 font-body">
            Join EduRapport and start learning today.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-sm p-6 md:p-8">
          {step === "details" ? (
            <>
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

                <TabsContent value="student" className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    Sign up with your phone number to access lessons and quizzes.
                  </p>
                </TabsContent>
                <TabsContent value="educator" className="mt-4 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Educators can sign up by phone or continue with Google.
                  </p>
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

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="display_name">Full name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="display_name"
                      value={form.display_name}
                      onChange={update("display_name")}
                      placeholder="Ada Lovelace"
                      className="pl-9 h-11"
                      autoComplete="name"
                      required
                    />
                  </div>
                </div>

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
                      value={form.phone.startsWith(countryCode) ? form.phone.slice(countryCode.length) : ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          phone: countryCode + e.target.value.replace(/\D/g, ""),
                        }))
                      }
                      placeholder="5551234567"
                      className="h-11 flex-1"
                      autoComplete="tel"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We'll text you a verification code.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={form.password}
                      onChange={update("password")}
                      placeholder="At least 8 characters"
                      className="pl-9 h-11"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={update("confirmPassword")}
                      placeholder="Re-enter your password"
                      className="pl-9 h-11"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 gradient-primary text-primary-foreground font-bold text-base rounded-full hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    `Send verification code`
                  )}
                </Button>
              </form>
            </>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center">
                <h2 className="font-heading text-xl font-bold text-foreground">
                  Verify your phone
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter the 6-digit code sent to{" "}
                  <span className="font-semibold text-foreground">{form.phone}</span>
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
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & create account"}
              </Button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="text-muted-foreground hover:text-foreground font-medium"
                >
                  Edit details
                </button>
                <button
                  type="button"
                  onClick={handleResend}
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
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:text-accent">
            Log in
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

export default SignUp;
