import { request } from './client';

export function inviteHousehold(household_id : number) {
  return request(`/household/${household_id}/invite`, {
    method: 'POST'
  });
}