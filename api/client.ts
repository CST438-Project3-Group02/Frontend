const BASE_URL = "https://roomie-production-06da.up.railway.app";

// TODO: JWT with bearer token eventually
export async function request(endpoint: string, options: RequestInit = {}) {
  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  const url = `${BASE_URL}${endpoint}`;
  console.log(`[API Request] ${config.method || "GET"} ${url}`);
  if (config.body) {
    console.log("[API Request Body]", config.body);
  }

  const response = await fetch(url, config);

  let data;

  // try to get data from response
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  console.log(`[API Response] Status: ${response.status}`, data);

  // throw error on bad response
  if (!response.ok) {
    throw {
      status: response.status,
      data,
    };
  }

  return data;
}
