'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '../supabase/server';

export async function discordSignIn() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: `${process.env.HOST_URI}/auth/callback`,
      queryParams: {
        prompt: 'none',
      },
    },
  });

  if (data.url) redirect(data.url);

  if (error) {
    console.error('Error signing in with Discord:', error);
    redirect('/error');
  }

  revalidatePath('/', 'layout');
}

export async function signOut() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
    redirect('/error');
  }

  revalidatePath('/', 'layout');
}
