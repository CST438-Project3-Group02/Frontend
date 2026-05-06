const BASE_URL = 'https://roomie-production-06da.up.railway.app';

// TODO: JWT with bearer token eventually
export async function request(endpoint : string, options : RequestInit = {}) {
  // make a call to api

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    }
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  let data;

  // try to get data from response
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  // throw error on bad response
  if (!response.ok) {
    throw {
      status: response.status,
      data,
    };
  }

  return data;
}