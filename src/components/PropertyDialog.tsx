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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Property } from "@/types/property";

interface PropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (property: Property | Omit<Property, "id">) => void;
  property?: Property | null;
}

export const PropertyDialog = ({
  open,
  onOpenChange,
  onSubmit,
  property,
}: PropertyDialogProps) => {
  const [formData, setFormData] = useState<{
    etaj: string;
    nrAp: string;
    tipCom: string;
    mpUtili: number;
    pretFaraTva: number;
    pretCuTva: number;
    avans50: number;
    avans80: number;
    nume: string;
    contact: string;
    agent: string;
    finisaje: string;
    observatii: string;
    status: "disponibil" | "rezervat" | "vandut";
  }>({
    etaj: "",
    nrAp: "",
    tipCom: "",
    mpUtili: 0,
    pretFaraTva: 0,
    pretCuTva: 0,
    avans50: 0,
    avans80: 0,
    nume: "",
    contact: "",
    agent: "",
    finisaje: "",
    observatii: "",
    status: "disponibil",
  });

  useEffect(() => {
    if (property) {
      setFormData({
        etaj: property.etaj,
        nrAp: property.nrAp,
        tipCom: property.tipCom,
        mpUtili: property.mpUtili,
        pretFaraTva: property.pretFaraTva,
        pretCuTva: property.pretCuTva,
        avans50: property.avans50,
        avans80: property.avans80,
        nume: property.nume,
        contact: property.contact,
        agent: property.agent,
        finisaje: property.finisaje,
        observatii: property.observatii,
        status: property.status,
      });
    } else {
      setFormData({
        etaj: "",
        nrAp: "",
        tipCom: "",
        mpUtili: 0,
        pretFaraTva: 0,
        pretCuTva: 0,
        avans50: 0,
        avans80: 0,
        nume: "",
        contact: "",
        agent: "",
        finisaje: "",
        observatii: "",
        status: "disponibil",
      });
    }
  }, [property, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (property) {
      onSubmit({ ...formData, id: property.id });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {property ? "Editează Proprietate" : "Adaugă Proprietate Nouă"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="etaj">Etaj</Label>
              <Select
                value={formData.etaj}
                onValueChange={(value) =>
                  setFormData({ ...formData, etaj: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selectează etajul" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEMISOL">DEMISOL</SelectItem>
                  <SelectItem value="PARTER">PARTER</SelectItem>
                  <SelectItem value="ETAJ 1">ETAJ 1</SelectItem>
                  <SelectItem value="ETAJ 2">ETAJ 2</SelectItem>
                  <SelectItem value="ETAJ 3">ETAJ 3</SelectItem>
                  <SelectItem value="ETAJ 4">ETAJ 4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nrAp">Număr Apartament</Label>
              <Input
                id="nrAp"
                value={formData.nrAp}
                onChange={(e) =>
                  setFormData({ ...formData, nrAp: e.target.value })
                }
                placeholder="ex: AP 1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipCom">Tip Compartimentare</Label>
              <Select
                value={formData.tipCom}
                onValueChange={(value) =>
                  setFormData({ ...formData, tipCom: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selectează tipul" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GARSONIERA">GARSONIERA</SelectItem>
                  <SelectItem value="STUDIO">STUDIO</SelectItem>
                  <SelectItem value="AP 2 CAMERE">AP 2 CAMERE</SelectItem>
                  <SelectItem value="AP 3 CAMERE">AP 3 CAMERE</SelectItem>
                  <SelectItem value="SP COM">SP COM</SelectItem>
                  <SelectItem value="BOXA">BOXA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mpUtili">MP Utili</Label>
              <Input
                id="mpUtili"
                type="number"
                step="0.01"
                value={formData.mpUtili || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mpUtili: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="33.52"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pretFaraTva">Preț fără TVA (EUR)</Label>
              <Input
                id="pretFaraTva"
                type="number"
                value={formData.pretFaraTva || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pretFaraTva: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="40500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pretCuTva">Preț cu TVA (EUR)</Label>
              <Input
                id="pretCuTva"
                type="number"
                value={formData.pretCuTva || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pretCuTva: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="48700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avans50">Avans 50% (EUR)</Label>
              <Input
                id="avans50"
                type="number"
                value={formData.avans50 || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    avans50: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="47700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avans80">Avans 80% (EUR)</Label>
              <Input
                id="avans80"
                type="number"
                value={formData.avans80 || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    avans80: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="47000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selectează statusul" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponibil">Disponibil</SelectItem>
                  <SelectItem value="rezervat">Rezervat</SelectItem>
                  <SelectItem value="vandut">Vândut</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nume">Nume Cumpărător</Label>
              <Input
                id="nume"
                value={formData.nume}
                onChange={(e) =>
                  setFormData({ ...formData, nume: e.target.value })
                }
                placeholder="ex: Ion Popescu"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                placeholder="ex: 0712345678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agent">Agent</Label>
              <Input
                id="agent"
                value={formData.agent}
                onChange={(e) =>
                  setFormData({ ...formData, agent: e.target.value })
                }
                placeholder="ex: Mari Popa"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="finisaje">Finisaje</Label>
            <Input
              id="finisaje"
              value={formData.finisaje}
              onChange={(e) =>
                setFormData({ ...formData, finisaje: e.target.value })
              }
              placeholder="ex: finisaje albe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observatii">Observații</Label>
            <Textarea
              id="observatii"
              value={formData.observatii}
              onChange={(e) =>
                setFormData({ ...formData, observatii: e.target.value })
              }
              placeholder="Notițe suplimentare..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Anulează
            </Button>
            <Button type="submit">
              {property ? "Salvează Modificările" : "Adaugă Proprietate"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
