import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { importViilor33Data } from "@/utils/importViilor33Data";
import { useNavigate } from "react-router-dom";

const ImportViilor33Data = () => {
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);
  const navigate = useNavigate();

  const handleImport = async () => {
    setImporting(true);
    try {
      const result = await importViilor33Data();
      setImported(true);
      toast.success(`Import finalizat! ${result.count} proprietăți încărcate.`);
      
      // Navigate to the new complex after a short delay
      setTimeout(() => {
        navigate("/complex/complex-viilor33");
      }, 2000);
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Eroare la importul datelor");
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileUp className="h-6 w-6" />
            Import Date - Viilor 33
          </CardTitle>
          <CardDescription>
            Importă toate proprietățile din complexul Viilor 33
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!imported ? (
            <>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="text-sm">Acest import va:</p>
                <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Șterge proprietățile existente pentru Viilor 33</li>
                  <li>Încarcă aproximativ 50 de proprietăți noi</li>
                  <li>Distribuie proprietățile pe 2 corpuri (Corp 1 și Corp 2)</li>
                  <li>Organizează pe etajele: DEMISOL, PARTER, ETAJ 1, ETAJ 2, ETAJ 3</li>
                  <li>Actualizeze statisticile complexului</li>
                </ul>
              </div>
              
              <Button
                onClick={handleImport}
                disabled={importing}
                className="w-full"
                size="lg"
              >
                {importing ? (
                  <>
                    <FileUp className="mr-2 h-5 w-5 animate-pulse" />
                    Se importă...
                  </>
                ) : (
                  <>
                    <FileUp className="mr-2 h-5 w-5" />
                    Începe Importul
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <CheckCircle className="h-16 w-16 text-success" />
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">Import Finalizat!</h3>
                <p className="text-muted-foreground">
                  Proprietățile au fost încărcate cu succes.
                </p>
                <p className="text-sm text-muted-foreground">
                  Vei fi redirecționat către complex...
                </p>
              </div>
            </div>
          )}
          
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full"
          >
            Înapoi la Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportViilor33Data;
