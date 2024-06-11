<script>
  import { onMount } from 'svelte';
  import PlaidLinkWrapper from '$components/PlaidLinkWrapper.svelte'; // Adjust the import path as necessary
  let linkToken = '';

  async function createLinkToken() {
    const response = await fetch('/api/create-link-token');
    const data = await response.json();
    linkToken = data.link_token;
  }

  function handlePlaidLinkSuccess(event) {
    const { public_token, metadata } = event.detail;
    fetch('/api/exchange-public-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_token }),
    }).then(() => {
      // Redirect or notify user after successful bank linking
      window.location.href = '/account';
    });
  }

  onMount(() => {
    createLinkToken();
  });
</script>

{#if linkToken}
  <PlaidLinkWrapper
    token={linkToken}
    on:success={handlePlaidLinkSuccess}
  />
{/if}

