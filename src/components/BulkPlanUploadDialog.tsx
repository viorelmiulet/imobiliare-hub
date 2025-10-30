import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BulkPlanUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  onUpload: (planUrl: string) => Promise<void>;
}

export const BulkPlanUploadDialog = ({
  open,
  onOpenChange,
  selectedCount,
  onUpload,
}: BulkPlanUploadDialogProps) => {
  const [uploading, setUploading] = useState(false);
  const [planUrl, setPlanUrl] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Vă rugăm să încărcați doar fișiere imagine');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Fișierul este prea mare. Dimensiunea maximă este 5MB');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('property-plans')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('property-plans')
        .getPublicUrl(filePath);

      setPlanUrl(publicUrl);
      toast.success('Plan încărcat cu succes');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Eroare la încărcarea fișierului');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePlan = async () => {
    if (!planUrl) return;

    try {
      const fileName = planUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('property-plans')
          .remove([fileName]);
      }
      setPlanUrl(null);
      toast.success('Plan șters cu succes');
    } catch (error) {
      console.error('Error removing file:', error);
      toast.error('Eroare la ștergerea fișierului');
    }
  };

  const handleSubmit = async () => {
    if (!planUrl) {
      toast.error('Vă rugăm să încărcați un plan');
      return;
    }

    try {
      await onUpload(planUrl);
      setPlanUrl(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Error uploading plan:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Încarcă Plan pentru Proprietăți</DialogTitle>
          <DialogDescription>
            Planul va fi aplicat pentru {selectedCount} {selectedCount === 1 ? 'proprietate selectată' : 'proprietăți selectate'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="bulk-plan">Plan Proprietate</Label>
            <div className="space-y-3">
              {planUrl ? (
                <div className="relative border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <img 
                        src={planUrl} 
                        alt="Plan proprietate" 
                        className="w-full max-h-48 object-contain rounded-md"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleRemovePlan}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Input
                    id="bulk-plan"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <Label
                    htmlFor="bulk-plan"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="text-sm text-muted-foreground">Se încarcă...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Click pentru a încărca planul
                        </span>
                        <span className="text-xs text-muted-foreground">
                          PNG, JPG până la 5MB
                        </span>
                      </>
                    )}
                  </Label>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setPlanUrl(null);
              onOpenChange(false);
            }}
          >
            Anulează
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!planUrl || uploading}
          >
            Aplică Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
