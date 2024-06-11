import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';
import { PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV } from '$env/static/private';

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export const GET = async () => {
  const response = await plaidClient.linkTokenCreate({
    user: {
      client_user_id: 'unique-user-id', // Replace with your unique user ID
    },
    client_name: 'SaaS Starter', // Your application name
    products: [Products.Auth], // Use the correct type for products
    country_codes: [CountryCode.Us], // Use the correct type for country codes
    language: 'en',
  });

  return {
    status: 200,
    body: { link_token: response.data.link_token },
  };
};
