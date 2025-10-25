import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/property';

interface ExcelRow {
  etaj: string;
  nrAp: string;
  tipApartament: string;
  suprafata: number;
  pretCredit?: number;
  avans50?: number;
  avans80?: number;
  nume?: string;
  contact?: string;
  agent?: string;
  finisaje?: string;
  observatii?: string;
}

// Corp 1 data (Page 1)
const corp1Data: ExcelRow[] = [
  // PARTER
  { etaj: "PARTER", nrAp: "AP 1", tipApartament: "GARSONIERA", suprafata: 33.75, pretCredit: 52500, avans50: 51500, avans80: 51000 },
  { etaj: "PARTER", nrAp: "AP 2", tipApartament: "AP 2 CAMERE", suprafata: 43.55, pretCredit: 67500, avans50: 66500, avans80: 65500 },
  { etaj: "PARTER", nrAp: "AP 3", tipApartament: "AP 2 CAMERE", suprafata: 43.55, pretCredit: 67500, avans50: 66500, avans80: 65500 },
  { etaj: "PARTER", nrAp: "AP 4", tipApartament: "GARSONIERA", suprafata: 30.85, pretCredit: 48000, avans50: 47000, avans80: 46500 },
  { etaj: "PARTER", nrAp: "AP 5", tipApartament: "STUDIO", suprafata: 35.55, pretCredit: 55500, avans50: 54500, avans80: 53500 },
  { etaj: "PARTER", nrAp: "AP 6", tipApartament: "STUDIO", suprafata: 39.35, pretCredit: 61000, avans50: 60000, avans80: 59000 },
  { etaj: "PARTER", nrAp: "AP 7", tipApartament: "STUDIO", suprafata: 37.7, pretCredit: 58500, avans50: 57500, avans80: 56500 },
  { etaj: "PARTER", nrAp: "AP 8", tipApartament: "GARSONIERA", suprafata: 30.9, pretCredit: 48000, avans50: 47200, avans80: 46500 },
  { etaj: "PARTER", nrAp: "AP 9", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "PARTER", nrAp: "AP 10", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "PARTER", nrAp: "AP 11", tipApartament: "STUDIO", suprafata: 39.9, pretCredit: 62000, avans50: 61000, avans80: 60000 },
  { etaj: "PARTER", nrAp: "AP 12", tipApartament: "STUDIO", suprafata: 39.9, pretCredit: 62000, avans50: 61000, avans80: 60000 },
  { etaj: "PARTER", nrAp: "AP 13", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "PARTER", nrAp: "AP 14", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  
  // ETAJ 1
  { etaj: "ETAJ 1", nrAp: "AP 15", tipApartament: "GARSONIERA", suprafata: 33.75, pretCredit: 52500, avans50: 51500, avans80: 51000 },
  { etaj: "ETAJ 1", nrAp: "AP 16", tipApartament: "AP 2 CAMERE", suprafata: 43.55, pretCredit: 67500, avans50: 66500, avans80: 65500 },
  { etaj: "ETAJ 1", nrAp: "AP 17", tipApartament: "AP 2 CAMERE", suprafata: 43.55, pretCredit: 67500, avans50: 66500, avans80: 65500 },
  { etaj: "ETAJ 1", nrAp: "AP 18", tipApartament: "GARSONIERA", suprafata: 30.85, pretCredit: 48000, avans50: 47000, avans80: 46500 },
  { etaj: "ETAJ 1", nrAp: "AP 19", tipApartament: "STUDIO", suprafata: 35.55, pretCredit: 55500, avans50: 54500, avans80: 53500 },
  { etaj: "ETAJ 1", nrAp: "AP 20", tipApartament: "STUDIO", suprafata: 39.35, pretCredit: 61000, avans50: 60000, avans80: 59000 },
  { etaj: "ETAJ 1", nrAp: "AP 21", tipApartament: "STUDIO", suprafata: 37.7, pretCredit: 58500, avans50: 57500, avans80: 56500 },
  { etaj: "ETAJ 1", nrAp: "AP 22", tipApartament: "GARSONIERA", suprafata: 30.9, pretCredit: 48000, avans50: 47200, avans80: 46500 },
  { etaj: "ETAJ 1", nrAp: "AP 23", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "ETAJ 1", nrAp: "AP 24", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "ETAJ 1", nrAp: "AP 25", tipApartament: "STUDIO", suprafata: 39.9, pretCredit: 62000, avans50: 61000, avans80: 60000 },
  { etaj: "ETAJ 1", nrAp: "AP 26", tipApartament: "STUDIO", suprafata: 39.9, pretCredit: 62000, avans50: 61000, avans80: 60000 },
  { etaj: "ETAJ 1", nrAp: "AP 27", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "ETAJ 1", nrAp: "AP 28", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "ETAJ 1", nrAp: "AP 29", tipApartament: "GARSONIERA", suprafata: 29.95, pretCredit: 46500, avans50: 45700, avans80: 45000 },
  
  // ETAJ 2
  { etaj: "ETAJ 2", nrAp: "AP 30", tipApartament: "GARSONIERA", suprafata: 33.75, pretCredit: 52500, avans50: 51500, avans80: 51000 },
  { etaj: "ETAJ 2", nrAp: "AP 31", tipApartament: "AP 2 CAMERE", suprafata: 43.55, pretCredit: 67500, avans50: 66500, avans80: 65500 },
  { etaj: "ETAJ 2", nrAp: "AP 32", tipApartament: "AP 2 CAMERE", suprafata: 43.55, pretCredit: 67500, avans50: 66500, avans80: 65500 },
  { etaj: "ETAJ 2", nrAp: "AP 33", tipApartament: "GARSONIERA", suprafata: 30.85, pretCredit: 48000, avans50: 47000, avans80: 46500 },
  { etaj: "ETAJ 2", nrAp: "AP 34", tipApartament: "STUDIO", suprafata: 35.55, pretCredit: 55500, avans50: 54500, avans80: 53500, nume: "EUROCASA" },
  { etaj: "ETAJ 2", nrAp: "AP 35", tipApartament: "STUDIO", suprafata: 39.35, pretCredit: 61000, avans50: 60000, avans80: 59000 },
  { etaj: "ETAJ 2", nrAp: "AP 36", tipApartament: "STUDIO", suprafata: 37.7, pretCredit: 58500, avans50: 57500, avans80: 56500 },
  { etaj: "ETAJ 2", nrAp: "AP 37", tipApartament: "GARSONIERA", suprafata: 30.9, pretCredit: 48000, avans50: 47200, avans80: 46500 },
  { etaj: "ETAJ 2", nrAp: "AP 38", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "ETAJ 2", nrAp: "AP 39", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "ETAJ 2", nrAp: "AP 40", tipApartament: "STUDIO", suprafata: 39.9, pretCredit: 62000, avans50: 61000, avans80: 60000 },
  { etaj: "ETAJ 2", nrAp: "AP 41", tipApartament: "STUDIO", suprafata: 39.9, pretCredit: 62000, avans50: 61000, avans80: 60000 },
  { etaj: "ETAJ 2", nrAp: "AP 42", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "ETAJ 2", nrAp: "AP 43", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "ETAJ 2", nrAp: "AP 44", tipApartament: "GARSONIERA", suprafata: 29.95, pretCredit: 46500, avans50: 45700, avans80: 45000 },
  
  // ETAJ 3
  { etaj: "ETAJ 3", nrAp: "AP 45", tipApartament: "GARSONIERA", suprafata: 33.75, pretCredit: 52500, avans50: 51500, avans80: 51000 },
  { etaj: "ETAJ 3", nrAp: "AP 46", tipApartament: "AP 2 CAMERE", suprafata: 43.55, pretCredit: 67500, avans50: 66500, avans80: 65500 },
  { etaj: "ETAJ 3", nrAp: "AP 47", tipApartament: "AP 2 CAMERE", suprafata: 43.55, pretCredit: 67500, avans50: 66500, avans80: 65500 },
  { etaj: "ETAJ 3", nrAp: "AP 48", tipApartament: "GARSONIERA", suprafata: 30.85, pretCredit: 48000, avans50: 47000, avans80: 46500 },
  { etaj: "ETAJ 3", nrAp: "AP 49", tipApartament: "STUDIO", suprafata: 35.55, pretCredit: 55500, avans50: 54500, avans80: 53500, nume: "EUROCASA" },
  { etaj: "ETAJ 3", nrAp: "AP 50", tipApartament: "STUDIO", suprafata: 39.35, pretCredit: 61000, avans50: 60000, avans80: 59000 },
  { etaj: "ETAJ 3", nrAp: "AP 51", tipApartament: "STUDIO", suprafata: 37.7, pretCredit: 58500, avans50: 57500, avans80: 56500 },
  { etaj: "ETAJ 3", nrAp: "AP 52", tipApartament: "GARSONIERA", suprafata: 30.9, pretCredit: 48000, avans50: 47200, avans80: 46500 },
  { etaj: "ETAJ 3", nrAp: "AP 53", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "ETAJ 3", nrAp: "AP 54", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "ETAJ 3", nrAp: "AP 55", tipApartament: "STUDIO", suprafata: 39.9, pretCredit: 62000, avans50: 61000, avans80: 60000 },
  { etaj: "ETAJ 3", nrAp: "AP 56", tipApartament: "STUDIO", suprafata: 39.9, pretCredit: 62000, avans50: 61000, avans80: 60000 },
  { etaj: "ETAJ 3", nrAp: "AP 57", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "ETAJ 3", nrAp: "AP 58", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "ETAJ 3", nrAp: "AP 59", tipApartament: "GARSONIERA", suprafata: 29.95, pretCredit: 46500, avans50: 45700, avans80: 45000 },
  
  // ETAJ 4
  { etaj: "ETAJ 4", nrAp: "AP 60", tipApartament: "GARSONIERA", suprafata: 33.75, pretCredit: 52500, avans50: 51500, avans80: 51000 },
  { etaj: "ETAJ 4", nrAp: "AP 61", tipApartament: "AP 2 CAMERE", suprafata: 43.55, pretCredit: 67500, avans50: 66500, avans80: 65500 },
  { etaj: "ETAJ 4", nrAp: "AP 62", tipApartament: "AP 2 CAMERE", suprafata: 43.55, pretCredit: 67500, avans50: 66500, avans80: 65500 },
  { etaj: "ETAJ 4", nrAp: "AP 63", tipApartament: "GARSONIERA", suprafata: 30.85, pretCredit: 48000, avans50: 47000, avans80: 46500 },
  { etaj: "ETAJ 4", nrAp: "AP 64", tipApartament: "STUDIO", suprafata: 35.55, pretCredit: 55500, avans50: 54500, avans80: 53500, nume: "EUROCASA" },
  { etaj: "ETAJ 4", nrAp: "AP 65", tipApartament: "STUDIO", suprafata: 39.35, pretCredit: 61000, avans50: 60000, avans80: 59000 },
  { etaj: "ETAJ 4", nrAp: "AP 66", tipApartament: "STUDIO", suprafata: 37.7, pretCredit: 58500, avans50: 57500, avans80: 56500 },
  { etaj: "ETAJ 4", nrAp: "AP 67", tipApartament: "GARSONIERA", suprafata: 30.9, pretCredit: 48000, avans50: 47200, avans80: 46500 },
  { etaj: "ETAJ 4", nrAp: "AP 68", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "ETAJ 4", nrAp: "AP 69", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "ETAJ 4", nrAp: "AP 70", tipApartament: "STUDIO", suprafata: 39.9, pretCredit: 62000, avans50: 61000, avans80: 60000 },
  { etaj: "ETAJ 4", nrAp: "AP 71", tipApartament: "STUDIO", suprafata: 39.9, pretCredit: 62000, avans50: 61000, avans80: 60000 },
  { etaj: "ETAJ 4", nrAp: "AP 72", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "ETAJ 4", nrAp: "AP 73", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "ETAJ 4", nrAp: "AP 74", tipApartament: "GARSONIERA", suprafata: 29.95, pretCredit: 46500, avans50: 45700, avans80: 45000 },
  
  // ETAJ 5
  { etaj: "ETAJ 5", nrAp: "AP 75", tipApartament: "GARSONIERA", suprafata: 33.75, pretCredit: 52500, avans50: 51500, avans80: 51000 },
  { etaj: "ETAJ 5", nrAp: "AP 76", tipApartament: "AP 2 CAMERE", suprafata: 43.55, pretCredit: 67500, avans50: 66500, avans80: 65500 },
  { etaj: "ETAJ 5", nrAp: "AP 77", tipApartament: "AP 2 CAMERE", suprafata: 43.55, pretCredit: 67500, avans50: 66500, avans80: 65500 },
  { etaj: "ETAJ 5", nrAp: "AP 78", tipApartament: "GARSONIERA", suprafata: 30.85, pretCredit: 48000, avans50: 47000, avans80: 46500 },
  { etaj: "ETAJ 5", nrAp: "AP 79", tipApartament: "STUDIO", suprafata: 35.55, pretCredit: 55500, avans50: 54500, avans80: 53500 },
  { etaj: "ETAJ 5", nrAp: "AP 80", tipApartament: "STUDIO", suprafata: 39.35, pretCredit: 61000, avans50: 60000, avans80: 59000 },
  { etaj: "ETAJ 5", nrAp: "AP 81", tipApartament: "STUDIO", suprafata: 37.7, pretCredit: 58500, avans50: 57500, avans80: 56500 },
  { etaj: "ETAJ 5", nrAp: "AP 82", tipApartament: "GARSONIERA", suprafata: 30.9, pretCredit: 48000, avans50: 47200, avans80: 46500 },
  { etaj: "ETAJ 5", nrAp: "AP 83", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "ETAJ 5", nrAp: "AP 84", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "ETAJ 5", nrAp: "AP 85", tipApartament: "STUDIO", suprafata: 39.9, pretCredit: 62000, avans50: 61000, avans80: 60000 },
  { etaj: "ETAJ 5", nrAp: "AP 86", tipApartament: "STUDIO", suprafata: 39.9, pretCredit: 62000, avans50: 61000, avans80: 60000 },
  { etaj: "ETAJ 5", nrAp: "AP 87", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "ETAJ 5", nrAp: "AP 88", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "ETAJ 5", nrAp: "AP 89", tipApartament: "GARSONIERA", suprafata: 29.95, pretCredit: 46500, avans50: 45700, avans80: 45000 },
  
  // ETAJ 6
  { etaj: "ETAJ 6", nrAp: "AP 90", tipApartament: "GARSONIERA", suprafata: 33.75, pretCredit: 52500, avans50: 51500, avans80: 51000 },
  { etaj: "ETAJ 6", nrAp: "AP 91", tipApartament: "AP 2 CAMERE", suprafata: 43.55, pretCredit: 67500, avans50: 66500, avans80: 65500 },
  { etaj: "ETAJ 6", nrAp: "AP 92", tipApartament: "AP 2 CAMERE", suprafata: 43.55, pretCredit: 67500, avans50: 66500, avans80: 65500 },
  { etaj: "ETAJ 6", nrAp: "AP 93", tipApartament: "GARSONIERA", suprafata: 30.85, pretCredit: 48000, avans50: 47000, avans80: 46500 },
  { etaj: "ETAJ 6", nrAp: "AP 94", tipApartament: "STUDIO", suprafata: 35.55, pretCredit: 55500, avans50: 54500, avans80: 53500 },
  { etaj: "ETAJ 6", nrAp: "AP 95", tipApartament: "STUDIO", suprafata: 39.35, pretCredit: 61000, avans50: 60000, avans80: 59000 },
  { etaj: "ETAJ 6", nrAp: "AP 96", tipApartament: "STUDIO", suprafata: 37.7, pretCredit: 58500, avans50: 57500, avans80: 56500 },
  { etaj: "ETAJ 6", nrAp: "AP 97", tipApartament: "GARSONIERA", suprafata: 30.9, pretCredit: 48000, avans50: 47200, avans80: 46500 },
  { etaj: "ETAJ 6", nrAp: "AP 98", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "ETAJ 6", nrAp: "AP 99", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "ETAJ 6", nrAp: "AP 100", tipApartament: "STUDIO", suprafata: 39.9, pretCredit: 62000, avans50: 61000, avans80: 60000 },
  { etaj: "ETAJ 6", nrAp: "AP 101", tipApartament: "STUDIO", suprafata: 39.9, pretCredit: 62000, avans50: 61000, avans80: 60000 },
  { etaj: "ETAJ 6", nrAp: "AP 102", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "ETAJ 6", nrAp: "AP 103", tipApartament: "GARSONIERA", suprafata: 27.45, avans80: 44000 },
  { etaj: "ETAJ 6", nrAp: "AP 104", tipApartament: "GARSONIERA", suprafata: 29.95, pretCredit: 46500, avans50: 45700, avans80: 45000 },
];

// Corp 2 data (Page 2)
const corp2Data: ExcelRow[] = [
  // PARTER
  { etaj: "PARTER", nrAp: "AP 1", tipApartament: "GARSONIERA", suprafata: 34.1 },
  { etaj: "PARTER", nrAp: "AP 2", tipApartament: "AP 2 CAMERE", suprafata: 43.55 },
  { etaj: "PARTER", nrAp: "AP 3", tipApartament: "AP 3 CAMERE", suprafata: 62.9 },
  { etaj: "PARTER", nrAp: "AP 4", tipApartament: "AP 2 CAMERE", suprafata: 46.7 },
  { etaj: "PARTER", nrAp: "AP 5", tipApartament: "STUDIO", suprafata: 41.5 },
  { etaj: "PARTER", nrAp: "AP 6", tipApartament: "STUDIO", suprafata: 37.7 },
  { etaj: "PARTER", nrAp: "AP 7", tipApartament: "GARSONIERA", suprafata: 30.9 },
  { etaj: "PARTER", nrAp: "AP 8", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "PARTER", nrAp: "AP 9", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "PARTER", nrAp: "AP 10", tipApartament: "STUDIO", suprafata: 39.9 },
  { etaj: "PARTER", nrAp: "AP 11", tipApartament: "STUDIO", suprafata: 39.9 },
  { etaj: "PARTER", nrAp: "AP 12", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "PARTER", nrAp: "AP 13", tipApartament: "GARSONIERA", suprafata: 27.45 },
  
  // ETAJ 1
  { etaj: "ETAJ 1", nrAp: "AP 14", tipApartament: "GARSONIERA", suprafata: 34.1 },
  { etaj: "ETAJ 1", nrAp: "AP 15", tipApartament: "AP 2 CAMERE", suprafata: 43.55 },
  { etaj: "ETAJ 1", nrAp: "AP 16", tipApartament: "AP 3 CAMERE", suprafata: 62.9 },
  { etaj: "ETAJ 1", nrAp: "AP 17", tipApartament: "AP 2 CAMERE", suprafata: 46.7 },
  { etaj: "ETAJ 1", nrAp: "AP 18", tipApartament: "STUDIO", suprafata: 41.5 },
  { etaj: "ETAJ 1", nrAp: "AP 19", tipApartament: "STUDIO", suprafata: 37.7 },
  { etaj: "ETAJ 1", nrAp: "AP 20", tipApartament: "GARSONIERA", suprafata: 30.9 },
  { etaj: "ETAJ 1", nrAp: "AP 21", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "ETAJ 1", nrAp: "AP 22", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "ETAJ 1", nrAp: "AP 23", tipApartament: "STUDIO", suprafata: 39.9 },
  { etaj: "ETAJ 1", nrAp: "AP 24", tipApartament: "STUDIO", suprafata: 39.9 },
  { etaj: "ETAJ 1", nrAp: "AP 25", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "ETAJ 1", nrAp: "AP 26", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "ETAJ 1", nrAp: "AP 27", tipApartament: "GARSONIERA", suprafata: 29.05 },
  
  // ETAJ 2
  { etaj: "ETAJ 2", nrAp: "AP 28", tipApartament: "GARSONIERA", suprafata: 33.75 },
  { etaj: "ETAJ 2", nrAp: "AP 29", tipApartament: "AP 4 CAMERE", suprafata: 0 },
  { etaj: "ETAJ 2", nrAp: "AP 30", tipApartament: "AP 2 CAMERE", suprafata: 46.7 },
  { etaj: "ETAJ 2", nrAp: "AP 31", tipApartament: "STUDIO", suprafata: 41.5 },
  { etaj: "ETAJ 2", nrAp: "AP 32", tipApartament: "STUDIO", suprafata: 37.7 },
  { etaj: "ETAJ 2", nrAp: "AP 33", tipApartament: "GARSONIERA", suprafata: 30.9 },
  { etaj: "ETAJ 2", nrAp: "AP 34", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "ETAJ 2", nrAp: "AP 35", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "ETAJ 2", nrAp: "AP 36", tipApartament: "STUDIO", suprafata: 39.9 },
  { etaj: "ETAJ 2", nrAp: "AP 37", tipApartament: "STUDIO", suprafata: 39.9 },
  { etaj: "ETAJ 2", nrAp: "AP 38", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "ETAJ 2", nrAp: "AP 39", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "ETAJ 2", nrAp: "AP 40", tipApartament: "GARSONIERA", suprafata: 29.05 },
  
  // ETAJ 3
  { etaj: "ETAJ 3", nrAp: "AP 41", tipApartament: "GARSONIERA", suprafata: 34.1 },
  { etaj: "ETAJ 3", nrAp: "AP 42", tipApartament: "AP 2 CAMERE", suprafata: 43.55 },
  { etaj: "ETAJ 3", nrAp: "AP 43", tipApartament: "AP 3 CAMERE", suprafata: 62.9 },
  { etaj: "ETAJ 3", nrAp: "AP 44", tipApartament: "AP 2 CAMERE", suprafata: 46.7 },
  { etaj: "ETAJ 3", nrAp: "AP 45", tipApartament: "STUDIO", suprafata: 41.5 },
  { etaj: "ETAJ 3", nrAp: "AP 46", tipApartament: "STUDIO", suprafata: 37.7 },
  { etaj: "ETAJ 3", nrAp: "AP 47", tipApartament: "GARSONIERA", suprafata: 30.9 },
  { etaj: "ETAJ 3", nrAp: "AP 48", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "ETAJ 3", nrAp: "AP 49", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "ETAJ 3", nrAp: "AP 50", tipApartament: "STUDIO", suprafata: 39.9 },
  { etaj: "ETAJ 3", nrAp: "AP 51", tipApartament: "STUDIO", suprafata: 39.9 },
  { etaj: "ETAJ 3", nrAp: "AP 52", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "ETAJ 3", nrAp: "AP 53", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "ETAJ 3", nrAp: "AP 54", tipApartament: "GARSONIERA", suprafata: 29.05 },
  
  // ETAJ 4
  { etaj: "ETAJ 4", nrAp: "AP 55", tipApartament: "GARSONIERA", suprafata: 34.1 },
  { etaj: "ETAJ 4", nrAp: "AP 56", tipApartament: "AP 2 CAMERE", suprafata: 43.55 },
  { etaj: "ETAJ 4", nrAp: "AP 57", tipApartament: "AP 3 CAMERE", suprafata: 62.9 },
  { etaj: "ETAJ 4", nrAp: "AP 58", tipApartament: "AP 2 CAMERE", suprafata: 46.7 },
  { etaj: "ETAJ 4", nrAp: "AP 59", tipApartament: "STUDIO", suprafata: 41.5 },
  { etaj: "ETAJ 4", nrAp: "AP 60", tipApartament: "STUDIO", suprafata: 37.7 },
  { etaj: "ETAJ 4", nrAp: "AP 61", tipApartament: "GARSONIERA", suprafata: 30.9 },
  { etaj: "ETAJ 4", nrAp: "AP 62", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "ETAJ 4", nrAp: "AP 63", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "ETAJ 4", nrAp: "AP 64", tipApartament: "STUDIO", suprafata: 39.9 },
  { etaj: "ETAJ 4", nrAp: "AP 65", tipApartament: "STUDIO", suprafata: 39.9 },
  { etaj: "ETAJ 4", nrAp: "AP 66", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "ETAJ 4", nrAp: "AP 67", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "ETAJ 4", nrAp: "AP 68", tipApartament: "GARSONIERA", suprafata: 29.05 },
  
  // ETAJ 5
  { etaj: "ETAJ 5", nrAp: "AP 69", tipApartament: "GARSONIERA", suprafata: 34.1 },
  { etaj: "ETAJ 5", nrAp: "AP 70", tipApartament: "AP 2 CAMERE", suprafata: 43.55 },
  { etaj: "ETAJ 5", nrAp: "AP 71", tipApartament: "AP 3 CAMERE", suprafata: 62.9 },
  { etaj: "ETAJ 5", nrAp: "AP 72", tipApartament: "AP 2 CAMERE", suprafata: 46.7 },
  { etaj: "ETAJ 5", nrAp: "AP 73", tipApartament: "STUDIO", suprafata: 41.5 },
  { etaj: "ETAJ 5", nrAp: "AP 74", tipApartament: "STUDIO", suprafata: 37.7 },
  { etaj: "ETAJ 5", nrAp: "AP 75", tipApartament: "GARSONIERA", suprafata: 30.9 },
  { etaj: "ETAJ 5", nrAp: "AP 76", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "ETAJ 5", nrAp: "AP 77", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "ETAJ 5", nrAp: "AP 78", tipApartament: "STUDIO", suprafata: 39.9 },
  { etaj: "ETAJ 5", nrAp: "AP 79", tipApartament: "STUDIO", suprafata: 39.9 },
  { etaj: "ETAJ 5", nrAp: "AP 80", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "ETAJ 5", nrAp: "AP 81", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "ETAJ 5", nrAp: "AP 82", tipApartament: "GARSONIERA", suprafata: 29.05 },
  
  // ETAJ 6
  { etaj: "ETAJ 6", nrAp: "AP 83", tipApartament: "GARSONIERA", suprafata: 34.1 },
  { etaj: "ETAJ 6", nrAp: "AP 84", tipApartament: "AP 2 CAMERE", suprafata: 43.55 },
  { etaj: "ETAJ 6", nrAp: "AP 85", tipApartament: "AP 3 CAMERE", suprafata: 62.9 },
  { etaj: "ETAJ 6", nrAp: "AP 86", tipApartament: "AP 2 CAMERE", suprafata: 46.7 },
  { etaj: "ETAJ 6", nrAp: "AP 87", tipApartament: "STUDIO", suprafata: 41.5 },
  { etaj: "ETAJ 6", nrAp: "AP 88", tipApartament: "STUDIO", suprafata: 37.7 },
  { etaj: "ETAJ 6", nrAp: "AP 89", tipApartament: "GARSONIERA", suprafata: 30.9 },
  { etaj: "ETAJ 6", nrAp: "AP 90", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "ETAJ 6", nrAp: "AP 91", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "ETAJ 6", nrAp: "AP 92", tipApartament: "STUDIO", suprafata: 39.9 },
  { etaj: "ETAJ 6", nrAp: "AP 93", tipApartament: "STUDIO", suprafata: 39.9 },
  { etaj: "ETAJ 6", nrAp: "AP 94", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "ETAJ 6", nrAp: "AP 95", tipApartament: "GARSONIERA", suprafata: 27.45 },
  { etaj: "ETAJ 6", nrAp: "AP 96", tipApartament: "GARSONIERA", suprafata: 29.05 },
];

function transformToProperty(row: ExcelRow, corp: string): Omit<Property, 'id'> {
  return {
    corp,
    etaj: row.etaj,
    nrAp: row.nrAp,
    tipCom: row.tipApartament,
    mpUtili: row.suprafata,
    pretCuTva: row.pretCredit || 0,
    avans50: row.avans50 || 0,
    avans80: row.avans80 || 0,
    nume: row.nume || '',
    contact: row.contact || '',
    agent: row.agent || '',
    finisaje: row.finisaje || '',
    observatii: row.observatii || '',
    status: 'disponibil' as const
  };
}

export async function importEurocasa65GData() {
  try {
    // Delete existing properties
    const { error: deleteError } = await supabase
      .from('properties')
      .delete()
      .eq('complex_id', 'complex-2');

    if (deleteError) throw deleteError;

    // Transform and insert Corp 1 data
    const corp1Properties = corp1Data.map(row => {
      const { id: _, ...property } = transformToProperty(row, 'CORP 1') as any;
      return {
        complex_id: 'complex-2',
        data: property
      };
    });

    // Transform and insert Corp 2 data
    const corp2Properties = corp2Data.map(row => {
      const { id: _, ...property } = transformToProperty(row, 'CORP 2') as any;
      return {
        complex_id: 'complex-2',
        data: property
      };
    });

    // Insert all properties
    const allProperties = [...corp1Properties, ...corp2Properties];
    
    const { error: insertError } = await supabase
      .from('properties')
      .insert(allProperties);

    if (insertError) throw insertError;

    // Update complex stats
    await supabase
      .from('complexes')
      .update({
        total_properties: 200,
        available_properties: 200
      })
      .eq('id', 'complex-2');

    return { success: true, count: allProperties.length };
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
}
