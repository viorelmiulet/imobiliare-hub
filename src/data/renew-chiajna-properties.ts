import { Property } from "@/types/property";

const determineStatus = (client: string): "disponibil" | "rezervat" | "vandut" => {
  if (!client || client.trim() === '') return "disponibil";
  return "vandut";
};

export const renewChiajnaProperties: Property[] = [
  // PARTER
  { id: "rc-1", "Nr. ap.": "1", "Tip Apartament": "garsoniera", "Suprafata": 31, "Pret Credit": "49,500 €", "Pret Cash": "47,000 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "P" },
  { id: "rc-2", "Nr. ap.": "2", "Tip Apartament": "garsoniera", "Suprafata": 35, "Pret Credit": "54,200 €", "Pret Cash": "51,800 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "P" },
  { id: "rc-3", "Nr. ap.": "3", "Tip Apartament": "garsoniera", "Suprafata": 35, "Pret Credit": "54,200 €", "Pret Cash": "51,800 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "P" },
  { id: "rc-4", "Nr. ap.": "4", "Tip Apartament": "garsoniera", "Suprafata": 31, "Pret Credit": "49,500 €", "Pret Cash": "47,000 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "P" },
  { id: "rc-5", "Nr. ap.": "5", "Tip Apartament": "garsoniera", "Suprafata": 31, "Pret Credit": "49,500 €", "Pret Cash": "47,000 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "P" },
  { id: "rc-6", "Nr. ap.": "6", "Tip Apartament": "studio", "Suprafata": 43, "Pret Credit": "67,000 €", "Pret Cash": "65,000 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "P" },
  { id: "rc-7", "Nr. ap.": "7", "Tip Apartament": "studio", "Suprafata": 43, "Pret Credit": "67,000 €", "Pret Cash": "65,000 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "P" },
  { id: "rc-8", "Nr. ap.": "8", "Tip Apartament": "garsoniera", "Suprafata": 31, "Pret Credit": "49,500 €", "Pret Cash": "47,000 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "P" },
  
  // ETAJ 1
  { id: "rc-9", "Nr. ap.": "9", "Tip Apartament": "garsoniera", "Suprafata": 32, "Pret Credit": "54,064 €", "Pret Cash": "43,616 €", "Client": "Virgil", "Agent": "Virgil", "Comision": "", "Observatii": "", "Etaj": "E1" },
  { id: "rc-10", "Nr. ap.": "10", "Tip Apartament": "ap decomandat", "Suprafata": 52, "Pret Credit": "75,500 €", "Pret Cash": "73,000 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "E1" },
  { id: "rc-11", "Nr. ap.": "11", "Tip Apartament": "ap decomandat", "Suprafata": 52, "Pret Credit": "75,500 €", "Pret Cash": "73,000 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "E1" },
  { id: "rc-12", "Nr. ap.": "12", "Tip Apartament": "garsoniera", "Suprafata": 32, "Pret Credit": "54,064 €", "Pret Cash": "43,616 €", "Client": "Adi Bargaoanu", "Agent": "Virgil", "Comision": "", "Observatii": "", "Etaj": "E1" },
  { id: "rc-13", "Nr. ap.": "13", "Tip Apartament": "ap decomandat", "Suprafata": 54, "Pret Credit": "77,000 €", "Pret Cash": "74,500 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "E1" },
  { id: "rc-14", "Nr. ap.": "14", "Tip Apartament": "garsoniera", "Suprafata": 35, "Pret Credit": "56,000 €", "Pret Cash": "53,500 €", "Client": "Petrica Ionuț", "Agent": "Viorel", "Comision": "", "Observatii": "plateste rezervare 1 noiembrie", "Etaj": "E1" },
  { id: "rc-15", "Nr. ap.": "15", "Tip Apartament": "garsoniera", "Suprafata": 35, "Pret Credit": "65,450 €", "Pret Cash": "52,850 €", "Client": "Petrica Ionuț", "Agent": "Viorel", "Comision": "840.00 €", "Observatii": "a achitat parcarea", "Etaj": "E1" },
  { id: "rc-16", "Nr. ap.": "16", "Tip Apartament": "garsoniera", "Suprafata": 32, "Pret Credit": "54,064 €", "Pret Cash": "43,616 €", "Client": "Miculescu Georgiana", "Agent": "Viorel", "Comision": "832.00 €", "Observatii": "", "Etaj": "E1" },
  
  // ETAJ 2
  { id: "rc-17", "Nr. ap.": "17", "Tip Apartament": "garsoniera", "Suprafata": 32, "Pret Credit": "54,064 €", "Pret Cash": "43,616 €", "Client": "Viorel", "Agent": "Viorel", "Comision": "", "Observatii": "", "Etaj": "E2" },
  { id: "rc-18", "Nr. ap.": "18", "Tip Apartament": "ap decomandat", "Suprafata": 52, "Pret Credit": "75,500 €", "Pret Cash": "73,000 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "E2" },
  { id: "rc-19", "Nr. ap.": "19", "Tip Apartament": "ap decomandat", "Suprafata": 52, "Pret Credit": "75,500 €", "Pret Cash": "73,000 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "E2" },
  { id: "rc-20", "Nr. ap.": "20", "Tip Apartament": "garsoniera", "Suprafata": 32, "Pret Credit": "54,064 €", "Pret Cash": "43,616 €", "Client": "Costica Vancica", "Agent": "Virgil", "Comision": "", "Observatii": "", "Etaj": "E2" },
  { id: "rc-21", "Nr. ap.": "21", "Tip Apartament": "ap decomandat", "Suprafata": 54, "Pret Credit": "77,000 €", "Pret Cash": "74,500 €", "Client": "Viorel", "Agent": "Viorel", "Comision": "", "Observatii": "", "Etaj": "E2" },
  { id: "rc-22", "Nr. ap.": "22", "Tip Apartament": "garsoniera", "Suprafata": 35, "Pret Credit": "56,000 €", "Pret Cash": "53,500 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "E2" },
  { id: "rc-23", "Nr. ap.": "23", "Tip Apartament": "garsoniera", "Suprafata": 35, "Pret Credit": "56,000 €", "Pret Cash": "53,500 €", "Client": "Dinu Denis", "Agent": "Viorel", "Comision": "1,120.00 €", "Observatii": "", "Etaj": "E2" },
  { id: "rc-24", "Nr. ap.": "24", "Tip Apartament": "garsoniera", "Suprafata": 32, "Pret Credit": "54,064 €", "Pret Cash": "43,616 €", "Client": "Miculescu Bianca", "Agent": "Viorel", "Comision": "832.00 €", "Observatii": "", "Etaj": "E2" },
  
  // ETAJ 3
  { id: "rc-25", "Nr. ap.": "25", "Tip Apartament": "garsoniera", "Suprafata": 32, "Pret Credit": "54,064 €", "Pret Cash": "43,616 €", "Client": "", "Agent": "Virgil", "Comision": "", "Observatii": "", "Etaj": "E3" },
  { id: "rc-26", "Nr. ap.": "26", "Tip Apartament": "ap decomandat", "Suprafata": 52, "Pret Credit": "75,500 €", "Pret Cash": "73,000 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "E3" },
  { id: "rc-27", "Nr. ap.": "27", "Tip Apartament": "ap decomandat", "Suprafata": 52, "Pret Credit": "75,500 €", "Pret Cash": "73,000 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "E3" },
  { id: "rc-28", "Nr. ap.": "28", "Tip Apartament": "garsoniera", "Suprafata": 32, "Pret Credit": "59,840 €", "Pret Cash": "48,320 €", "Client": "Marinescu George Cosmin", "Agent": "Viorel", "Comision": "966.40 €", "Observatii": "", "Etaj": "E3" },
  { id: "rc-29", "Nr. ap.": "29", "Tip Apartament": "ap decomandat", "Suprafata": 54, "Pret Credit": "77,000 €", "Pret Cash": "74,500 €", "Client": "Oprea Lucian", "Agent": "Viorel", "Comision": "1,490.00 €", "Observatii": "", "Etaj": "E3" },
  { id: "rc-30", "Nr. ap.": "30", "Tip Apartament": "garsoniera", "Suprafata": 35, "Pret Credit": "56,000 €", "Pret Cash": "53,500 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "E3" },
  { id: "rc-31", "Nr. ap.": "31", "Tip Apartament": "garsoniera", "Suprafata": 35, "Pret Credit": "56,000 €", "Pret Cash": "53,500 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "E3" },
  { id: "rc-32", "Nr. ap.": "32", "Tip Apartament": "garsoniera", "Suprafata": 32, "Pret Credit": "59,840 €", "Pret Cash": "48,320 €", "Client": "Ionescu Mihaela", "Agent": "Viorel", "Comision": "921.60 €", "Observatii": "", "Etaj": "E3" },
  
  // ETAJ 4
  { id: "rc-33", "Nr. ap.": "33", "Tip Apartament": "garsoniera", "Suprafata": 32, "Pret Credit": "51,000 €", "Pret Cash": "48,500 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "E4" },
  { id: "rc-34", "Nr. ap.": "34", "Tip Apartament": "ap decomandat", "Suprafata": 52, "Pret Credit": "75,500 €", "Pret Cash": "73,000 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "E4" },
  { id: "rc-35", "Nr. ap.": "35", "Tip Apartament": "ap decomandat", "Suprafata": 52, "Pret Credit": "75,500 €", "Pret Cash": "73,000 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "E4" },
  { id: "rc-36", "Nr. ap.": "36", "Tip Apartament": "garsoniera", "Suprafata": 32, "Pret Credit": "51,000 €", "Pret Cash": "48,500 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "E4" },
  { id: "rc-37", "Nr. ap.": "37", "Tip Apartament": "ap decomandat", "Suprafata": 54, "Pret Credit": "77,000 €", "Pret Cash": "74,500 €", "Client": "Trandafir Alin", "Agent": "Viorel", "Comision": "1,540.00 €", "Observatii": "", "Etaj": "E4" },
  { id: "rc-38", "Nr. ap.": "38", "Tip Apartament": "garsoniera", "Suprafata": 35, "Pret Credit": "56,000 €", "Pret Cash": "53,500 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "E4" },
  { id: "rc-39", "Nr. ap.": "39", "Tip Apartament": "garsoniera", "Suprafata": 35, "Pret Credit": "56,000 €", "Pret Cash": "53,500 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "E4" },
  { id: "rc-40", "Nr. ap.": "40", "Tip Apartament": "garsoniera", "Suprafata": 32, "Pret Credit": "51,000 €", "Pret Cash": "48,500 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "E4" },
  
  // ETAJ 5
  { id: "rc-41", "Nr. ap.": "41", "Tip Apartament": "garsoniera", "Suprafata": 32, "Pret Credit": "48,500 €", "Pret Cash": "46,000 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "E5" },
  { id: "rc-42", "Nr. ap.": "42", "Tip Apartament": "ap decomandat", "Suprafata": 52, "Pret Credit": "72,000 €", "Pret Cash": "69,500 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "E5" },
  { id: "rc-43", "Nr. ap.": "43", "Tip Apartament": "ap decomandat", "Suprafata": 52, "Pret Credit": "72,000 €", "Pret Cash": "69,500 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "E5" },
  { id: "rc-44", "Nr. ap.": "44", "Tip Apartament": "garsoniera", "Suprafata": 32, "Pret Credit": "48,500 €", "Pret Cash": "46,000 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "E5" },
  { id: "rc-45", "Nr. ap.": "45", "Tip Apartament": "ap decomandat", "Suprafata": 54, "Pret Credit": "73,000 €", "Pret Cash": "70,500 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "E5" },
  { id: "rc-46", "Nr. ap.": "46", "Tip Apartament": "garsoniera", "Suprafata": 35, "Pret Credit": "53,000 €", "Pret Cash": "50,500 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "E5" },
  { id: "rc-47", "Nr. ap.": "47", "Tip Apartament": "garsoniera", "Suprafata": 35, "Pret Credit": "53,000 €", "Pret Cash": "50,500 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "E5" },
  { id: "rc-48", "Nr. ap.": "48", "Tip Apartament": "garsoniera", "Suprafata": 32, "Pret Credit": "48,500 €", "Pret Cash": "46,000 €", "Client": "", "Agent": "", "Comision": "", "Observatii": "", "Etaj": "E5" },
];