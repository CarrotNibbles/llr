'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function emailSignIn(email: string, password: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function emailSignUp(email: string, password: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Error signing up:', error);
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function discordSignIn() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: `${process.env.HOST_URI}/auth/callback`,
    },
  });

  if (data.url) redirect(data.url);

  if (error) {
    console.error('Error signing in with Discord:', error);
    redirect('/error');
  }

  revalidatePath('/', 'layout');
}
