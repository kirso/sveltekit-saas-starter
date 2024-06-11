// src/routes/(marketing)/auth/callback/+server.js
import { redirect } from '@sveltejs/kit';
import { isAuthApiError } from '@supabase/supabase-js';
import supabase from '$lib/supabaseClient';

export const GET = async ({ url, locals }) => {
  const code = url.searchParams.get('code');
  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      if (isAuthApiError(error)) {
        throw redirect(303, '/login/sign_in?verified=true');
      } else {
        console.error('Unexpected error:', error);
        throw redirect(303, '/error');
      }
    }
  } else {
    console.error('No code found in URL');
    throw redirect(303, '/error');
  }

  const next = url.searchParams.get('next');
  if (next) {
    throw redirect(303, next);
  }

  throw redirect(303, '/account');
};

