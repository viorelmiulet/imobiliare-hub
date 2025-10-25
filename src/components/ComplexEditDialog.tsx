import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Complex } from "@/types/complex";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const complexSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Numele complexului este obligatoriu" })
    .max(100, { message: "Numele trebuie să aibă maxim 100 caractere" }),
  location: z
    .string()
    .trim()
    .min(1, { message: "Adresa este obligatorie" })
    .max(200, { message: "Adresa trebuie să aibă maxim 200 caractere" }),
  description: z
    .string()
    .trim()
    .max(500, { message: "Descrierea trebuie să aibă maxim 500 caractere" })
    .optional(),
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
    description: complex.description || "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    location?: string;
    description?: string;
  }>({});

  useEffect(() => {
    setFormData({
      name: complex.name,
      location: complex.location,
      description: complex.description || "",
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
        description: validatedData.description || "",
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
          description?: string;
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
              Adresă / Locație <span className="text-destructive">*</span>
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="ex: Sector 1, București"
              maxLength={200}
              className={errors.location ? "border-destructive" : ""}
            />
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descriere</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Descriere opțională a complexului..."
              maxLength={500}
              rows={4}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.description.length} / 500 caractere
            </p>
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
