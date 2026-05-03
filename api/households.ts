import { request } from './client';

// Get all households for a specific profile
export function getHouseholdsByProfileId(profileId : number) {
  return request(`/api/households?profileId=${profileId}`);
}

// Creating a household
export function createHousehold(profileId : number, payload : any) {
  return request(`/api/households?profileId=${profileId}`, {
      method: 'POST',
      body: JSON.stringify(payload)
  });
}

// Inviting a user to a household
export function inviteHousehold(household_id : number) {
  return request(`/api/households/${household_id}/invite`, {
    method: 'POST'
  });
}