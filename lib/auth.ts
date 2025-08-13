import { getSupabaseServer } from "@/lib/db";

export async function requireUser() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }
  return user;
}



