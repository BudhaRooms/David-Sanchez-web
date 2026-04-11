import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
    createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fiqesxqcqdojwglameyg.supabase.co",
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_yeRzihMq_sNLAzjnBrn2sg_Naxm-Ihc",
        );
