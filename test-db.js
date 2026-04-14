const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://fiqesxqcqdojwglameyg.supabase.co', 'sb_publishable_yeRzihMq_sNLAzjnBrn2sg_Naxm-Ihc');

async function test() {
  const { data: q1, error: e1 } = await supabase.from('emergency_numbers').select('*');
  console.log("emergency_numbers:", q1, e1);
  const { data: q2, error: e2 } = await supabase.from('guide_categories').select('*');
  console.log("guide_categories:", q2, e2);
  const { data: q3, error: e3 } = await supabase.from('guide_pois').select('*');
  console.log("guide_pois:", q3, e3);
  const { data: q4, error: e4 } = await supabase.from('global_settings').select('*');
  console.log("global_settings:", q4, e4);
}
test();
