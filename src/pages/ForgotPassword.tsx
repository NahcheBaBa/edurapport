import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Mail, CheckCircle2 } from "lucide-react";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

const emailSchema = z.string().trim().email("Enter a valid email address");

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast({
        title: "Check your email",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({
        title: "Couldn't send reset link",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-xl py-8 md:py-12">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>

        <div className="flex flex-col items-center text-center mb-8">
          <img src={logo} alt="EduRapport" className="h-16 w-auto mb-4" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            {sent ? "Check your inbox" : "Forgot your password?"}
          </h1>
          <p className="text-muted-foreground mt-2 font-body">
            {sent
              ? `If an account exists for ${email}, we've sent a reset link.`
              : "Enter the email associated with your account and we'll send you a link to reset your password."}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-sm p-6 md:p-8">
          {sent ? (
            <div className="flex flex-col items-center text-center space-y-5">
              <div className="rounded-full bg-primary/10 p-3">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                The link will expire in 1 hour. If you don't see the email,
                check your spam folder.
              </p>
              <div className="flex flex-col gap-2 w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 font-semibold"
                  onClick={() => setSent(false)}
                >
                  Use a different email
                </Button>
                <Button
                  asChild
                  className="w-full h-12 gradient-primary text-primary-foreground font-bold text-base rounded-full hover:opacity-90"
                >
                  <Link to="/login">Back to login</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-9 h-11"
                    autoComplete="email"
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
                  "Send reset link"
                )}
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Remembered it?{" "}
          <Link to="/login" className="font-semibold text-primary hover:text-accent">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
