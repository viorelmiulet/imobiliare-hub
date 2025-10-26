import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Users, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { parseVCF, VCFContact } from '@/utils/parseVCF';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';

const ImportContacts = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importStats, setImportStats] = useState<{
    total: number;
    success: number;
    failed: number;
    duplicates: number;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.vcf') && !selectedFile.type.includes('vcard')) {
        toast.error('Te rog selectează un fișier VCF valid');
        return;
      }
      setFile(selectedFile);
      setImportStats(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Te rog selectează un fișier');
      return;
    }

    setIsImporting(true);
    setImportStats({ total: 0, success: 0, failed: 0, duplicates: 0 });

    try {
      const fileContent = await file.text();
      const contacts = parseVCF(fileContent);

      if (contacts.length === 0) {
        toast.error('Nu s-au găsit contacte în fișier');
        setIsImporting(false);
        return;
      }

      let success = 0;
      let failed = 0;
      let duplicates = 0;

      // Import contacts in batches
      for (const contact of contacts) {
        try {
          // Check if contact already exists (by phone)
          const { data: existing } = await supabase
            .from('clients')
            .select('id')
            .eq('phone', contact.phone)
            .maybeSingle();

          if (existing) {
            duplicates++;
            continue;
          }

          // Insert new contact
          const { error } = await supabase
            .from('clients')
            .insert({
              name: contact.name,
              phone: contact.phone,
              email: contact.email,
              organization: contact.organization,
            });

          if (error) {
            console.error('Error inserting contact:', error);
            failed++;
          } else {
            success++;
          }
        } catch (error) {
          console.error('Error processing contact:', error);
          failed++;
        }

        // Update stats
        setImportStats({
          total: contacts.length,
          success,
          failed,
          duplicates,
        });
      }

      if (success > 0) {
        toast.success(`${success} contacte importate cu succes!`);
      }
      if (duplicates > 0) {
        toast.info(`${duplicates} contacte duplicate sărite`);
      }
      if (failed > 0) {
        toast.error(`${failed} contacte nu au putut fi importate`);
      }
    } catch (error) {
      console.error('Error importing contacts:', error);
      toast.error('Eroare la importul contactelor');
    } finally {
      setIsImporting(false);
    }
  };

  const progress = importStats
    ? ((importStats.success + importStats.failed + importStats.duplicates) / importStats.total) * 100
    : 0;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => navigate('/clients')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Înapoi la Clienți
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Import Contacte VCF
          </CardTitle>
          <CardDescription>
            Importă contacte din fișiere VCF (vCard) în baza ta de date
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              id="vcf-upload"
              accept=".vcf,text/vcard"
              onChange={handleFileChange}
              className="hidden"
              disabled={isImporting}
            />
            <label
              htmlFor="vcf-upload"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              <div className="rounded-full bg-primary/10 p-4">
                {file ? (
                  <FileText className="h-8 w-8 text-primary" />
                ) : (
                  <Upload className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              {file ? (
                <>
                  <div className="text-lg font-medium">{file.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </div>
                </>
              ) : (
                <>
                  <div className="text-lg font-medium">
                    Selectează un fișier VCF
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Apasă pentru a alege un fișier sau trage-l aici
                  </div>
                </>
              )}
            </label>
          </div>

          {/* Import Button */}
          {file && (
            <Button
              onClick={handleImport}
              disabled={isImporting}
              className="w-full"
              size="lg"
            >
              {isImporting ? 'Se importă...' : 'Importă Contacte'}
            </Button>
          )}

          {/* Progress */}
          {isImporting && importStats && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <div className="text-sm text-center text-muted-foreground">
                {importStats.success + importStats.failed + importStats.duplicates} din {importStats.total} procesate
              </div>
            </div>
          )}

          {/* Import Statistics */}
          {importStats && !isImporting && importStats.total > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{importStats.total}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                  <CheckCircle className="h-5 w-5" />
                  {importStats.success}
                </div>
                <div className="text-xs text-muted-foreground">Importate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{importStats.duplicates}</div>
                <div className="text-xs text-muted-foreground">Duplicate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 flex items-center justify-center gap-1">
                  <XCircle className="h-5 w-5" />
                  {importStats.failed}
                </div>
                <div className="text-xs text-muted-foreground">Erori</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportContacts;
