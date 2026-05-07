import { request } from "./client";

// Grocery Lists
export function getGroceryListsByHousehold(householdId: number | string) {
  return request(`/api/grocery-lists/household/${householdId}`);
}

export function getFullGroceryListsByHousehold(householdId: number | string) {
  return request(`/api/grocery-lists/household/${householdId}/full`);
}

export function createGroceryList(data: any) {
  return request("/api/grocery-lists", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Grocery Items
export function getGroceryItemsByList(groceryListId: number | string) {
  return request(`/api/grocery-items/list/${groceryListId}`);
}

export function createGroceryItem(data: any) {
  return request("/api/grocery-items", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateGroceryItem(id: number | string, data: any) {
  return request(`/api/grocery-items/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteGroceryItem(id: number | string) {
  return request(`/api/grocery-items/${id}`, {
    method: "DELETE",
  });
}