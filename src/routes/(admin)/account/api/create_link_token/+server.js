import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';
import { PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV } from '$env/static/private';
import { json } from '@sveltejs/kit';

const configuration = new Configuration({
  basePath: PlaidEnvironments.development,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export const GET = async () => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: PLAID_CLIENT_ID, // Replace with your unique user ID
      },
      client_name: 'Splvt', // Your application name
      products: [Products.Auth], // Use the correct type for products
      country_codes: [CountryCode.Us], // Use the correct type for country codes
      language: 'en',
    });
    return json({ link_token: response.data.link_token });
  } catch (error) {
    return json({ error: error.response.data.error_message }, { status: 500 });
  }
};
