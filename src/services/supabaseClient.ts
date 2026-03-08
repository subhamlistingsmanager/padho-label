import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://jboxakwdzfrcqescwflr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impib3hha3dkemZyY3Flc2N3ZmxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MjMwNDAsImV4cCI6MjA4ODQ5OTA0MH0.Nby6YhxWgIhdchNeNTQ4VgRhs2Xgos9-u5S9uX5CBjY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
