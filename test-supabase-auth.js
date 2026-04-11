require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testAuth() {
  const emailsToTest = ['david', 'david@budharooms.es', 'david@gmail.com', 'admin@budharooms.es'];
  const password = 'david2026';

  for (const email of emailsToTest) {
    console.log(`Testing auth for: ${email}`);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`Error testing ${email}:`, error.message);
    } else {
      console.log(`SUCCESS! Login works for ${email}`);
      console.log('User ID:', data.user.id);
      return;
    }
  }
}

testAuth();
