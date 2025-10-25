export interface Property {
  id: string;
  client_id?: string;
  clientName?: string;
  [key: string]: any; // Allow dynamic properties from Excel
}
