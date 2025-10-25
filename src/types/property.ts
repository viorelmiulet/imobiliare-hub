export interface Property {
  id: string;
  etaj: string;
  nrAp: string;
  tipCom: string;
  mpUtili: number;
  pretCuTva: number;
  avans50: number;
  avans80: number;
  nume: string;
  contact: string;
  agent: string;
  finisaje: string;
  observatii: string;
  status: "disponibil" | "rezervat" | "vandut";
}
