import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

export default async function PrivatePage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser(); // Get User Example
  if (error ?? !data?.user) {
    redirect('/error');
  }

  return <p>Hello {data.user.email}</p>;
}
