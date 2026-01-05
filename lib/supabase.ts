import { createClient } from '@supabase/supabase-js';

// Fix: Using process.env instead of import.meta.env to resolve TypeScript error where 'env' is missing on 'ImportMeta'
const supabaseUrl = (process.env as any).VITE_SUPABASE_URL || 'https://lgqfffgcuccbujzpgqfh.supabase.co';
const supabaseAnonKey = (process.env as any).VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxncWZmZmdjdWNjYnVqenBncWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTg0NjgsImV4cCI6MjA4MzE5NDQ2OH0.lGCZCcBrzxU0WqXjP9wmFLNuPd6i2j6OSimaOCpz6SU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);