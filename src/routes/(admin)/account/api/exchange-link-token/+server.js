import plaidClient from '$lib/plaidClient';

export const POST = async ({ request }) => {
  const { public_token } = await request.json();
  const response = await plaidClient.itemPublicTokenExchange({ public_token });
  const accessToken = response.data.access_token;

  // Save the access token securely in your database
  // ...

  return {
    status: 200,
    body: { success: true },
  };
};
