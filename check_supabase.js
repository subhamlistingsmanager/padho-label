const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jboxakwdzfrcqescwflr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impib3hha3dkemZyY3Flc2N3ZmxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MjMwNDAsImV4cCI6MjA4ODQ5OTA0MH0.Nby6YhxWgIhdchNeNTQ4VgRhs2Xgos9-u5S9uX5CBjY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
    console.log('--- Checking Supabase Tables ---');
    const tables = ['profiles', 'history', 'favorites', 'products'];

    for (const table of tables) {
        const { data, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.log(`❌ Table "${table}": Error - ${error.message}`);
        } else {
            console.log(`✅ Table "${table}": Exists`);
        }
    }
}

checkTables();
