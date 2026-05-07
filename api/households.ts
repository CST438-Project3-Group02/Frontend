import { request } from "./client";

// Get all households for a specific profile
export function getHouseholdsByProfile(profileId: number) {
  return request(`/api/profiles/${profileId}/households`);
}

// Get a household
export function getHousehold(householdId: number) {
  return request(`/api/households/${householdId}`);
}

// Creating a household
export async function createHousehold(profileId: number, payload: any) {
  return request(`/api/households`, {
    method: "POST",
    body: JSON.stringify({ ...payload, profileId }),
  });

  // return request(`/api/memberships`, {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     profileId,
  //     householdId,
  //     privs: 1, // admin!
  //     payInterval: 3 // 1 - weekly 2 - biweekly 3 - monthly (crude, i know...)
  //   })
  // });
}

// Joining a household
export async function joinHousehold(profileId: number, householdId: number) {
  return request(`/api/memberships`, {
    method: "POST",
    body: JSON.stringify({
      profileId,
      householdId,
      privs: 3, // regular user
      payInterval: 3,
    }),
  });
}

// Generating an invite code
export function generateInviteCode(
  profileId: number,
  householdId: number | string,
) {
  return request(`/api/invite`, {
    method: "POST",
    body: JSON.stringify({
      profileId,
      householdId,
    }),
  });
}

// Inviting a user to a household
export function getInviteDetails(inviteCode: string) {
  return request(`/api/invite?inviteCode=${inviteCode}`);
}
