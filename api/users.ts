import { request } from './client';

// Retrieving a user
export function getUserByOauthID(oauthID : number) {
  return request(`/api/profiles/oauth/${oauthID}`);
}