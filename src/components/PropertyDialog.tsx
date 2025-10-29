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
import { useClients } from "@/hooks/useClients";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X, Image } from "lucide-react";

interface PropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (property: Property | Omit<Property, "id">) => void;
  property?: Property | null;
  userRole?: string;
}

export const PropertyDialog = ({
  open,
  onOpenChange,
  onSubmit,
  property,
  userRole,
}: PropertyDialogProps) => {
  const { clients } = useClients();
  const isUserRole = userRole === 'user';
  const [uploading, setUploading] = useState(false);
  const [propertyPlanUrl, setPropertyPlanUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    etaj: string;
    nrAp: string;
    tipCom: string;
    mpUtili: number;
    pretCuTva: number;
    avans50: number;
    avans80: number;
    nume: string;
    contact: string;
    agent: string;
    finisaje: string;
    observatii: string;
    status: "disponibil" | "rezervat" | "vandut";
    client_id?: string;
    property_plan_url?: string;
  }>({
    etaj: "",
    nrAp: "",
    tipCom: "",
    mpUtili: 0,
    pretCuTva: 0,
    avans50: 0,
    avans80: 0,
    nume: "",
    contact: "",
    agent: "",
    finisaje: "",
    observatii: "",
    status: "disponibil",
    client_id: undefined,
    property_plan_url: undefined,
  });

  useEffect(() => {
    if (property) {
      setFormData({
        etaj: property.etaj,
        nrAp: property.nrAp,
        tipCom: property.tipCom,
        mpUtili: property.mpUtili,
        pretCuTva: property.pretCuTva,
        avans50: property.avans50,
        avans80: property.avans80,
        nume: property.nume,
        contact: property.contact,
        agent: property.agent,
        finisaje: property.finisaje,
        observatii: property.observatii,
        status: property.status,
        client_id: property.client_id,
        property_plan_url: property.property_plan_url,
      });
      setPropertyPlanUrl(property.property_plan_url || null);
    } else {
      setFormData({
        etaj: "",
        nrAp: "",
        tipCom: "",
        mpUtili: 0,
        pretCuTva: 0,
        avans50: 0,
        avans80: 0,
        nume: "",
        contact: "",
        agent: "",
        finisaje: "",
        observatii: "",
        status: "disponibil",
        client_id: undefined,
        property_plan_url: undefined,
      });
      setPropertyPlanUrl(null);
    }
  }, [property, open]);

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

      setPropertyPlanUrl(publicUrl);
      setFormData({ ...formData, property_plan_url: publicUrl });
      toast.success('Plan încărcat cu succes');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Eroare la încărcarea fișierului');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePlan = async () => {
    if (!propertyPlanUrl) return;

    try {
      const fileName = propertyPlanUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('property-plans')
          .remove([fileName]);
      }
      setPropertyPlanUrl(null);
      setFormData({ ...formData, property_plan_url: undefined });
      toast.success('Plan șters cu succes');
    } catch (error) {
      console.error('Error removing file:', error);
      toast.error('Eroare la ștergerea fișierului');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (property) {
      onSubmit({ ...formData, property_plan_url: propertyPlanUrl || undefined, id: property.id });
    } else {
      onSubmit({ ...formData, property_plan_url: propertyPlanUrl || undefined });
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pretCuTva">Preț cu TVA 21% (EUR)</Label>
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
                disabled={isUserRole}
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
              <Label htmlFor="client_id">Client</Label>
              <Select
                value={formData.client_id || "none"}
                onValueChange={(value) =>
                  setFormData({ ...formData, client_id: value === "none" ? undefined : value })
                }
                disabled={isUserRole}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selectează clientul" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Fără client</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} - {client.phone}
                    </SelectItem>
                  ))}
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

          <div className="space-y-2">
            <Label htmlFor="property-plan">Plan Proprietate</Label>
            <div className="space-y-3">
              {propertyPlanUrl ? (
                <div className="relative border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <img 
                        src={propertyPlanUrl} 
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
                    id="property-plan"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <Label
                    htmlFor="property-plan"
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
                          Click pentru a încărca planul proprietății
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
