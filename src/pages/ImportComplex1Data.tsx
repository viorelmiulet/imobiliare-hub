import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { importComplex1Data } from '@/utils/importComplex1Data';
import { toast } from 'sonner';

const ImportComplex1Data = () => {
  const navigate = useNavigate();
  const [isImporting, setIsImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const result = await importComplex1Data();
      toast.success(`Import reușit! ${result.count} proprietăți încărcate (${result.available} disponibile).`);
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
          <CardTitle>Import Date Complexul 1 (Eurocasa Scara 6)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!importComplete ? (
            <>
              <p className="text-sm text-muted-foreground">
                Acest proces va șterge toate datele existente pentru Complexul 1 și va încărca datele noi din fișierul Excel, inclusiv proprietățile de pe ETAJ 5 și ETAJ 6.
              </p>
              <p className="text-sm text-warning font-medium">
                Total: 119 proprietăți pe 6 etaje + demisol + parter
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
                Import finalizat cu succes! Datele au fost încărcate în baza de date, inclusiv proprietățile de pe ETAJ 5 și ETAJ 6.
              </p>
              <Button
                onClick={() => navigate('/complex/complex-1')}
                className="w-full"
              >
                Vezi Complexul 1
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

export default ImportComplex1Data;
