import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { importEurocasa65GData } from '@/utils/importExcelData';
import { toast } from 'sonner';

const ImportEurocasaData = () => {
  const navigate = useNavigate();
  const [isImporting, setIsImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const result = await importEurocasa65GData();
      toast.success(`Import reușit! ${result.count} proprietăți încărcate.`);
      setImportComplete(true);
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Eroare la importul datelor');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Import Date Eurocasa 65G</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!importComplete ? (
            <>
              <p className="text-sm text-muted-foreground">
                Acest proces va șterge toate datele existente pentru complexul Eurocasa 65G și va încărca datele noi din fișierul Excel.
              </p>
              <Button
                onClick={handleImport}
                disabled={isImporting}
                className="w-full"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Se importă...
                  </>
                ) : (
                  'Începe Importul'
                )}
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-success">
                Import finalizat cu succes! Datele au fost încărcate în baza de date.
              </p>
              <Button
                onClick={() => navigate('/complex/complex-2')}
                className="w-full"
              >
                Vezi Eurocasa 65G
              </Button>
            </>
          )}
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="w-full"
          >
            Înapoi la Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportEurocasaData;
