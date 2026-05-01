const BASE_URL = 'temp';

// TODO: JWT with bearer token eventually
export async function request(endpoint : string, options : RequestInit = {}) {
  // make a call to api
  const config = {
    ...options,
    headers: {
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