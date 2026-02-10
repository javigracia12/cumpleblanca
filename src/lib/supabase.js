import { createClient } from '@supabase/supabase-js'

// En local puedes usar .env.local; en Cloudflare (solo static assets) no hay variables, usamos estos valores.
// La anon key es pública por diseño; la seguridad está en las políticas RLS de Supabase.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wapfguntyltyiovlmzwt.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhcGZndW50eWx0eWlvdmxtend0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NDA1MTUsImV4cCI6MjA4NjMxNjUxNX0.Qs_SKEC2K9cbAD8eK8EZdidJKXFF7Cmy5lQvDpEO2TU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
