import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const errorParam = searchParams.get('error_description') || searchParams.get('error');

  if (errorParam) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorParam)}`);
  }

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerSupabase(cookieStore);
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      } else {
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
      }
    } else {
      return NextResponse.redirect(`${origin}/login?error=Supabase+not+configured`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=No+code+provided`);
}
