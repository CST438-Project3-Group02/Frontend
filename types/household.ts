export type Household = {
  id: string;
  name: string;
  rentCost: number;
  numOfBedrooms?: number;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  country?: string;
};