import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://ugigrhorlzhntrhsyurj.supabase.co/rest/v1/";
const supabaseKey = "sb_publishable_w4-IWfkjbuAyE_nJE2DCxA_3mwwQMlZ";

export const supabase = createClient(supabaseUrl, supabaseKey);