<script lang="ts">
  import { onMount } from 'svelte';
  import supabase from '$lib/supabaseClient';
  let linkToken = '';

  async function createLinkToken() {
    try {
      const response = await fetch('/api/create_link_token');
      const data = await response.json();
      if (data.link_token) {
        linkToken = data.link_token;
      } else {
        console.error('Failed to fetch link token:', data.error);
      }
    } catch (error) {
      console.error('Error creating link token:', error);
    }
  }

  async function handlePlaidLinkSuccess(public_token, metadata) {
    try {
      await fetch('/api/exchange_link_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token }),
      });

      // Update the user's bank_linked status in the database
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase
          .from('profiles')
          .update({ bank_linked: true })
          .eq('id', user.id);

        // Redirect or notify user after successful bank linking
        window.location.href = '/account';
      } else {
        console.error('No authenticated user found');
      }
    } catch (error) {
      console.error('Error handling Plaid link success:', error);
    }
  }

  onMount(() => {
    createLinkToken();
  });
</script>

{#if linkToken}
  <div id="plaid-link-container"></div>
  <script>
    document.addEventListener('DOMContentLoaded', function () {
      var handler = Plaid.create({
        token: linkToken,
        onSuccess: function (public_token, metadata) {
          handlePlaidLinkSuccess(public_token, metadata);
        },
        onExit: function (err, metadata) {
          if (err != null) {
            console.error('Link exited with error:', err);
          }
        },
      });

      handler.open();
    });
  </script>
{/if}
