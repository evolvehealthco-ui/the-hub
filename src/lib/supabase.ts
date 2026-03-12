import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://krbmzttigdjhzojeijgt.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyYm16dHRpZ2RqaHpvamVpamd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMzMzNTksImV4cCI6MjA4ODkwOTM1OX0.cojQl_OKq1fn0am6lyt_fgNdRgq4D8UW7gecmn4S3Ws'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
