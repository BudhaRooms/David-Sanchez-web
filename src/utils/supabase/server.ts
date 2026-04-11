import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
    return createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fiqesxqcqdojwglameyg.supabase.co",
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_yeRzihMq_sNLAzjnBrn2sg_Naxm-Ihc",
      {
              cookies: {
                        getAll() {
                                    return cookieStore.getAll()
                        },
                        setAll(cookiesToSet) {
                                    try {
                                                  cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                                    } catch {
                                                  // The `setAll` method was called from a Server Component.
                                      // This can be ignored if you have middleware refreshing
                                      // user sessions.
                                    }
                        },
              },
      }
        );
};
