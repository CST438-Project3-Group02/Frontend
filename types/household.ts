export type Household = {
  householdId: number;
  householdName: string;
  rentCost: number | null;
  numOfBedrooms: number | null;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};