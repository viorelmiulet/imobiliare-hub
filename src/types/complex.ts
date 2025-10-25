export interface Complex {
  id: string;
  name: string;
  location: string;
  description: string;
  totalProperties: number;
  availableProperties: number;
  image?: string;
  columns?: string[];
}
