import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Property } from "@/types/property";
import * as XLSX from 'xlsx';

interface ExcelImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complexId: string;
  onImport: (properties: Property[]) => void;
}

export const ExcelImportDialog = ({
  open,
  onOpenChange,
  complexId,
  onImport,
}: ExcelImportDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ];
      
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        toast({
          title: "Tip fișier invalid",
          description: "Te rog să încarci un fișier Excel (.xlsx sau .xls)",
          variant: "destructive",
        });
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        title: "Eroare",
        description: "Te rog să selectezi un fișier Excel",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      console.log('Processing Excel file for complex:', complexId);

      // Read the file
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // Get the first sheet
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json<any>(firstSheet);

      console.log(`Parsed ${jsonData.length} rows from Excel`);
      console.log('First row sample:', jsonData[0]);
      console.log('Column names:', Object.keys(jsonData[0] || {}));

      // Transform the data to match Property interface
      const determineStatus = (nume: string = '', observatii: string = ''): 'disponibil' | 'rezervat' | 'vandut' => {
        const numeText = (nume || '').toLowerCase();
        const obsText = (observatii || '').toLowerCase();
        
        if (numeText.includes('rezervat') || obsText.includes('rezervat')) {
          return 'rezervat';
        }
        if (nume && nume.trim() && !numeText.includes('rezervat')) {
          return 'vandut';
        }
        return 'disponibil';
      };

      const properties: Property[] = jsonData
        .filter(row => {
          // Check multiple possible column names for apartment number
          const hasApartment = row['NR AP'] || row['NR. AP'] || row['Nr. Ap'] || row['NR.AP'];
          console.log('Row has apartment:', hasApartment, 'Row:', row);
          return hasApartment;
        })
        .map((row, index) => ({
          id: `${complexId}-${index}-${Date.now()}`,
          corp: row.CORP || row.Corp || '',
          etaj: row.ETAJ || row.Etaj || '',
          nrAp: row['NR AP'] || row['NR. AP'] || row['Nr. Ap'] || row['NR.AP'] || '',
          tipCom: row['TIP COM'] || row['Tip Com'] || '',
          mpUtili: Number(row['MP UTILI'] || row['Mp Utili']) || 0,
          pretCuTva: Number(row['PRET CU TVA 21%'] || row['Pret cu TVA 21%']) || 0,
          avans50: Number(row['AVANS 50%'] || row['Avans 50%']) || 0,
          avans80: Number(row['AVANS 80%'] || row['Avans 80%']) || 0,
          nume: row.NUME || row.Nume || '',
          contact: row.CONTACT || row.Contact || '',
          agent: row.AGENT || row.Agent || '',
          finisaje: row.FINISAJE || row.Finisaje || '',
          observatii: row.OBSERVATII || row.Observatii || '',
          status: determineStatus(row.NUME || row.Nume || '', row.OBSERVATII || row.Observatii || ''),
        }));

      console.log(`Successfully transformed ${properties.length} properties`);
      console.log('Sample property:', properties[0]);

      onImport(properties);
      
      toast({
        title: "Import reușit!",
        description: `Am importat ${properties.length} proprietăți din fișierul Excel.`,
      });

      setFile(null);
      onOpenChange(false);

    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "Eroare la import",
        description: error.message || "A apărut o eroare la importul fișierului Excel.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importă din Excel</DialogTitle>
          <DialogDescription>
            Încarcă un fișier Excel pentru a importa automat proprietățile
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Input */}
          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              id="excel-upload"
              disabled={isUploading}
            />
            <label
              htmlFor="excel-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              {file ? (
                <>
                  <FileSpreadsheet className="h-12 w-12 text-success" />
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    Click pentru a selecta fișier Excel
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Acceptăm fișiere .xlsx și .xls (max 20MB)
                  </p>
                </>
              )}
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setFile(null);
                onOpenChange(false);
              }}
              disabled={isUploading}
            >
              Anulează
            </Button>
            <Button
              onClick={handleImport}
              disabled={!file || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Se importă...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Importă
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};