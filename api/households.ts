import { request } from './client';

// Get all households for a specific user
export function getHouseholdsById(userId : number) {
  return request(`/api/households/${userId}`);
}

// Creating a household
export function createHousehold() {
    return request(`/api/households`, {
        method: 'POST'
    });
}

// Inviting a user to a household
export function inviteHousehold(household_id : number) {
    return request(`/api/households/${household_id}/invite`, {
    method: 'POST'
    });
}