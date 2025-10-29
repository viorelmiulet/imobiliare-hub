import { useState, useEffect } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Complex } from "@/types/complex";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Percent, Euro } from "lucide-react";

const complexSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Numele complexului este obligatoriu" })
    .max(100, { message: "Numele trebuie să aibă maxim 100 caractere" }),
  location: z
    .string()
    .trim()
    .min(1, { message: "Adresa complexului este obligatorie" })
    .max(200, { message: "Adresa trebuie să aibă maxim 200 caractere" }),
  commission_type: z.enum(['fixed', 'percentage']),
  commission_value: z.number().min(0, { message: "Valoarea trebuie să fie pozitivă" }),
});

interface ComplexEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (complex: Complex) => void;
  complex: Complex;
}

export const ComplexEditDialog = ({
  open,
  onOpenChange,
  onSubmit,
  complex,
}: ComplexEditDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: complex.name,
    location: complex.location,
    commission_type: complex.commission_type || 'percentage' as 'fixed' | 'percentage',
    commission_value: complex.commission_value || 0,
  });
  const [errors, setErrors] = useState<{
    name?: string;
    location?: string;
    commission_value?: string;
  }>({});

  useEffect(() => {
    setFormData({
      name: complex.name,
      location: complex.location,
      commission_type: complex.commission_type || 'percentage',
      commission_value: complex.commission_value || 0,
    });
    setErrors({});
  }, [complex, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data
      const validatedData = complexSchema.parse(formData);

      // Submit validated data
      onSubmit({
        ...complex,
        name: validatedData.name,
        location: validatedData.location,
        commission_type: validatedData.commission_type,
        commission_value: validatedData.commission_value,
      });

      toast({
        title: "Succes",
        description: "Complexul a fost actualizat cu succes",
      });

      onOpenChange(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: {
          name?: string;
          location?: string;
          commission_value?: string;
        } = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof typeof fieldErrors] = err.message;
          }
        });
        setErrors(fieldErrors);

        toast({
          title: "Eroare de validare",
          description: "Vă rugăm să corectați câmpurile marcate",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editează Complex</DialogTitle>
          <DialogDescription>
            Modifică detaliile complexului și setările de comision
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nume Complex <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="ex: Complex Rezidențial Nord"
              maxLength={100}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">
              Adresă <span className="text-destructive">*</span>
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="ex: Str. Exemplu nr. 123, București"
              maxLength={200}
              className={errors.location ? "border-destructive" : ""}
            />
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location}</p>
            )}
          </div>

          <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
            <div>
              <Label className="text-base font-semibold">Tip Comision</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Selectează modul de calcul al comisionului
              </p>
            </div>

            <RadioGroup
              value={formData.commission_type}
              onValueChange={(value: 'fixed' | 'percentage') =>
                setFormData({ ...formData, commission_type: value })
              }
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-background transition-colors">
                <RadioGroupItem value="percentage" id="percentage" />
                <Label
                  htmlFor="percentage"
                  className="flex-1 cursor-pointer flex items-center gap-2"
                >
                  <Percent className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Procent</div>
                    <div className="text-xs text-muted-foreground">
                      Comision calculat ca procent din preț
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-background transition-colors">
                <RadioGroupItem value="fixed" id="fixed" />
                <Label
                  htmlFor="fixed"
                  className="flex-1 cursor-pointer flex items-center gap-2"
                >
                  <Euro className="h-4 w-4 text-success" />
                  <div>
                    <div className="font-medium">Sumă fixă</div>
                    <div className="text-xs text-muted-foreground">
                      Comision fix în EUR pentru fiecare vânzare
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <div className="space-y-2 pt-2">
              <Label htmlFor="commission_value">
                {formData.commission_type === 'percentage' ? 'Procent Comision (%)' : 'Sumă Comision (EUR)'}
                <span className="text-destructive"> *</span>
              </Label>
              <Input
                id="commission_value"
                type="number"
                step={formData.commission_type === 'percentage' ? '0.01' : '1'}
                min="0"
                value={formData.commission_value}
                onChange={(e) =>
                  setFormData({ ...formData, commission_value: parseFloat(e.target.value) || 0 })
                }
                placeholder={formData.commission_type === 'percentage' ? 'ex: 5' : 'ex: 1000'}
                className={errors.commission_value ? "border-destructive" : ""}
              />
              {errors.commission_value && (
                <p className="text-sm text-destructive">{errors.commission_value}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.commission_type === 'percentage'
                  ? 'Introdu procentul (ex: 5 pentru 5%)'
                  : 'Introdu suma în EUR (ex: 1000)'}
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Anulează
            </Button>
            <Button type="submit">Salvează Modificările</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
