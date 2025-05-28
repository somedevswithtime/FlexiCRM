import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config(); // Adjust path if .env is in root or server/

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
// const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // For admin tasks

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL or Anon Key is missing from environment variables. Make sure a .env file exists in the server/ directory with these values."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
