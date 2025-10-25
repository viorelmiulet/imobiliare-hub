import { supabase } from '@/integrations/supabase/client';

interface PropertyRow {
  etaj: string;
  nrAp: string;
  tipCom: string;
  mpUtili: number;
  pretFaraTva?: number;
  pretCuTva?: number;
  avans50?: number;
  avans80?: number;
  nume?: string;
  contact?: string;
  agent?: string;
  finisaje?: string;
  observatii?: string;
}

const parseNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const str = String(value).replace(/,/g, '').replace(/\s/g, '');
  const parsed = parseFloat(str);
  return isNaN(parsed) ? 0 : parsed;
};

const determineStatus = (nume?: string): "disponibil" | "rezervat" | "vandut" => {
  if (!nume || nume.trim() === '') return 'disponibil';
  const numeText = nume.toLowerCase();
  if (numeText.includes('rezervat')) return 'rezervat';
  return 'vandut';
};

const complex1Properties: PropertyRow[] = [
  // DEMISOL
  { etaj: "DEMISOL", nrAp: "AP 1", tipCom: "GARSONIERA", mpUtili: 33.52, pretFaraTva: 40500, pretCuTva: 48700, avans50: 47700, avans80: 47000, finisaje: "finisaje alb" },
  { etaj: "DEMISOL", nrAp: "AP 2", tipCom: "GARSONIERA", mpUtili: 28.29, pretFaraTva: 34000, pretCuTva: 41500, avans50: 40500, avans80: 40000, finisaje: "finisaj alb" },
  { etaj: "DEMISOL", nrAp: "AP 3", tipCom: "GARSONIERA", mpUtili: 28.29, pretFaraTva: 34000, pretCuTva: 41500, avans50: 40500, avans80: 40000, nume: "rezervat", agent: "mari popa", finisaje: "finisaj alb" },
  { etaj: "DEMISOL", nrAp: "AP 4", tipCom: "GARSONIERA", mpUtili: 31.78, pretFaraTva: 38500, pretCuTva: 46100, avans50: 45500, avans80: 44500 },
  { etaj: "DEMISOL", nrAp: "AP 5", tipCom: "GARSONIERA", mpUtili: 31.78, pretFaraTva: 38500, pretCuTva: 46100, avans50: 45500, avans80: 44500 },
  { etaj: "DEMISOL", nrAp: "AP 6", tipCom: "GARSONIERA", mpUtili: 28.29, pretFaraTva: 34000, pretCuTva: 41500, avans50: 40500, avans80: 40000, nume: "rezervat", contact: "showroom", agent: "eurocasa", finisaje: "finisaj gri" },
  { etaj: "DEMISOL", nrAp: "AP 7", tipCom: "GARSONIERA", mpUtili: 28.29, pretFaraTva: 34000, pretCuTva: 41500, avans50: 40500, avans80: 40000, nume: "rezervat", contact: "showroom", agent: "eurocasa", finisaje: "finisaj alb" },
  { etaj: "DEMISOL", nrAp: "AP 8", tipCom: "GARSONIERA", mpUtili: 31.41, pretFaraTva: 37700, pretCuTva: 45600, avans50: 44800, avans80: 44000, finisaje: "finisaj alb" },
  { etaj: "DEMISOL", nrAp: "AP 9", tipCom: "STUDIO", mpUtili: 38.42, pretFaraTva: 46500, pretCuTva: 55800, avans50: 54800, avans80: 54000, finisaje: "finisaj alb" },
  { etaj: "DEMISOL", nrAp: "AP 10", tipCom: "AP 2 CAMERE", mpUtili: 48.81, pretFaraTva: 58600, pretCuTva: 71000, avans50: 69500, avans80: 68500 },
  { etaj: "DEMISOL", nrAp: "AP 11", tipCom: "GARSONIERA", mpUtili: 25.31 },
  { etaj: "DEMISOL", nrAp: "AP 12", tipCom: "GARSONIERA", mpUtili: 32.09 },
  { etaj: "DEMISOL", nrAp: "AP 13", tipCom: "SP COM", mpUtili: 25.91, pretCuTva: 39000 },
  { etaj: "DEMISOL", nrAp: "AP 14", tipCom: "AP 2 CAMERE", mpUtili: 50.37, pretFaraTva: 61000, pretCuTva: 73500, avans50: 72000, avans80: 70500 },
  { etaj: "DEMISOL", nrAp: "BOXA 4", tipCom: "BOXA", mpUtili: 5.88, pretFaraTva: 6400, nume: "badea ap 34", agent: "eugen" },
  { etaj: "DEMISOL", nrAp: "BOXA 5", tipCom: "BOXA", mpUtili: 6, pretFaraTva: 6500, nume: "ene andreea", agent: "eurocasa" },
  { etaj: "DEMISOL", nrAp: "BOXA 6", tipCom: "BOXA", mpUtili: 6.9, pretFaraTva: 7000, nume: "ap 9 scara 5", agent: "viorel" },
  { etaj: "DEMISOL", nrAp: "BOXA 1", tipCom: "BOXA", mpUtili: 4.78, pretFaraTva: 5200, nume: "dudu robert", agent: "eugen" },
  { etaj: "DEMISOL", nrAp: "BOXA 2", tipCom: "BOXA", mpUtili: 4.95, nume: "cristi gae", agent: "eurocasa" },
  { etaj: "DEMISOL", nrAp: "BOXA 3", tipCom: "BOXA", mpUtili: 8.3, nume: "rezervat", observatii: "COSTI" },

  // PARTER
  { etaj: "PARTER", nrAp: "AP 15", tipCom: "GARSONIERA", mpUtili: 33.38, pretFaraTva: 41000, pretCuTva: 48500, avans50: 47500, avans80: 47000, finisaje: "finisaj gri" },
  { etaj: "PARTER", nrAp: "AP 16", tipCom: "GARSONIERA", mpUtili: 28.29, avans80: 36800, nume: "tina nicoleta", agent: "VIOREL", finisaje: "finisaje albe" },
  { etaj: "PARTER", nrAp: "AP 17", tipCom: "GARSONIERA", mpUtili: 28.29, avans80: 36800, nume: "tina marian", agent: "VIOREL", finisaje: "finisaje albe" },
  { etaj: "PARTER", nrAp: "AP 18", tipCom: "STUDIO", mpUtili: 40.9, pretFaraTva: 53200, avans50: 52200, avans80: 51200, nume: "Leoveanu", agent: "eurocasa", finisaje: "finisaje albe" },
  { etaj: "PARTER", nrAp: "AP 19", tipCom: "STUDIO", mpUtili: 40.92, pretFaraTva: 53200, avans50: 52200, avans80: 51200, nume: "costea razvan", agent: "renato", observatii: "are si loc parcare, finisaj alb" },
  { etaj: "PARTER", nrAp: "AP 20", tipCom: "GARSONIERA", mpUtili: 28.29, pretFaraTva: 34000, pretCuTva: 41500, avans50: 40500, avans80: 40000, nume: "REZERVAT", contact: "SHOWROOM", agent: "eurocasa", finisaje: "finisaj alb" },
  { etaj: "PARTER", nrAp: "AP 21", tipCom: "GARSONIERA", mpUtili: 28.29, pretFaraTva: 34000, pretCuTva: 41500, avans50: 40500, avans80: 40000, nume: "REZERVAT", contact: "SHOWROOM", agent: "EUROCASA", finisaje: "finisaj gri" },
  { etaj: "PARTER", nrAp: "AP 22", tipCom: "GARSONIERA", mpUtili: 31.41, pretFaraTva: 40900, avans50: 40000, avans80: 39500, nume: "Bicher lucia", agent: "eurocasa", observatii: "cumpara parcare, finisaje albe" },
  { etaj: "PARTER", nrAp: "AP 23", tipCom: "STUDIO", mpUtili: 38.42, pretFaraTva: 50000, avans50: 49000, avans80: 48000, nume: "Gae Cristina", agent: "Renato", observatii: "finisaje gri" },
  { etaj: "PARTER", nrAp: "AP 24", tipCom: "STUDIO", mpUtili: 40.84, pretFaraTva: 53100, avans50: 52100, avans80: 51100, nume: "Mitrache dumitru", agent: "eurocasa", observatii: "calorifer bucatarie anulat, port prosop in loc si parchet peste tot, finisaje albe" },
  { etaj: "PARTER", nrAp: "AP 25", tipCom: "STUDIO", mpUtili: 36.09, pretFaraTva: 47000, avans50: 46100, avans80: 45200, nume: "danciu Laurențiu", agent: "RENATO", observatii: "isi aduce singur finisajele" },
  { etaj: "PARTER", nrAp: "AP 26", tipCom: "GARSONIERA", mpUtili: 31.41, pretFaraTva: 40900, avans50: 40000, avans80: 39500, nume: "Busuioc", contact: "0768.513.777", agent: "EUGEN", observatii: "finisaje albe" },
  { etaj: "PARTER", nrAp: "AP 27", tipCom: "AP 3 CAMERE", mpUtili: 70.08, pretFaraTva: 84500, pretCuTva: 102000, avans50: 99500, avans80: 98500, nume: "REZERVAT", agent: "EUROCASA" },
  { etaj: "PARTER", nrAp: "AP 28", tipCom: "AP 2 CAMERE", mpUtili: 50.37, pretFaraTva: 65500, avans50: 64500, avans80: 63000, nume: "dan tencuieli", agent: "EUROCASA" },
  { etaj: "PARTER", nrAp: "AP 29", tipCom: "AP 2 CAMERE", mpUtili: 48.01, pretFaraTva: 58000, pretCuTva: 70000, avans50: 68500, avans80: 67500, agent: "Eurocasa", finisaje: "finisaj alb" },

  // ETAJ 1
  { etaj: "ETAJ 1", nrAp: "AP 30", tipCom: "GARSONIERA", mpUtili: 33.38, pretFaraTva: 43500, avans50: 42500, avans80: 41700, nume: "mihalache adrian", agent: "florin", observatii: "CUMPARA LOC PARCARE, finisaje albe" },
  { etaj: "ETAJ 1", nrAp: "AP 31", tipCom: "GARSONIERA", mpUtili: 28.29, avans80: 39900, nume: "VELEA EUGENIA", agent: "mari popa", finisaje: "finisaje albe" },
  { etaj: "ETAJ 1", nrAp: "AP 32", tipCom: "GARSONIERA", mpUtili: 28.29, pretFaraTva: 36800, avans50: 36100, avans80: 35500, nume: "PROCA IRINA", agent: "EUROCASA", finisaje: "finisaje gri" },
  { etaj: "ETAJ 1", nrAp: "AP 33", tipCom: "STUDIO", mpUtili: 40.9, pretFaraTva: 53200, avans50: 52200, avans80: 51200, nume: "Popescu Bogdan", agent: "Eugen", observatii: "finisaje gri, nu vra faianta la bucatarie, fara bordura de dus si fara sticla la dus" },
  { etaj: "ETAJ 1", nrAp: "AP 34", tipCom: "STUDIO", mpUtili: 40.92, pretFaraTva: 53200, avans50: 52200, avans80: 51200, nume: "Badea Daniel", agent: "eugen", observatii: "cumpara loc parcare" },
  { etaj: "ETAJ 1", nrAp: "AP 35", tipCom: "GARSONIERA", mpUtili: 28.29, pretFaraTva: 36800, avans50: 36100, avans80: 35500, nume: "Giscan Florin", agent: "Eurocasa", finisaje: "finisaje gri" },
  { etaj: "ETAJ 1", nrAp: "AP 36", tipCom: "GARSONIERA", mpUtili: 28.29, pretFaraTva: 36800, avans50: 36100, avans80: 35500, nume: "Dumitrescu Iulian", agent: "Eurocasa", finisaje: "finisaje albe" },
  { etaj: "ETAJ 1", nrAp: "AP 37", tipCom: "GARSONIERA", mpUtili: 31.41, avans50: 40000, avans80: 39500, nume: "ene andreea", agent: "eurocasa" },
  { etaj: "ETAJ 1", nrAp: "AP 38", tipCom: "STUDIO", mpUtili: 38.42, pretFaraTva: 50000, avans50: 49000, avans80: 48000, nume: "Lacatus Veronica", contact: "799727798", agent: "Claudia", finisaje: "finisaje albe" },
  { etaj: "ETAJ 1", nrAp: "AP 39", tipCom: "STUDIO", mpUtili: 40.84, pretFaraTva: 53100, avans50: 52100, avans80: 51100, nume: "harip mihai", agent: "EUROCASA", observatii: "isi face singur finisajele" },
  { etaj: "ETAJ 1", nrAp: "AP 40", tipCom: "STUDIO", mpUtili: 36.09, pretFaraTva: 47000, avans50: 46100, avans80: 45200, nume: "DINU GABI", agent: "eurocasa", finisaje: "finisaje bej" },
  { etaj: "ETAJ 1", nrAp: "AP 41", tipCom: "GARSONIERA", mpUtili: 31.41, pretFaraTva: 40900, avans50: 40000, avans80: 39500, nume: "ROMEO", agent: "eurocasa", observatii: "finisaje albe si usi gri" },
  { etaj: "ETAJ 1", nrAp: "AP 42", tipCom: "AP 3 CAMERE", mpUtili: 70.08, pretFaraTva: 40900, avans50: 89500, avans80: 87600, nume: "Sarbu Diana", agent: "EUROCASA", observatii: "modificari in baie mare cada pe colt, priza living colt, baia mica masina de spalat si priza dubla! calorifer balcon, finisaje albe" },
  { etaj: "ETAJ 1", nrAp: "AP 43", tipCom: "AP 2 CAMERE", mpUtili: 50.37, pretFaraTva: 65500, avans50: 64500, avans80: 63000, nume: "TIRDEA ANGELA", agent: "EUROCASA", observatii: "finisaje albe, cumpara loc parcare" },
  { etaj: "ETAJ 1", nrAp: "AP 44", tipCom: "AP 2 CAMERE", mpUtili: 48.01, pretFaraTva: 62500, avans50: 61500, avans80: 60100, nume: "Coco", agent: "Eurocasa", observatii: "usa de termopan la bucatarie cu balcon, aduce finisajele" },

  // ETAJ 2
  { etaj: "ETAJ 2", nrAp: "AP 45", tipCom: "GARSONIERA", mpUtili: 33.38, pretFaraTva: 41000, pretCuTva: 48500, avans50: 47500, avans80: 47000, nume: "ENE ANDREEA", agent: "EUROCASA" },
  { etaj: "ETAJ 2", nrAp: "AP 46", tipCom: "GARSONIERA", mpUtili: 28.29, avans80: 39900, nume: "IORDAN REBECA", agent: "mari popa", finisaje: "finisaje albe" },
  { etaj: "ETAJ 2", nrAp: "AP 47", tipCom: "GARSONIERA", mpUtili: 28.29, avans80: 39900, nume: "IORDAN FLORIN", agent: "mari popa", finisaje: "finisaje albe" },
  { etaj: "ETAJ 2", nrAp: "AP 48", tipCom: "STUDIO", mpUtili: 40.9, pretFaraTva: 53200, avans50: 52200, avans80: 51200, nume: "darie cristina", agent: "eugen", observatii: "cumpara loc parcare, isi cumpara finisajele" },
  { etaj: "ETAJ 2", nrAp: "AP 49", tipCom: "STUDIO", mpUtili: 40.92, pretFaraTva: 53200, avans50: 52200, avans80: 51200, nume: "barbu stefan", agent: "beny", finisaje: "FINISAJE ALBE", observatii: "." },
  { etaj: "ETAJ 2", nrAp: "AP 50", tipCom: "GARSONIERA", mpUtili: 28.29, pretFaraTva: 36800, avans50: 36100, avans80: 35500, nume: "Draghici marius", agent: "viorel", observatii: "vor sticla și loc parcare, finisaje albe" },
  { etaj: "ETAJ 2", nrAp: "AP 51", tipCom: "GARSONIERA", mpUtili: 28.29, pretFaraTva: 36800, avans50: 36100, avans80: 35500, nume: "iuresi cristina", agent: "viorel", observatii: "VOR STICLA și loc parcare, finisaje albe" },
  { etaj: "ETAJ 2", nrAp: "AP 52", tipCom: "GARSONIERA", mpUtili: 31.41, pretFaraTva: 37700, pretCuTva: 46000, avans50: 45000, avans80: 44000, nume: "anuta marius", agent: "madalina" },
  { etaj: "ETAJ 2", nrAp: "AP 53", tipCom: "STUDIO", mpUtili: 38.42, pretFaraTva: 50000, avans50: 49000, avans80: 48000, nume: "Grecoaica", contact: "729696511", agent: "Eugen", finisaje: "finisaje albe" },
  { etaj: "ETAJ 2", nrAp: "AP 54", tipCom: "STUDIO", mpUtili: 40.84, pretFaraTva: 53100, avans50: 52100, avans80: 51100, nume: "Cirstescu Florin", agent: "EUROCASA", finisaje: "EXECUTAT", observatii: "vrea 3 prize in plus," },
  { etaj: "ETAJ 2", nrAp: "AP 55", tipCom: "STUDIO", mpUtili: 36.09, pretFaraTva: 47000, avans50: 46100, avans80: 45200, nume: "GABI DINU", agent: "EUROCASA", finisaje: "finisaje gri" },
  { etaj: "ETAJ 2", nrAp: "AP 56", tipCom: "GARSONIERA", mpUtili: 31.41, pretFaraTva: 40900, avans50: 40000, avans80: 39500, nume: "Grigorescu Alexandru", agent: "Eurocasa", finisaje: "finisaje albe" },
  { etaj: "ETAJ 2", nrAp: "AP 57", tipCom: "AP 3 CAMERE", mpUtili: 70.08, pretFaraTva: 91500, avans50: 89500, avans80: 87600, nume: "Bogdan Popa", contact: "o731803054", agent: "EUROCASA", finisaje: "EXECUTAT", observatii: "DORESTE MODIF PRIZE SI INSTALATII, si-a adus finisaje" },
  { etaj: "ETAJ 2", nrAp: "AP 58", tipCom: "AP 2 CAMERE", mpUtili: 50.37, pretFaraTva: 65500, avans50: 64500, avans80: 63000, nume: "alex iftime", contact: "767516610", agent: "EUROCASA", finisaje: "EXECUTAT", observatii: "finisaje personale rate 2026, vrea 2 prize in plus, si-a adus finisaje" },
  { etaj: "ETAJ 2", nrAp: "AP 59", tipCom: "AP 2 CAMERE", mpUtili: 48.01, pretFaraTva: 62500, avans50: 61500, avans80: 60100, nume: "budeanu teodora", contact: "0732.470.925", agent: "viorel", observatii: "VREA LOC PARCARE" },

  // ETAJ 3
  { etaj: "ETAJ 3", nrAp: "AP 60", tipCom: "GARSONIERA", mpUtili: 33.38, pretFaraTva: 41000, pretCuTva: 48500, avans50: 47500, avans80: 47000 },
  { etaj: "ETAJ 3", nrAp: "AP 61", tipCom: "GARSONIERA", mpUtili: 28.29, avans80: 36800, nume: "Epureanu Violeta", contact: "799685743", agent: "Renato" },
  { etaj: "ETAJ 3", nrAp: "AP 62", tipCom: "GARSONIERA", mpUtili: 28.29, pretFaraTva: 36800, avans50: 36100, avans80: 35500, nume: "D-na Blaga", agent: "eurocasa", observatii: "cumpara loc parcare, vrea parchet peste tot, finisaje albe" },
  { etaj: "ETAJ 3", nrAp: "AP 63", tipCom: "STUDIO", mpUtili: 40.9, pretFaraTva: 53200, avans50: 52200, avans80: 51200, nume: "NUTI", agent: "EUROCASA", observatii: "finisaje gri dar usi albe" },
  { etaj: "ETAJ 3", nrAp: "AP 64", tipCom: "STUDIO", mpUtili: 40.92, pretFaraTva: 53200, avans50: 52200, avans80: 51200, nume: "Florea Andreea", agent: "Eugen", observatii: "vrea cada si cumpara loc parcare" },
  { etaj: "ETAJ 3", nrAp: "AP 65", tipCom: "GARSONIERA", mpUtili: 28.29, avans80: 36800, nume: "Epureanu Violeta", contact: "799685743", agent: "renato" },
  { etaj: "ETAJ 3", nrAp: "AP 66", tipCom: "GARSONIERA", mpUtili: 28.29, pretFaraTva: 36800, avans50: 36100, avans80: 35500, nume: "Daniel Stirbu", agent: "eurocasa" },
  { etaj: "ETAJ 3", nrAp: "AP 67", tipCom: "GARSONIERA", mpUtili: 31.41, pretFaraTva: 40900, avans50: 40000, avans80: 39500, nume: "rotaru andrei", agent: "renato", finisaje: "finisaje albe" },
  { etaj: "ETAJ 3", nrAp: "AP 68", tipCom: "STUDIO", mpUtili: 38.42, pretFaraTva: 50000, avans50: 49000, avans80: 48000, nume: "corsun andrei", agent: "george", observatii: "vrea loc parcare" },
  { etaj: "ETAJ 3", nrAp: "AP 69", tipCom: "STUDIO", mpUtili: 40.84, pretFaraTva: 53100, avans50: 52100, avans80: 51200, nume: "voinea alexandru", agent: "RENATO" },
  { etaj: "ETAJ 3", nrAp: "AP 70", tipCom: "STUDIO", mpUtili: 36.09, pretFaraTva: 47000, avans50: 46100, avans80: 45200, nume: "voinea alexandru", agent: "RENATO", observatii: "c" },
  { etaj: "ETAJ 3", nrAp: "AP 71", tipCom: "GARSONIERA", mpUtili: 31.41, pretFaraTva: 40900, avans50: 40000, avans80: 39500, nume: "dudu robert", agent: "eugen", observatii: "cumpara loc parcare,barisol negru bucatarie si balcon, isi aduce finisaje" },
  { etaj: "ETAJ 3", nrAp: "AP 72", tipCom: "AP 3 CAMERE", mpUtili: 70.08, pretFaraTva: 91500, avans50: 89500, avans80: 87600, nume: "gae cristi", agent: "EUROCASA", observatii: "cumpăra loc parcare" },
  { etaj: "ETAJ 3", nrAp: "AP 73", tipCom: "AP 2 CAMERE", mpUtili: 50.37, pretFaraTva: 65500, avans50: 64500, avans80: 63000, nume: "d-na Balan", agent: "EUROCASA", observatii: "vrea loc parcare, finisaje gri" },
  { etaj: "ETAJ 3", nrAp: "AP 74", tipCom: "AP 2 CAMERE", mpUtili: 48.01, pretFaraTva: 62500, avans50: 61500, avans80: 60100, nume: "NUTI", agent: "EUROCASA", finisaje: "finisaje albe" },

  // ETAJ 4
  { etaj: "ETAJ 4", nrAp: "AP 75", tipCom: "GARSONIERA", mpUtili: 33.38, pretFaraTva: 41000, pretCuTva: 48500, avans50: 47500, avans80: 47000, nume: "SERBAN MIOARA", agent: "EUGEN", finisaje: "FINISAJE ALBE" },
  { etaj: "ETAJ 4", nrAp: "AP 76", tipCom: "GARSONIERA", mpUtili: 28.29, pretFaraTva: 34000, pretCuTva: 41500, avans50: 40500, avans80: 40000, nume: "rezervat vanjeanu catalin 27 august", agent: "mari popa" },
  { etaj: "ETAJ 4", nrAp: "AP 77", tipCom: "GARSONIERA", mpUtili: 28.29, pretFaraTva: 34000, pretCuTva: 41500, avans50: 40500, avans80: 40000, nume: "rezervat vanjeanu catalin 27 august", agent: "mari popa" },
  { etaj: "ETAJ 4", nrAp: "AP 78", tipCom: "STUDIO", mpUtili: 40.9, pretFaraTva: 53200, avans50: 52200, avans80: 51200, nume: "Nica Marius", agent: "viorel", finisaje: "finisaje albe" },
  { etaj: "ETAJ 4", nrAp: "AP 79", tipCom: "STUDIO", mpUtili: 40.92, pretFaraTva: 53200, avans50: 52200, avans80: 51200, nume: "dudu robert", agent: "eugen", observatii: "cumpara loc parcare si boxa, barisol negru hol, living si bucatarie, isi aduce finisaje" },
  { etaj: "ETAJ 4", nrAp: "AP 80", tipCom: "GARSONIERA", mpUtili: 28.29, pretFaraTva: 34000, pretCuTva: 41500, avans50: 40500, avans80: 40000, nume: "rezervat", agent: "eurocasa" },
  { etaj: "ETAJ 4", nrAp: "AP 81", tipCom: "GARSONIERA", mpUtili: 28.29, pretFaraTva: 34000, pretCuTva: 41500, avans50: 40500, avans80: 40000, nume: "Rezervat", agent: "eurocasa" },
  { etaj: "ETAJ 4", nrAp: "AP 82", tipCom: "GARSONIERA", mpUtili: 31.41, pretFaraTva: 40900, avans50: 40000, avans80: 39500, nume: "gheorghe alina", agent: "mari popa" },
  { etaj: "ETAJ 4", nrAp: "AP 83", tipCom: "STUDIO", mpUtili: 38.42, pretFaraTva: 50000, avans50: 49000, avans80: 48000, nume: "RAZVAN il petre", agent: "EUROCASA" },
  { etaj: "ETAJ 4", nrAp: "AP 84", tipCom: "STUDIO", mpUtili: 40.84, pretFaraTva: 53100, avans50: 52100, avans80: 51100, nume: "Razvan tbi", agent: "Eurocasa" },
  { etaj: "ETAJ 4", nrAp: "AP 85", tipCom: "STUDIO", mpUtili: 36.09, pretFaraTva: 43500, pretCuTva: 52500, avans50: 51500, avans80: 50500, nume: "REZERVAT", agent: "VIOREL" },
  { etaj: "ETAJ 4", nrAp: "AP 86", tipCom: "GARSONIERA", mpUtili: 31.41, pretFaraTva: 40900, avans50: 40000, avans80: 39500, nume: "carstescu florin", agent: "eurocasa", observatii: "MODIF ZIDARIE MAX 1 IUNIE 2025" },
  { etaj: "ETAJ 4", nrAp: "AP 87", tipCom: "AP 3 CAMERE", mpUtili: 70.08, pretFaraTva: 91500, avans50: 89500, avans80: 87600, nume: "maruseac cristina", agent: "viorel" },
  { etaj: "ETAJ 4", nrAp: "AP 88", tipCom: "AP 2 CAMERE", mpUtili: 50.37, pretFaraTva: 65500, avans50: 64500, avans80: 63000, nume: "nica gigel", agent: "viorel", finisaje: "finisaje albe" },
  { etaj: "ETAJ 4", nrAp: "AP 89", tipCom: "AP 2 CAMERE", mpUtili: 48.01, pretFaraTva: 62500, avans50: 61500, avans80: 60100, nume: "SARCANI GEORGIAN", agent: "viorel", observatii: "cumpara parcare" },

  // ETAJ 5
  { etaj: "ETAJ 5", nrAp: "AP 90", tipCom: "GARSONIERA", mpUtili: 33.38, pretFaraTva: 41000, pretCuTva: 48500, avans50: 47500, avans80: 47000 },
  { etaj: "ETAJ 5", nrAp: "AP 91", tipCom: "GARSONIERA", mpUtili: 28.29, avans80: 36800, nume: "Mihaila maria", agent: "Florin", finisaje: "finisaje albe" },
  { etaj: "ETAJ 5", nrAp: "AP 92", tipCom: "GARSONIERA", mpUtili: 28.29, avans80: 39900, nume: "MATASA CARMEN", contact: "723889266", agent: "Viorel" },
  { etaj: "ETAJ 5", nrAp: "AP 93", tipCom: "STUDIO", mpUtili: 40.9, pretFaraTva: 53200, avans50: 52200, avans80: 51200, nume: "ionut tudor", agent: "eurocasa" },
  { etaj: "ETAJ 5", nrAp: "AP 94", tipCom: "STUDIO", mpUtili: 40.92, pretFaraTva: 53200, avans50: 52200, avans80: 51200, nume: "ionut tudor", agent: "eurocasa" },
  { etaj: "ETAJ 5", nrAp: "AP 95", tipCom: "GARSONIERA", mpUtili: 28.29, pretFaraTva: 34000, pretCuTva: 41500, avans50: 40500, avans80: 40000, nume: "maryus gym", agent: "eurocasa" },
  { etaj: "ETAJ 5", nrAp: "AP 96", tipCom: "GARSONIERA", mpUtili: 28.29, avans80: 36800, nume: "dima maria", agent: "renato", finisaje: "finisaje albe" },
  { etaj: "ETAJ 5", nrAp: "AP 97", tipCom: "GARSONIERA", mpUtili: 31.41, pretFaraTva: 40900, avans50: 40000, avans80: 39500, nume: "dima maria", agent: "renato", finisaje: "finisaje albe" },
  { etaj: "ETAJ 5", nrAp: "AP 98", tipCom: "STUDIO", mpUtili: 38.42, pretFaraTva: 50000, avans50: 49000, avans80: 48000, nume: "vincix futuro", agent: "renato" },
  { etaj: "ETAJ 5", nrAp: "AP 99", tipCom: "STUDIO", mpUtili: 40.84, pretFaraTva: 53100, avans50: 52100, avans80: 51100, nume: "CIRSTESCU FLORIN", agent: "EUROCASA" },
  { etaj: "ETAJ 5", nrAp: "AP 100", tipCom: "STUDIO", mpUtili: 36.09, pretFaraTva: 47000, avans50: 46100, avans80: 45200, nume: "Scorus rares", agent: "Andreea" },
  { etaj: "ETAJ 5", nrAp: "AP 101", tipCom: "GARSONIERA", mpUtili: 31.41, pretFaraTva: 40900, avans50: 40000, avans80: 39500, nume: "dima maria", agent: "renato", finisaje: "finisaje albe" },
  { etaj: "ETAJ 5", nrAp: "AP 102", tipCom: "AP 3 CAMERE", mpUtili: 70.08, pretFaraTva: 84500, pretCuTva: 102000, avans50: 99500, avans80: 98500 },
  { etaj: "ETAJ 5", nrAp: "AP 103", tipCom: "AP 2 CAMERE", mpUtili: 50.37, pretFaraTva: 65500, avans50: 64500, avans80: 63000, nume: "mavru marius", contact: "762317865", agent: "viorel", observatii: "izolatie balcon 5cm???" },
  { etaj: "ETAJ 5", nrAp: "AP 104", tipCom: "AP 2 CAMERE", mpUtili: 48.01, pretFaraTva: 58000, pretCuTva: 70000, avans50: 68500, avans80: 67500 },

  // ETAJ 6
  { etaj: "ETAJ 6", nrAp: "AP 105", tipCom: "GARSONIERA", mpUtili: 33.38, pretFaraTva: 41000, pretCuTva: 48500, avans50: 47500, avans80: 47000 },
  { etaj: "ETAJ 6", nrAp: "AP 106", tipCom: "GARSONIERA", mpUtili: 28.29, pretFaraTva: 34000, pretCuTva: 41500, avans50: 40500, avans80: 40000 },
  { etaj: "ETAJ 6", nrAp: "AP 107", tipCom: "GARSONIERA", mpUtili: 28.29, pretFaraTva: 34000, pretCuTva: 41500, avans50: 40500, avans80: 40000 },
  { etaj: "ETAJ 6", nrAp: "AP 108", tipCom: "STUDIO", mpUtili: 40.9, pretFaraTva: 49500, pretCuTva: 59500, avans50: 58500, avans80: 57500, nume: "Francesca", agent: "eurocasa" },
  { etaj: "ETAJ 6", nrAp: "AP 109", tipCom: "STUDIO", mpUtili: 40.92, pretFaraTva: 49500, pretCuTva: 59500, avans50: 58500, avans80: 57500, nume: "diaconescu cristina", agent: "EUROCASA", observatii: "gresie hol, bucatarie si faianta bucatarie alba, parchet si usi albe, faianta si gresie baie isi aduce clienta, si obiecte sanitare isi aduce" },
  { etaj: "ETAJ 6", nrAp: "AP 110", tipCom: "GARSONIERA", mpUtili: 28.29, pretFaraTva: 34000, pretCuTva: 41500, avans50: 40500, avans80: 40000 },
  { etaj: "ETAJ 6", nrAp: "AP 111", tipCom: "GARSONIERA", mpUtili: 28.29, pretFaraTva: 34000, pretCuTva: 41500, avans50: 40500, avans80: 40000 },
  { etaj: "ETAJ 6", nrAp: "AP 112", tipCom: "GARSONIERA", mpUtili: 31.41, pretFaraTva: 40900, avans50: 40000, avans80: 39500, nume: "daian lucia", agent: "andreea" },
  { etaj: "ETAJ 6", nrAp: "AP 113", tipCom: "STUDIO", mpUtili: 38.42, pretFaraTva: 46500, pretCuTva: 56000, avans50: 55000, avans80: 54000 },
  { etaj: "ETAJ 6", nrAp: "AP 114", tipCom: "STUDIO", mpUtili: 40.9, pretFaraTva: 49500, pretCuTva: 59500, avans50: 58500, avans80: 57500 },
  { etaj: "ETAJ 6", nrAp: "AP 115", tipCom: "STUDIO", mpUtili: 36.09, pretFaraTva: 43500, pretCuTva: 52500, avans50: 51500, avans80: 50500 },
  { etaj: "ETAJ 6", nrAp: "AP 116", tipCom: "GARSONIERA", mpUtili: 31.41, pretFaraTva: 37700, pretCuTva: 46000, avans50: 45000, avans80: 44000 },
  { etaj: "ETAJ 6", nrAp: "AP 117", tipCom: "AP 3 CAMERE", mpUtili: 70.08, pretFaraTva: 84500, pretCuTva: 102000, avans50: 99500, avans80: 98500 },
  { etaj: "ETAJ 6", nrAp: "AP 118", tipCom: "AP 2 CAMERE", mpUtili: 50.37, pretFaraTva: 60500, pretCuTva: 73500, avans50: 72000, avans80: 71000 },
  { etaj: "ETAJ 6", nrAp: "AP 119", tipCom: "AP 2 CAMERE", mpUtili: 48.01, pretFaraTva: 58000, pretCuTva: 70000, avans50: 68500, avans80: 67500 },
];

export const importComplex1Data = async () => {
  try {
    console.log('Starting Complex 1 data import...');

    // Delete all existing properties for complex-1 except parking spaces (already deleted)
    const { error: deleteError } = await supabase
      .from('properties')
      .delete()
      .eq('complex_id', 'complex-1');

    if (deleteError) throw deleteError;
    console.log('Deleted existing properties');

    // Transform and insert new properties
    const propertiesData = complex1Properties.map(property => {
      const status = determineStatus(property.nume);
      
      return {
        complex_id: 'complex-1',
        data: {
          etaj: property.etaj,
          nrAp: property.nrAp,
          tipCom: property.tipCom,
          mpUtili: parseNumber(property.mpUtili),
          pretFaraTva: parseNumber(property.pretFaraTva),
          pretCuTva: parseNumber(property.pretCuTva),
          avans50: parseNumber(property.avans50),
          avans80: parseNumber(property.avans80),
          nume: property.nume || '',
          contact: property.contact || '',
          agent: property.agent || '',
          finisaje: property.finisaje || '',
          observatii: property.observatii || '',
          status: status,
        }
      };
    });

    const { error: insertError } = await supabase
      .from('properties')
      .insert(propertiesData);

    if (insertError) throw insertError;

    // Update complex stats (excluding parking)
    const total = complex1Properties.length;
    const available = complex1Properties.filter(p => determineStatus(p.nume) === 'disponibil').length;

    const { error: updateError } = await supabase
      .from('complexes')
      .update({
        total_properties: total,
        available_properties: available
      })
      .eq('id', 'complex-1');

    if (updateError) throw updateError;

    console.log(`Import completed: ${total} properties, ${available} available`);
    
    return {
      success: true,
      count: total,
      available: available
    };
  } catch (error) {
    console.error('Error importing Complex 1 data:', error);
    throw error;
  }
};
