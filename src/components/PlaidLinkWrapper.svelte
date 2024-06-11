<script>
  import { onMount } from 'svelte';
  import { PlaidLink } from 'react-plaid-link';
  import { createEventDispatcher } from 'svelte';

  export let token;
  const dispatch = createEventDispatcher();

  function handleOnSuccess(public_token, metadata) {
    dispatch('success', { public_token, metadata });
  }

  function handleOnExit(error, metadata) {
    dispatch('exit', { error, metadata });
  }

  onMount(() => {
    if (!token) {
      console.error("No link token provided");
    }
  });
</script>

{#if token}
  <PlaidLink
    token={token}
    onSuccess={handleOnSuccess}
    onExit={handleOnExit}
  >
    <button>Link your bank account</button>
  </PlaidLink>
{/if}
