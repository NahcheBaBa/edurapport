import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

const DISMISS_KEY = "edurapport-profile-setup-dismissed";

const ProfileSetupBanner = () => {
  const { user } = useAuth();
  const [needsSetup, setNeedsSetup] = useState(false);
  const [dismissed, setDismissed] = useState(
    typeof window !== "undefined" && localStorage.getItem(DISMISS_KEY) === "1",
  );

  useEffect(() => {
    if (!user) {
      setNeedsSetup(false);
      return;
    }
    supabase
      .from("profiles")
      .select("profile_completed")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setNeedsSetup(!data?.profile_completed);
      });
  }, [user]);

  if (!user || !needsSetup || dismissed) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  return (
    <div className="container pt-4">
      <div className="rounded-2xl gradient-primary text-primary-foreground p-4 md:p-5 flex items-center gap-3 shadow-md">
        <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-bold text-sm md:text-base">
            Finish setting up your profile
          </p>
          <p className="text-xs md:text-sm opacity-90">
            Tell us about you so we can personalize your lessons.
          </p>
        </div>
        <Link
          to="/profile-setup"
          className="bg-white text-primary font-bold text-sm px-4 py-2 rounded-full hover:opacity-90 shrink-0"
        >
          Complete
        </Link>
        <button
          aria-label="Dismiss"
          onClick={dismiss}
          className="p-1 rounded-full hover:bg-white/20 shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ProfileSetupBanner;
