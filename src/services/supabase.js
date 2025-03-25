import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://tiuymqyefsibucaxxxri.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpdXltcXllZnNpYnVjYXh4eHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNTg1OTYsImV4cCI6MjA1MzYzNDU5Nn0.MRTDQeeSit2VF7Tsw3PWtyou64aovJLSl3EF6XSEAjE";
export const supabase = createClient(supabaseUrl, supabaseKey);