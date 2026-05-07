import { request } from './client';

// Get all households for a specific profile
export function getHouseholdsByProfile(profileId : number) {
  return request(`/api/profiles/${profileId}/households`);
}

// Get a household
export function getHousehold(householdId : number | string) {
  return request(`/api/households/${householdId}`);
}

// Get all profiles for a household
export function getHouseholdWithProfiles(householdId : number | string) {
  return request(`/api/households/${householdId}/profiles`);
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
      privs: 1, // admin!
      payInterval: 3 // 1 - weekly 2 - biweekly 3 - monthly (crude, i know...)
    })
  });
}

// Joining a household
export async function joinHousehold(profileId : number, householdId : number | string) {
  return request(`/api/memberships`, {
    method: 'POST',
    body: JSON.stringify({
      profileId,
      householdId,
      privs: 3, // regular user
      payInterval: 3
    })
  }); 
}

// update a household
export function updateHousehold(householdId: string, data: any) {
  return request(`/api/households/${householdId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

// delete a household
export function deleteHousehold(householdId: string) {
  return request(`/api/households/${householdId}`, {
    method: 'DELETE'
  })
}

// Generating an invite code
export function generateInviteCode(profileId : number, householdId : number | string) {
  return request(`/api/invite`, {
    method: 'POST',
    body: JSON.stringify({
      profileId,
      householdId
    })
  })
}

// Inviting a user to a household
export function getInviteDetails(inviteCode : string) {
  return request(`/api/invite?inviteCode=${inviteCode}`);
}