import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://khvfmcgggfylzoatprtz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtodmZtY2dnZ2Z5bHpvYXRwcnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MTMzODksImV4cCI6MjA2NTk4OTM4OX0.5bw4-hwlrpjYAn7E7owsgMheMsso9wYniKEv0O6LZU8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
