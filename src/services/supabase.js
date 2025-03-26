import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://kfldodwfdtnafaqpbdhe.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmbGRvZHdmZHRuYWZhcXBiZGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5ODMxNzcsImV4cCI6MjA1ODU1OTE3N30.a22_yLYQzfzuOckHLY29UUZ_7sU1_gBE7Qo9L1ijFiM";
export const supabase = createClient(supabaseUrl, supabaseKey);