import { request } from "./client";

export function getExpensesByHousehold(householdId: number) {
  return request(`/api/expenses/household/${householdId}`);
}

export function getExpensesWithBillsByHousehold(householdId: number) {
  return request(`/api/expenses/household/${householdId}/full`);
}

export function getExpenseWithBills(expenseId: number) {
  return request(`/api/expenses/${expenseId}/bills`);
}

export function getExpensesByStatus(householdId: number, paid: boolean) {
  return request(`/api/expenses/household/${householdId}/status?paid=${paid}`);
}

export function createExpense(payload: {
  householdId: number;
  description: string;
  amount: number;
  paidByDate?: string;
}) {
  return request(`/api/expenses`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function markExpensePaid(expenseId: number) {
  return request(`/api/expenses/${expenseId}/paid`, {
    method: "PATCH",
  });
}

export function deleteExpense(expenseId: number) {
  return request(`/api/expenses/${expenseId}`, {
    method: "DELETE",
  });
}

export function getBillsByProfile(profileId: number) {
  return request(`/api/bills/profile/${profileId}`);
}

export function getBillsByProfileAndStatus(profileId: number, paid: boolean) {
  return request(`/api/bills/profile/${profileId}/status?paid=${paid}`);
}

export function getBillsByExpense(expenseId: number) {
  return request(`/api/bills/expense/${expenseId}`);
}

export function getBillsByProfileAndHousehold(
  profileId: number,
  householdId: number,
) {
  return request(`/api/bills/profile/${profileId}/household/${householdId}`);
}

export function markBillPaid(billId: number) {
  return request(`/api/bills/${billId}/paid`, {
    method: "PATCH",
  });
}
