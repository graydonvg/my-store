import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

export default function getServiceSupabase() {
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
}
