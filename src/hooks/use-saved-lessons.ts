import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export function useSavedLessons() {
  const { user } = useAuth();
  const userId = user?.id;
  const [savedLessonIds, setSavedLessonIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!userId) {
      setSavedLessonIds([]);
      setLoading(false);
      return () => {
        active = false;
      };
    }

    setLoading(true);
    supabase
      .from("saved_lessons")
      .select("lesson_id")
      .eq("user_id", userId)
      .then(({ data, error }) => {
        if (!active) return;
        setSavedLessonIds(error ? [] : (data ?? []).map((row) => row.lesson_id));
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [userId]);

  const toggleSavedLesson = useCallback(
    async (lessonId: string) => {
      if (!userId) throw new Error("Sign in to save songs and poetry to your profile.");

      const isSaved = savedLessonIds.includes(lessonId);
      const result = isSaved
        ? await supabase
            .from("saved_lessons")
            .delete()
            .eq("user_id", userId)
            .eq("lesson_id", lessonId)
        : await supabase.from("saved_lessons").insert({ user_id: userId, lesson_id: lessonId });

      if (result.error) throw result.error;
      setSavedLessonIds((current) =>
        isSaved
          ? current.filter((id) => id !== lessonId)
          : current.includes(lessonId)
            ? current
            : [...current, lessonId],
      );
      return !isSaved;
    },
    [savedLessonIds, userId],
  );

  return { savedLessonIds, loading, toggleSavedLesson };
}