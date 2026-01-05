
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lgqfffgcuccbujzpgqfh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxncWZmZmdjdWNjYnVqenBncWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTg0NjgsImV4cCI6MjA4MzE5NDQ2OH0.lGCZCcBrzxU0WqXjP9wmFLNuPd6i2j6OSimaOCpz6SU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
