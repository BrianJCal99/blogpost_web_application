import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js'

dotenv.config();

const supabaseUrl = 'https://rtjsvmnemmnfohxtmqqm.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

/* const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: 'brianjanaka@gmail.com',
    password: 'brian123',
  }); */

// console.log(signUpData);
// console.log(signUpError);

const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: 'brianjanaka@gmail.com',
    password: 'brian123',
  });

// console.log(signInData);
// console.log(signInError);

const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

// console.log(sessionData);
// console.log(sessionError);

const { data: { user } } = await supabase.auth.getUser();

console.log(user);

const { error: signOutError } = await supabase.auth.signOut();

console.log(signOutError || 'Successfully signed out.');