import { request } from './client';

export function getAllActivities(householdId : number | string) {
  return request(`/api/activities/household/${householdId}`);
}