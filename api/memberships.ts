import { request } from './client';

// Get a user's membership info
export function getMembership(profileId : number, householdId : number | string) {
  return request(`/api/memberships?profileId=${profileId}&householdId=${householdId}`);
}

// Update membership
export function updateMembership(membershipId : number, payload : any) {
  return request(`/api/memberships/${membershipId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

// Remove membership
export function deleteMembership(membershipId : number) {
  return request(`/api/memberships/${membershipId}`, {
    method: 'DELETE'
  });
}