import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gmjlrmazkwcvuoqhwzee.supabase.co"; // Replace with your Supabase project URL
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtamxybWF6a3djdnVvcWh3emVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1MzQzNDEsImV4cCI6MjA1NTExMDM0MX0.B98bp7c9SINX_vXoCVuPcjveMViOh7zqC7cggBSgW8s"; // Replace with your Supabase anon/public API key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
