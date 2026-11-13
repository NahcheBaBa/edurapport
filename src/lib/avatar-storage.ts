import { supabase } from "@/integrations/supabase/client";

export function getAvatarStoragePath(value: string | null | undefined, userId: string): string | null {
  if (!value) return null;

  let path = value;
  if (/^https?:\/\//i.test(value)) {
    try {
      const match = new URL(value).pathname.match(
        /\/storage\/v1\/object\/(?:public|sign)\/avatars\/(.+)$/,
      );
      if (!match) return null;
      path = decodeURIComponent(match[1]);
    } catch {
      return null;
    }
  }

  const segments = path.split("/");
  if (
    segments.length < 2 ||
    segments[0] !== userId ||
    segments.some((segment) => !segment || segment === "." || segment === "..")
  ) {
    return null;
  }
  return path;
}

export async function resolveAvatarUrl(
  value: string | null | undefined,
  userId: string,
): Promise<string | null> {
  if (!value) return null;
  const path = getAvatarStoragePath(value, userId);
  if (!path) return /^https?:\/\//i.test(value) ? value : null;

  const { data, error } = await supabase.storage
    .from("avatars")
    .createSignedUrl(path, 60 * 60);
  return error ? null : data.signedUrl;
}