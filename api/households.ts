import { request } from './client';

// Get all households for a specific profile
export function getHouseholdsByProfile(profileId : number) {
  return request(`/api/profiles/${profileId}/households`);
}

// Creating a household
export async function createHousehold(profileId : number, payload : any) {
  
  let { householdId } = await request(`/api/households`, {
      method: 'POST',
      body: JSON.stringify(payload)
  });

  return request(`/api/memberships`, {
    method: 'POST',
    body: JSON.stringify({
      profileId,
      householdId,
      privs: 1,
      payInterval: 3 // 1 - weekly 2 - biweekly 3 - monthly (crude, i know...)
    })
  });
}

// Inviting a user to a household
export function inviteHousehold(household_id : number) {
  return request(`/api/households/${household_id}/invite`, {
    method: 'POST'
  });
}