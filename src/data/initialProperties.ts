import { Property } from "@/types/property";

const parsePrice = (price: string | number): number => {
  if (typeof price === 'number') return price;
  if (!price) return 0;
  return parseFloat(price.toString().replace(/,/g, '')) || 0;
};

const determineStatus = (nume: string, observatii: string): "disponibil" | "rezervat" | "vandut" => {
  const numeText = (nume || "").toLowerCase();
  const obsText = (observatii || "").toLowerCase();
  
  if (numeText.includes("rezervat") || obsText.includes("rezervat")) {
    return "rezervat";
  }
  if (nume && nume.trim() && !numeText.includes("rezervat")) {
    return "vandut";
  }
  return "disponibil";
};

export const initialProperties: Property[] = [
  // DEMISOL
  { id: "1", etaj: "DEMISOL", nrAp: "AP 1", tipCom: "GARSONIERA", mpUtili: 33.52, pretCuTva: 48700, avans50: 47700, avans80: 47000, nume: "", contact: "", agent: "", finisaje: "finisaje alb", observatii: "", status: "disponibil" },
  { id: "2", etaj: "DEMISOL", nrAp: "AP 2", tipCom: "GARSONIERA", mpUtili: 28.29, pretCuTva: 41500, avans50: 40500, avans80: 40000, nume: "", contact: "", agent: "", finisaje: "finisaj alb", observatii: "", status: "disponibil" },
  { id: "3", etaj: "DEMISOL", nrAp: "AP 3", tipCom: "GARSONIERA", mpUtili: 28.29, pretCuTva: 41500, avans50: 40500, avans80: 40000, nume: "rezervat", contact: "", agent: "mari popa", finisaje: "finisaj alb", observatii: "", status: "rezervat" },
  { id: "4", etaj: "DEMISOL", nrAp: "AP 4", tipCom: "GARSONIERA", mpUtili: 31.78, pretCuTva: 46100, avans50: 45500, avans80: 44500, nume: "", contact: "", agent: "", finisaje: "", observatii: "", status: "disponibil" },
  { id: "5", etaj: "DEMISOL", nrAp: "AP 5", tipCom: "GARSONIERA", mpUtili: 31.78, pretCuTva: 46100, avans50: 45500, avans80: 44500, nume: "", contact: "", agent: "", finisaje: "", observatii: "", status: "disponibil" },
  { id: "6", etaj: "DEMISOL", nrAp: "AP 6", tipCom: "GARSONIERA", mpUtili: 28.29, pretCuTva: 41500, avans50: 40500, avans80: 40000, nume: "rezervat", contact: "", agent: "eurocasa", finisaje: "finisaj gri", observatii: "showroom", status: "rezervat" },
  { id: "7", etaj: "DEMISOL", nrAp: "AP 7", tipCom: "GARSONIERA", mpUtili: 28.29, pretCuTva: 41500, avans50: 40500, avans80: 40000, nume: "rezervat", contact: "", agent: "eurocasa", finisaje: "finisaj alb", observatii: "showroom", status: "rezervat" },
  { id: "8", etaj: "DEMISOL", nrAp: "AP 8", tipCom: "GARSONIERA", mpUtili: 31.41, pretCuTva: 45600, avans50: 44800, avans80: 44000, nume: "", contact: "", agent: "", finisaje: "finisaj alb", observatii: "", status: "disponibil" },
  { id: "9", etaj: "DEMISOL", nrAp: "AP 9", tipCom: "STUDIO", mpUtili: 38.42, pretCuTva: 55800, avans50: 54800, avans80: 54000, nume: "", contact: "", agent: "", finisaje: "finisaj alb", observatii: "", status: "disponibil" },
  { id: "10", etaj: "DEMISOL", nrAp: "AP 10", tipCom: "AP 2 CAMERE", mpUtili: 48.81, pretCuTva: 71000, avans50: 69500, avans80: 68500, nume: "", contact: "", agent: "", finisaje: "", observatii: "", status: "disponibil" },
  { id: "11", etaj: "DEMISOL", nrAp: "AP 11", tipCom: "GARSONIERA", mpUtili: 25.31, pretCuTva: 0, avans50: 0, avans80: 0, nume: "", contact: "", agent: "", finisaje: "", observatii: "", status: "disponibil" },
  { id: "12", etaj: "DEMISOL", nrAp: "AP 12", tipCom: "GARSONIERA", mpUtili: 32.09, pretCuTva: 0, avans50: 0, avans80: 0, nume: "", contact: "", agent: "", finisaje: "", observatii: "", status: "disponibil" },
  { id: "13", etaj: "DEMISOL", nrAp: "AP 13", tipCom: "SP COM", mpUtili: 25.91, pretCuTva: 39000, avans50: 0, avans80: 0, nume: "", contact: "", agent: "", finisaje: "", observatii: "", status: "disponibil" },
  { id: "14", etaj: "DEMISOL", nrAp: "AP 14", tipCom: "AP 2 CAMERE", mpUtili: 50.37, pretCuTva: 73500, avans50: 72000, avans80: 70500, nume: "", contact: "", agent: "", finisaje: "", observatii: "", status: "disponibil" },
  
  // PARTER
  { id: "21", etaj: "PARTER", nrAp: "AP 15", tipCom: "GARSONIERA", mpUtili: 33.38, pretCuTva: 48500, avans50: 47500, avans80: 47000, nume: "", contact: "", agent: "", finisaje: "finisaj gri", observatii: "", status: "disponibil" },
  { id: "22", etaj: "PARTER", nrAp: "AP 16", tipCom: "GARSONIERA", mpUtili: 28.29, pretCuTva: 0, avans50: 0, avans80: 36800, nume: "tina nicoleta", contact: "", agent: "VIOREL", finisaje: "finisaje albe", observatii: "", status: "vandut" },
  { id: "23", etaj: "PARTER", nrAp: "AP 17", tipCom: "GARSONIERA", mpUtili: 28.29, pretCuTva: 0, avans50: 0, avans80: 36800, nume: "tina marian", contact: "", agent: "VIOREL", finisaje: "finisaje albe", observatii: "", status: "vandut" },
  { id: "24", etaj: "PARTER", nrAp: "AP 18", tipCom: "STUDIO", mpUtili: 40.9, pretCuTva: 0, avans50: 52200, avans80: 51200, nume: "Leoveanu", contact: "", agent: "eurocasa", finisaje: "finisaje albe", observatii: "", status: "vandut" },
  { id: "25", etaj: "PARTER", nrAp: "AP 19", tipCom: "STUDIO", mpUtili: 40.92, pretCuTva: 0, avans50: 52200, avans80: 51200, nume: "costea razvan", contact: "", agent: "renato", finisaje: "", observatii: "are si loc parcare, finisaj alb", status: "vandut" },
  { id: "26", etaj: "PARTER", nrAp: "AP 20", tipCom: "GARSONIERA", mpUtili: 28.29, pretCuTva: 41500, avans50: 40500, avans80: 40000, nume: "REZERVAT", contact: "", agent: "eurocasa", finisaje: "finisaj alb", observatii: "SHOWROOM", status: "rezervat" },
  { id: "27", etaj: "PARTER", nrAp: "AP 21", tipCom: "GARSONIERA", mpUtili: 28.29, pretCuTva: 41500, avans50: 40500, avans80: 40000, nume: "REZERVAT", contact: "", agent: "EUROCASA", finisaje: "finisaj gri", observatii: "SHOWROOM", status: "rezervat" },
  { id: "28", etaj: "PARTER", nrAp: "AP 22", tipCom: "GARSONIERA", mpUtili: 31.41, pretCuTva: 0, avans50: 40000, avans80: 39500, nume: "Bicher lucia", contact: "", agent: "eurocasa", finisaje: "", observatii: "cumpara parcare, finisaje albe", status: "vandut" },
  { id: "29", etaj: "PARTER", nrAp: "AP 23", tipCom: "STUDIO", mpUtili: 38.42, pretCuTva: 0, avans50: 49000, avans80: 48000, nume: "Gae Cristina", contact: "", agent: "Renato", finisaje: "", observatii: "finisaje gri", status: "vandut" },
  { id: "30", etaj: "PARTER", nrAp: "AP 24", tipCom: "STUDIO", mpUtili: 40.84, pretCuTva: 0, avans50: 52100, avans80: 51100, nume: "Mitrache dumitru", contact: "", agent: "eurocasa", finisaje: "", observatii: "calorifer bucatarie anulat, port prosop in loc si parchet peste tot, finisaje albe", status: "vandut" },
  { id: "31", etaj: "PARTER", nrAp: "AP 25", tipCom: "STUDIO", mpUtili: 36.09, pretCuTva: 0, avans50: 46100, avans80: 45200, nume: "danciu Laurențiu", contact: "", agent: "RENATO", finisaje: "", observatii: "isi aduce singur finisajele", status: "vandut" },
  { id: "32", etaj: "PARTER", nrAp: "AP 26", tipCom: "GARSONIERA", mpUtili: 31.41, pretCuTva: 0, avans50: 40000, avans80: 39500, nume: "Busuioc", contact: "0768.513.777", agent: "EUGEN", finisaje: "", observatii: "finisaje albe", status: "vandut" },
  { id: "33", etaj: "PARTER", nrAp: "AP 27", tipCom: "AP 3 CAMERE", mpUtili: 70.08, pretCuTva: 102000, avans50: 99500, avans80: 98500, nume: "REZERVAT", contact: "", agent: "EUROCASA", finisaje: "", observatii: "", status: "rezervat" },
  { id: "34", etaj: "PARTER", nrAp: "AP 28", tipCom: "AP 2 CAMERE", mpUtili: 50.37, pretCuTva: 0, avans50: 64500, avans80: 63000, nume: "dan tencuieli", contact: "", agent: "EUROCASA", finisaje: "", observatii: "", status: "vandut" },
  { id: "35", etaj: "PARTER", nrAp: "AP 29", tipCom: "AP 2 CAMERE", mpUtili: 48.01, pretCuTva: 70000, avans50: 68500, avans80: 67500, nume: "", contact: "", agent: "Eurocasa", finisaje: "", observatii: "finisaj alb", status: "disponibil" },
  
  // ETAJ 1
  { id: "36", etaj: "ETAJ 1", nrAp: "AP 30", tipCom: "GARSONIERA", mpUtili: 33.38, pretCuTva: 0, avans50: 42500, avans80: 41700, nume: "mihalache adrian", contact: "", agent: "florin", finisaje: "", observatii: "CUMPARA LOC PARCARE, finisaje albe", status: "vandut" },
  { id: "37", etaj: "ETAJ 1", nrAp: "AP 31", tipCom: "GARSONIERA", mpUtili: 28.29, pretCuTva: 0, avans50: 0, avans80: 39900, nume: "VELEA EUGENIA", contact: "", agent: "mari popa", finisaje: "", observatii: "finisaje albe", status: "vandut" },
  { id: "38", etaj: "ETAJ 1", nrAp: "AP 32", tipCom: "GARSONIERA", mpUtili: 28.29, pretCuTva: 0, avans50: 36100, avans80: 35500, nume: "PROCA IRINA", contact: "", agent: "EUROCASA", finisaje: "", observatii: "finisaje gri", status: "vandut" },
  { id: "39", etaj: "ETAJ 1", nrAp: "AP 33", tipCom: "STUDIO", mpUtili: 40.9, pretCuTva: 0, avans50: 52200, avans80: 51200, nume: "Popescu Bogdan", contact: "", agent: "Eugen", finisaje: "", observatii: "finisaje gri, nu vra faianta la bucatarie, fara bordura de dus si fara sticla la dus", status: "vandut" },
  { id: "40", etaj: "ETAJ 1", nrAp: "AP 34", tipCom: "STUDIO", mpUtili: 40.92, pretCuTva: 0, avans50: 52200, avans80: 51200, nume: "Badea Daniel", contact: "", agent: "eugen", finisaje: "", observatii: "cumpara loc parcare", status: "vandut" },
  { id: "41", etaj: "ETAJ 1", nrAp: "AP 35", tipCom: "GARSONIERA", mpUtili: 28.29, pretCuTva: 0, avans50: 36100, avans80: 35500, nume: "Giscan Florin", contact: "", agent: "Eurocasa", finisaje: "", observatii: "finisaje gri", status: "vandut" },
  { id: "42", etaj: "ETAJ 1", nrAp: "AP 36", tipCom: "GARSONIERA", mpUtili: 28.29, pretCuTva: 0, avans50: 36100, avans80: 35500, nume: "Dumitrescu Iulian", contact: "", agent: "Eurocasa", finisaje: "", observatii: "finisaje albe", status: "vandut" },
  { id: "43", etaj: "ETAJ 1", nrAp: "AP 37", tipCom: "GARSONIERA", mpUtili: 31.41, pretCuTva: 0, avans50: 40000, avans80: 39500, nume: "ene andreea", contact: "", agent: "eurocasa", finisaje: "", observatii: "", status: "vandut" },
  { id: "44", etaj: "ETAJ 1", nrAp: "AP 38", tipCom: "STUDIO", mpUtili: 38.42, pretCuTva: 0, avans50: 49000, avans80: 48000, nume: "Lacatus Veronica", contact: "799727798", agent: "Claudia", finisaje: "", observatii: "finisaje albe", status: "vandut" },
  { id: "45", etaj: "ETAJ 1", nrAp: "AP 39", tipCom: "STUDIO", mpUtili: 40.84, pretCuTva: 0, avans50: 52100, avans80: 51100, nume: "harip mihai", contact: "", agent: "EUROCASA", finisaje: "", observatii: "isi face singur finisajele", status: "vandut" },
  { id: "46", etaj: "ETAJ 1", nrAp: "AP 40", tipCom: "STUDIO", mpUtili: 36.09, pretCuTva: 0, avans50: 46100, avans80: 45200, nume: "DINU GABI", contact: "", agent: "eurocasa", finisaje: "", observatii: "finisaje bej", status: "vandut" },
  { id: "47", etaj: "ETAJ 1", nrAp: "AP 41", tipCom: "GARSONIERA", mpUtili: 31.41, pretCuTva: 0, avans50: 40000, avans80: 39500, nume: "ROMEO", contact: "", agent: "eurocasa", finisaje: "", observatii: "finisaje albe si usi gri", status: "vandut" },
  { id: "48", etaj: "ETAJ 1", nrAp: "AP 42", tipCom: "AP 3 CAMERE", mpUtili: 70.08, pretCuTva: 0, avans50: 89500, avans80: 87600, nume: "Sarbu Diana", contact: "", agent: "EUROCASA", finisaje: "", observatii: "modificari in baie mare cada pe colt, priza living colt, baia mica masina de spalat si priza dubla! calorifer balcon, finisaje albe", status: "vandut" },
  { id: "49", etaj: "ETAJ 1", nrAp: "AP 43", tipCom: "AP 2 CAMERE", mpUtili: 50.37, pretCuTva: 0, avans50: 64500, avans80: 63000, nume: "TIRDEA ANGELA", contact: "", agent: "EUROCASA", finisaje: "", observatii: "finisaje albe, cumpara loc parcare", status: "vandut" },
  { id: "50", etaj: "ETAJ 1", nrAp: "AP 44", tipCom: "AP 2 CAMERE", mpUtili: 48.01, pretCuTva: 0, avans50: 61500, avans80: 60100, nume: "Coco", contact: "", agent: "Eurocasa", finisaje: "", observatii: "usa de termopan la bucatarie cu balcon, aduce finisajele", status: "vandut" },
  
  // ETAJ 2
  { id: "51", etaj: "ETAJ 2", nrAp: "AP 45", tipCom: "GARSONIERA", mpUtili: 33.38, pretCuTva: 48500, avans50: 47500, avans80: 47000, nume: "ENE ANDREEA", contact: "", agent: "EUROCASA", finisaje: "", observatii: "", status: "vandut" },
  { id: "52", etaj: "ETAJ 2", nrAp: "AP 46", tipCom: "GARSONIERA", mpUtili: 28.29, pretCuTva: 0, avans50: 0, avans80: 39900, nume: "IORDAN REBECA", contact: "", agent: "mari popa", finisaje: "", observatii: "finisaje albe", status: "vandut" },
  { id: "53", etaj: "ETAJ 2", nrAp: "AP 47", tipCom: "GARSONIERA", mpUtili: 28.29, pretCuTva: 0, avans50: 0, avans80: 39900, nume: "IORDAN FLORIN", contact: "", agent: "mari popa", finisaje: "", observatii: "finisaje albe", status: "vandut" },
  { id: "54", etaj: "ETAJ 2", nrAp: "AP 48", tipCom: "STUDIO", mpUtili: 40.9, pretCuTva: 0, avans50: 52200, avans80: 51200, nume: "darie cristina", contact: "", agent: "eugen", finisaje: "", observatii: "cumpara loc parcare, isi cumpara finisajele", status: "vandut" },
  { id: "55", etaj: "ETAJ 2", nrAp: "AP 49", tipCom: "STUDIO", mpUtili: 40.92, pretCuTva: 0, avans50: 52200, avans80: 51200, nume: "barbu stefan", contact: "", agent: "beny", finisaje: "FINISAJE ALBE", observatii: ".", status: "vandut" },
  { id: "56", etaj: "ETAJ 2", nrAp: "AP 50", tipCom: "GARSONIERA", mpUtili: 28.29, pretCuTva: 0, avans50: 36100, avans80: 35500, nume: "Draghici marius", contact: "", agent: "viorel", finisaje: "", observatii: "vor sticla și loc parcare, finisaje albe", status: "vandut" },
  { id: "57", etaj: "ETAJ 2", nrAp: "AP 51", tipCom: "GARSONIERA", mpUtili: 28.29, pretCuTva: 0, avans50: 36100, avans80: 35500, nume: "iuresi cristina", contact: "", agent: "viorel", finisaje: "", observatii: "VOR STICLA și loc parcare, finisaje albe", status: "vandut" },
  { id: "58", etaj: "ETAJ 2", nrAp: "AP 52", tipCom: "GARSONIERA", mpUtili: 31.41, pretCuTva: 46000, avans50: 45000, avans80: 44000, nume: "anuta marius", contact: "", agent: "madalina", finisaje: "", observatii: "", status: "vandut" },
  { id: "59", etaj: "ETAJ 2", nrAp: "AP 53", tipCom: "STUDIO", mpUtili: 38.42, pretCuTva: 0, avans50: 49000, avans80: 48000, nume: "Grecoaica", contact: "729696511", agent: "Eugen", finisaje: "", observatii: "finisaje albe", status: "vandut" },
  { id: "60", etaj: "ETAJ 2", nrAp: "AP 54", tipCom: "STUDIO", mpUtili: 40.84, pretCuTva: 0, avans50: 52100, avans80: 51100, nume: "Cirstescu Florin", contact: "", agent: "EUROCASA", finisaje: "EXECUTAT", observatii: "vrea 3 prize in plus,", status: "vandut" },
  { id: "61", etaj: "ETAJ 2", nrAp: "AP 55", tipCom: "STUDIO", mpUtili: 36.09, pretCuTva: 0, avans50: 46100, avans80: 45200, nume: "GABI DINU", contact: "", agent: "EUROCASA", finisaje: "", observatii: "finisaje gri", status: "vandut" },
  { id: "62", etaj: "ETAJ 2", nrAp: "AP 56", tipCom: "GARSONIERA", mpUtili: 31.41, pretCuTva: 0, avans50: 40000, avans80: 39500, nume: "Grigorescu Alexandru", contact: "", agent: "Eurocasa", finisaje: "", observatii: "finisaje albe", status: "vandut" },
  { id: "63", etaj: "ETAJ 2", nrAp: "AP 57", tipCom: "AP 3 CAMERE", mpUtili: 70.08, pretCuTva: 0, avans50: 89500, avans80: 87600, nume: "Bogdan Popa", contact: "o731803054", agent: "EUROCASA", finisaje: "EXECUTAT", observatii: "DORESTE MODIF PRIZE SI INSTALATII, si-a adus finisaje", status: "vandut" },
  { id: "64", etaj: "ETAJ 2", nrAp: "AP 58", tipCom: "AP 2 CAMERE", mpUtili: 50.37, pretCuTva: 0, avans50: 64500, avans80: 63000, nume: "alex iftime", contact: "767516610", agent: "EUROCASA", finisaje: "EXECUTAT", observatii: "finisaje personale rate 2026, vrea 2 prize in plus, si-a adus finisaje", status: "vandut" },
  { id: "65", etaj: "ETAJ 2", nrAp: "AP 59", tipCom: "AP 2 CAMERE", mpUtili: 48.01, pretCuTva: 0, avans50: 61500, avans80: 60100, nume: "budeanu teodora", contact: "0732.470.925", agent: "viorel", finisaje: "", observatii: "VREA LOC PARCARE", status: "vandut" },
  
  // ETAJ 3
  { id: "66", etaj: "ETAJ 3", nrAp: "AP 60", tipCom: "GARSONIERA", mpUtili: 33.38, pretCuTva: 48500, avans50: 47500, avans80: 47000, nume: "", contact: "", agent: "", finisaje: "", observatii: "", status: "disponibil" },
  { id: "67", etaj: "ETAJ 3", nrAp: "AP 61", tipCom: "GARSONIERA", mpUtili: 28.29, pretCuTva: 0, avans50: 0, avans80: 36800, nume: "Epureanu Violeta", contact: "799685743", agent: "Renato", finisaje: "", observatii: "", status: "vandut" },
  { id: "68", etaj: "ETAJ 3", nrAp: "AP 62", tipCom: "GARSONIERA", mpUtili: 28.29, pretCuTva: 0, avans50: 36100, avans80: 35500, nume: "D-na Blaga", contact: "", agent: "eurocasa", finisaje: "", observatii: "cumpara loc parcare, vrea parchet peste tot, finisaje albe", status: "vandut" },
  { id: "69", etaj: "ETAJ 3", nrAp: "AP 63", tipCom: "STUDIO", mpUtili: 40.9, pretCuTva: 0, avans50: 52200, avans80: 51200, nume: "NUTI", contact: "", agent: "EUROCASA", finisaje: "", observatii: "finisaje gri dar usi albe", status: "vandut" },
  { id: "70", etaj: "ETAJ 3", nrAp: "AP 64", tipCom: "STUDIO", mpUtili: 40.92, pretCuTva: 0, avans50: 52200, avans80: 51200, nume: "Florea Andreea", contact: "", agent: "Eugen", finisaje: "", observatii: "vrea cada si cumpara loc parcare", status: "vandut" },
  { id: "71", etaj: "ETAJ 3", nrAp: "AP 65", tipCom: "GARSONIERA", mpUtili: 28.29, pretCuTva: 0, avans50: 36100, avans80: 35500, nume: "Costea", contact: "", agent: "eurocasa", finisaje: "", observatii: "finisaje gri", status: "vandut" },
  { id: "72", etaj: "ETAJ 3", nrAp: "AP 66", tipCom: "GARSONIERA", mpUtili: 28.29, pretCuTva: 0, avans50: 36100, avans80: 35500, nume: "lupu andreea", contact: "", agent: "eurocasa", finisaje: "", observatii: "finisaje albe", status: "vandut" },
  { id: "73", etaj: "ETAJ 3", nrAp: "AP 67", tipCom: "GARSONIERA", mpUtili: 31.41, pretCuTva: 0, avans50: 40000, avans80: 39500, nume: "Barbulescu Catalin", contact: "", agent: "Eurocasa", finisaje: "", observatii: "cumpara loc parcare, finisaje albe", status: "vandut" },
  { id: "74", etaj: "ETAJ 3", nrAp: "AP 68", tipCom: "STUDIO", mpUtili: 38.42, pretCuTva: 0, avans50: 49000, avans80: 48000, nume: "Tirita Dorel Claudiu", contact: "", agent: "eurocasa", finisaje: "", observatii: "finisaje albe", status: "vandut" },
  { id: "75", etaj: "ETAJ 3", nrAp: "AP 69", tipCom: "STUDIO", mpUtili: 40.84, pretCuTva: 0, avans50: 52100, avans80: 51100, nume: "Georgescu Razvan", contact: "", agent: "EUROCASA", finisaje: "EXECUTAT", observatii: "usi gri, finisaje gri", status: "vandut" },
  { id: "76", etaj: "ETAJ 3", nrAp: "AP 70", tipCom: "STUDIO", mpUtili: 36.09, pretCuTva: 0, avans50: 46100, avans80: 45200, nume: "jipa constantin", contact: "", agent: "EUROCASA", finisaje: "", observatii: "finisaje gri", status: "vandut" },
  { id: "77", etaj: "ETAJ 3", nrAp: "AP 71", tipCom: "GARSONIERA", mpUtili: 31.41, pretCuTva: 0, avans50: 40000, avans80: 39500, nume: "Caciulan Maria Sorin", contact: "", agent: "Eurocasa", finisaje: "", observatii: "finisaje albe", status: "vandut" },
  
  // ETAJ 4
  { id: "78", etaj: "ETAJ 4", nrAp: "AP 72", tipCom: "GARSONIERA", mpUtili: 33.38, pretCuTva: 48500, avans50: 47500, avans80: 47000, nume: "", contact: "", agent: "", finisaje: "", observatii: "", status: "disponibil" },
  { id: "79", etaj: "ETAJ 4", nrAp: "AP 73", tipCom: "GARSONIERA", mpUtili: 28.29, pretCuTva: 0, avans50: 0, avans80: 36800, nume: "ionescu oana", contact: "", agent: "eurocasa", finisaje: "", observatii: "finisaje albe", status: "vandut" },
  { id: "80", etaj: "ETAJ 4", nrAp: "AP 74", tipCom: "GARSONIERA", mpUtili: 28.29, pretCuTva: 0, avans50: 36100, avans80: 35500, nume: "jitoi marian", contact: "", agent: "EUROCASA", finisaje: "", observatii: "finisaje albe", status: "vandut" },
  { id: "81", etaj: "ETAJ 4", nrAp: "AP 75", tipCom: "STUDIO", mpUtili: 40.9, pretCuTva: 0, avans50: 52200, avans80: 51200, nume: "Constantinescu", contact: "", agent: "eurocasa", finisaje: "", observatii: "finisaje gri", status: "vandut" },
  { id: "82", etaj: "ETAJ 4", nrAp: "AP 76", tipCom: "STUDIO", mpUtili: 40.92, pretCuTva: 0, avans50: 52200, avans80: 51200, nume: "Manescu Ion", contact: "", agent: "EUROCASA", finisaje: "", observatii: "cumpara loc parcare, finisaje albe", status: "vandut" },
  { id: "83", etaj: "ETAJ 4", nrAp: "AP 77", tipCom: "GARSONIERA", mpUtili: 28.29, pretCuTva: 0, avans50: 36100, avans80: 35500, nume: "Dima Vasile", contact: "747267343", agent: "viorel", finisaje: "", observatii: "vrea loc parcare si dus, finisaje albe", status: "vandut" },
  { id: "84", etaj: "ETAJ 4", nrAp: "AP 78", tipCom: "GARSONIERA", mpUtili: 28.29, pretCuTva: 0, avans50: 36100, avans80: 35500, nume: "mitran ana maria si cristian", contact: "", agent: "EUROCASA", finisaje: "", observatii: "finisaje gri", status: "vandut" },
  { id: "85", etaj: "ETAJ 4", nrAp: "AP 79", tipCom: "GARSONIERA", mpUtili: 31.41, pretCuTva: 0, avans50: 40000, avans80: 39500, nume: "Papu Ionel", contact: "", agent: "EUROCASA", finisaje: "", observatii: "finisaje albe", status: "vandut" },
  { id: "86", etaj: "ETAJ 4", nrAp: "AP 80", tipCom: "STUDIO", mpUtili: 38.42, pretCuTva: 0, avans50: 49000, avans80: 48000, nume: "fratila florin", contact: "", agent: "eurocasa", finisaje: "", observatii: "finisaje gri", status: "vandut" },
  { id: "87", etaj: "ETAJ 4", nrAp: "AP 81", tipCom: "STUDIO", mpUtili: 40.84, pretCuTva: 0, avans50: 52100, avans80: 51100, nume: "lupu Alexandru", contact: "", agent: "EUROCASA", finisaje: "", observatii: "aduce el finisaje", status: "vandut" },
  { id: "88", etaj: "ETAJ 4", nrAp: "AP 82", tipCom: "STUDIO", mpUtili: 36.09, pretCuTva: 0, avans50: 46100, avans80: 45200, nume: "grosaru sorin adriana", contact: "741262345", agent: "mari popa", finisaje: "", observatii: "finisaje albe", status: "vandut" },
  { id: "89", etaj: "ETAJ 4", nrAp: "AP 83", tipCom: "GARSONIERA", mpUtili: 31.41, pretCuTva: 0, avans50: 40000, avans80: 39500, nume: "tudorache ionut", contact: "", agent: "eurocasa", finisaje: "", observatii: "finisaje albe si 3 prize in dormitor", status: "vandut" },
  { id: "90", etaj: "ETAJ 4", nrAp: "AP 84", tipCom: "AP 3 CAMERE", mpUtili: 70.08, pretCuTva: 0, avans50: 89500, avans80: 87600, nume: "Rosu Mihai Marius", contact: "751261899", agent: "EUROCASA", finisaje: "EXECUTAT", observatii: "vrea masina de spalat in baie nu in bucatarie, vrea si loc parcare, aduce finisaje - cumpara loc parcare", status: "vandut" },
  { id: "91", etaj: "ETAJ 4", nrAp: "AP 85", tipCom: "AP 2 CAMERE", mpUtili: 50.37, pretCuTva: 0, avans50: 64500, avans80: 63000, nume: "vladut dan", contact: "764549777", agent: "eurocasa", finisaje: "", observatii: "finisaje gri, cumpara loc parcare", status: "vandut" },
  { id: "92", etaj: "ETAJ 4", nrAp: "AP 86", tipCom: "AP 2 CAMERE", mpUtili: 48.01, pretCuTva: 0, avans50: 61500, avans80: 60100, nume: "aron ionut lucian", contact: "721688644", agent: "eurocasa", finisaje: "", observatii: "finisaje albe, cumpara loc parcare", status: "vandut" },

  // LOC PARCARE
  { id: "93", etaj: "LOC PARCARE", nrAp: "1", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "ENE ANDREEA", contact: "", agent: "EUROCASA", finisaje: "", observatii: "37", status: "vandut" },
  { id: "94", etaj: "LOC PARCARE", nrAp: "2", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "darie cristina", contact: "", agent: "eugen", finisaje: "", observatii: "48", status: "vandut" },
  { id: "95", etaj: "LOC PARCARE", nrAp: "3", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "badea daniel", contact: "", agent: "eugen", finisaje: "", observatii: "34", status: "vandut" },
  { id: "96", etaj: "LOC PARCARE", nrAp: "4", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "Florea Andreea", contact: "", agent: "Eugen", finisaje: "", observatii: "64", status: "vandut" },
  { id: "97", etaj: "LOC PARCARE", nrAp: "5", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "D-na Blaga", contact: "", agent: "eurocasa", finisaje: "", observatii: "62", status: "vandut" },
  { id: "98", etaj: "LOC PARCARE", nrAp: "6", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "mihalache adrian", contact: "", agent: "florin", finisaje: "", observatii: "30", status: "vandut" },
  { id: "99", etaj: "LOC PARCARE", nrAp: "7", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "Draghici marius", contact: "", agent: "viorel", finisaje: "", observatii: "50", status: "vandut" },
  { id: "100", etaj: "LOC PARCARE", nrAp: "8", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "iuresi cristina", contact: "", agent: "viorel", finisaje: "", observatii: "51", status: "vandut" },
  { id: "101", etaj: "LOC PARCARE", nrAp: "9", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "Barbulescu Catalin", contact: "", agent: "Eurocasa", finisaje: "", observatii: "67", status: "vandut" },
  { id: "102", etaj: "LOC PARCARE", nrAp: "10", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "Manescu Ion", contact: "", agent: "EUROCASA", finisaje: "", observatii: "76", status: "vandut" },
  { id: "103", etaj: "LOC PARCARE", nrAp: "11", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "TIRDEA ANGELA", contact: "", agent: "EUROCASA", finisaje: "", observatii: "43", status: "vandut" },
  { id: "104", etaj: "LOC PARCARE", nrAp: "12", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "Dima Vasile", contact: "747267343", agent: "viorel", finisaje: "", observatii: "77", status: "vandut" },
  { id: "105", etaj: "LOC PARCARE", nrAp: "13", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "Rosu Mihai Marius", contact: "751261899", agent: "EUROCASA", finisaje: "", observatii: "84", status: "vandut" },
  { id: "106", etaj: "LOC PARCARE", nrAp: "14", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "vladut dan", contact: "764549777", agent: "eurocasa", finisaje: "", observatii: "85", status: "vandut" },
  { id: "107", etaj: "LOC PARCARE", nrAp: "15", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "aron ionut lucian", contact: "721688644", agent: "eurocasa", finisaje: "", observatii: "86", status: "vandut" },
  { id: "108", etaj: "LOC PARCARE", nrAp: "16", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "grosaru sorin adriana", contact: "741262345", agent: "mari popa", finisaje: "", observatii: "82", status: "vandut" },
  { id: "109", etaj: "LOC PARCARE", nrAp: "17", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "Bicher lucia", contact: "", agent: "eurocasa", finisaje: "", observatii: "22", status: "vandut" },
  { id: "110", etaj: "LOC PARCARE", nrAp: "18", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "costea razvan", contact: "", agent: "renato", finisaje: "", observatii: "19", status: "vandut" },
  { id: "111", etaj: "LOC PARCARE", nrAp: "19", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "", contact: "", agent: "", finisaje: "", observatii: "", status: "disponibil" },
  { id: "112", etaj: "LOC PARCARE", nrAp: "20", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "", contact: "", agent: "", finisaje: "", observatii: "", status: "disponibil" },
  { id: "113", etaj: "LOC PARCARE", nrAp: "21", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "", contact: "", agent: "", finisaje: "", observatii: "", status: "disponibil" },
  { id: "114", etaj: "LOC PARCARE", nrAp: "22", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "", contact: "", agent: "", finisaje: "", observatii: "", status: "disponibil" },
  { id: "115", etaj: "LOC PARCARE", nrAp: "23", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "", contact: "", agent: "", finisaje: "", observatii: "", status: "disponibil" },
  { id: "116", etaj: "LOC PARCARE", nrAp: "24", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "", contact: "", agent: "", finisaje: "", observatii: "", status: "disponibil" },
  { id: "117", etaj: "LOC PARCARE", nrAp: "25", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "", contact: "", agent: "", finisaje: "", observatii: "", status: "disponibil" },
  { id: "118", etaj: "LOC PARCARE", nrAp: "26", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "", contact: "", agent: "", finisaje: "", observatii: "", status: "disponibil" },
  { id: "119", etaj: "LOC PARCARE", nrAp: "27", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "", contact: "", agent: "", finisaje: "", observatii: "", status: "disponibil" },
  { id: "120", etaj: "LOC PARCARE", nrAp: "28", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "", contact: "", agent: "", finisaje: "", observatii: "", status: "disponibil" },
  { id: "121", etaj: "LOC PARCARE", nrAp: "29", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "", contact: "", agent: "", finisaje: "", observatii: "", status: "disponibil" },
  { id: "122", etaj: "LOC PARCARE", nrAp: "30", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "", contact: "", agent: "", finisaje: "", observatii: "", status: "disponibil" },
  { id: "123", etaj: "LOC PARCARE", nrAp: "31", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "", contact: "", agent: "", finisaje: "", observatii: "", status: "disponibil" },
  { id: "124", etaj: "LOC PARCARE", nrAp: "32", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "", contact: "", agent: "", finisaje: "", observatii: "", status: "disponibil" },
  { id: "125", etaj: "LOC PARCARE", nrAp: "33", tipCom: "LOC PARCARE", mpUtili: 12.5, pretCuTva: 0, avans50: 0, avans80: 0, nume: "", contact: "", agent: "", finisaje: "", observatii: "", status: "disponibil" },
];