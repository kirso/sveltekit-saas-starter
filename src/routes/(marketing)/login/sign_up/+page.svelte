<script lang="ts">
  import { Auth } from "@supabase/auth-ui-svelte";
  import { sharedAppearance, oauthProviders } from "../login_config";
  import supabase from '$lib/supabaseClient';

  let role = 'manager'; // Default role

  interface AuthEventDetail {
    event: string;
    session: {
      user: {
        id: string;
      };
    };
  }

  async function handleAuthEvent(event: CustomEvent<AuthEventDetail>) {
    if (event.detail.event === 'SIGNED_IN') {
      const user = event.detail.session.user;
      const { error: updateError } = await supabase
        .from('users')
        .update({ role })
        .eq('id', user.id);

      if (updateError) {
        console.error(updateError.message);
      } else {
        console.log('User signed up successfully with role:', role);
      }
    }
  }
</script>

<svelte:head>
  <title>Sign up</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6">Sign Up</h1>
<Auth
  supabaseClient={supabase}
  view="sign_up"
  redirectTo={`${window.location.origin}/auth/callback`}
  showLinks={false}
  providers={oauthProviders}
  socialLayout="horizontal"
  appearance={sharedAppearance}
  on:auth={handleAuthEvent}
/>

<!-- Role selection outside the Auth component to capture it before sign-up -->
<div>
  <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
  <select id="role" bind:value={role} class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
    <option value="manager">Manager</option>
    <option value="creator">Creator</option>
  </select>
</div>

<div class="text-l text-slate-800 mt-4 mb-2">
  Have an account? <a class="underline" href="/login/sign_in">Sign in</a>.
</div>
