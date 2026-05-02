import { request } from './client';

// Retrieving a user
export function getUserByOauthID(oauthID : string) {
  return request(`/api/profiles/oauth/${oauthID}`);
}