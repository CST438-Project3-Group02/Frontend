import { request } from "./client";

// Retrieving a user
export function getUserByOauthID(oauthID: string) {
  return request(`/api/profiles/oauth/${oauthID}`);
}

// Update a profile in Spring Boot backend
export function updateProfile(profileId: number | string, data: any) {
  return request(`/api/profiles/${profileId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
