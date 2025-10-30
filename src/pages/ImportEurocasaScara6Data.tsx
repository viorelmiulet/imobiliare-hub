import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { importEurocasaScara6Data } from '@/utils/importEurocasaScara6Data';
import { toast } from 'sonner';

const ImportEurocasaScara6Data = () => {
  const navigate = useNavigate();
  const [isImporting, setIsImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const result = await importEurocasaScara6Data();
      toast.success(`Import reușit! ${result.count} proprietăți încărcate (${result.available} disponibile).`);
      setImportComplete(true);
    } catch (error) {
      console.error('Error importing data:', error);
      toast.error('Eroare la importul datelor');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Import Date Eurocasa Scara 6</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Acest import va încărca datele din fișierul Excel pentru complexul Eurocasa Scara 6.
          </p>
          
          {!importComplete ? (
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
                'Importă Date'
              )}
            </Button>
          ) : (
            <div className="space-y-4">
              <p className="text-green-600 font-medium">Import finalizat cu succes!</p>
              <Button 
                onClick={() => navigate('/complex/eurocasa-scara6')}
                className="w-full"
              >
                Vezi Complexul
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportEurocasaScara6Data;
