import { request } from "./client";

// Get all chores for a household
export function getChoresByHousehold(householdId: number | string) {
  return request(`/api/chores/household/${householdId}`);
}

// Create a new chore
export function createChore(data: any) {
  return request("/api/chores", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Complete a chore
export function completeChore(choreId: number | string) {
  return request(`/api/chores/${choreId}/complete`, {
    method: "PATCH",
  });
}

// Get all profiles for a household
export function getHouseholdProfiles(householdId: number | string) {
  return request(`/api/households/${householdId}/profiles`);
}