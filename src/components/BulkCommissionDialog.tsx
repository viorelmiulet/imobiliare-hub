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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface BulkCommissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  commissionType?: 'fixed' | 'percentage';
  commissionValue?: number;
  onSetCommission: (commission: string) => Promise<void>;
}

export const BulkCommissionDialog = ({
  open,
  onOpenChange,
  selectedCount,
  commissionType = 'percentage',
  commissionValue = 2,
  onSetCommission,
}: BulkCommissionDialogProps) => {
  const [calculationType, setCalculationType] = useState<'auto' | 'manual'>('auto');
  const [manualCommission, setManualCommission] = useState<string>('');

  const handleSubmit = async () => {
    if (calculationType === 'manual') {
      if (!manualCommission || parseFloat(manualCommission) <= 0) {
        toast.error('Vă rugăm să introduceți un comision valid');
        return;
      }
      await onSetCommission(manualCommission);
    } else {
      // Auto calculation will be handled per property in parent
      await onSetCommission('auto');
    }
    setManualCommission('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Setează Comision pentru Proprietăți</DialogTitle>
          <DialogDescription>
            Comisionul va fi aplicat pentru {selectedCount} {selectedCount === 1 ? 'proprietate selectată' : 'proprietăți selectate'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="calculation-type">Tip Calcul</Label>
            <Select
              value={calculationType}
              onValueChange={(value: 'auto' | 'manual') => setCalculationType(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">
                  Calcul Automat ({commissionType === 'fixed' ? `${commissionValue}€ fix` : `${commissionValue}%`})
                </SelectItem>
                <SelectItem value="manual">Valoare Manuală</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {calculationType === 'auto' && (
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">
                {commissionType === 'fixed' ? (
                  <>Comisionul fix de <span className="font-semibold text-foreground">{commissionValue}€</span> va fi aplicat pentru toate proprietățile selectate.</>
                ) : (
                  <>Comisionul va fi calculat ca <span className="font-semibold text-foreground">{commissionValue}%</span> din prețul fiecărei proprietăți (credit sau cash în funcție de disponibilitate).</>
                )}
              </p>
            </div>
          )}

          {calculationType === 'manual' && (
            <div className="space-y-2">
              <Label htmlFor="manual-commission">Comision (EUR)</Label>
              <Input
                id="manual-commission"
                type="number"
                step="0.01"
                value={manualCommission}
                onChange={(e) => setManualCommission(e.target.value)}
                placeholder="ex: 1500.00"
              />
              <p className="text-xs text-muted-foreground">
                Această valoare va fi aplicată pentru toate proprietățile selectate
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setManualCommission('');
              onOpenChange(false);
            }}
          >
            Anulează
          </Button>
          <Button onClick={handleSubmit}>
            Aplică Comision
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
