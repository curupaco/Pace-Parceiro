import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const raceService = {
    async getAllRaces() {
        const { data, error } = await supabase
            .from('race_variants')
            .select('*')
            .order('race_name', { ascending: true });
        if (error) throw error;
        return data || [];
    }
};