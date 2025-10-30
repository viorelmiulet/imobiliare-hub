import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, MessageSquare, User as UserIcon, Building, Check, ChevronsUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Property } from "@/types/property";
import { Client } from "@/hooks/useClients";
import { PropertyPlanViewer } from "./PropertyPlanViewer";
import { useState } from "react";

interface PropertyTableProps {
  properties: Property[];
  columns: string[];
  onEdit: (property: Property) => void;
  onStatusChange?: (id: string, status: string) => void;
  onClientChange?: (id: string, clientId: string | null) => void;
  onCommissionChange?: (id: string, commission: string) => void;
  onObservatiiChange?: (id: string, observatii: string) => void;
  clients?: Client[];
  userRole?: string;
  commissionType?: 'fixed' | 'percentage';
  commissionValue?: number;
  isAuthenticated?: boolean;
  selectedProperties?: Set<string>;
  onPropertySelectionChange?: (propertyId: string, selected: boolean) => void;
  complexId?: string;
}

export const PropertyTable = ({
  properties,
  onEdit,
  onStatusChange,
  onClientChange,
  onCommissionChange,
  onObservatiiChange,
  clients = [],
  userRole,
  commissionType = 'percentage',
  commissionValue = 2,
  isAuthenticated = true,
  selectedProperties = new Set(),
  onPropertySelectionChange,
  complexId,
}: PropertyTableProps) => {
  const isUserRole = userRole === 'user';
  const canSelect = isAuthenticated && !isUserRole && onPropertySelectionChange;
  const [openClientCombo, setOpenClientCombo] = useState<Record<string, boolean>>({});
  
  // Determine if this is Renew Chiajna complex
  const isRenewChiajna = complexId === 'complex-3';

  const getValue = (property: Property, key: string): any => {
    const map: Record<string, string[]> = {
      floor: ['Etaj', 'etaj', 'ETAJ'],
      apartment: ['Nr. ap.', 'nrAp', 'nr_ap', 'Nr Ap', 'nr ap'],
      type: ['Tip Apartament', 'tipCom', 'TIP COM', 'tip_apartament'],
      area: ['Suprafata', 'mpUtili', 'suprafata', 'mp'],
      creditPrice: ['Pret Credit', 'pretCuTva', 'pret', 'pret_credit', 'credit'],
      avans50: ['Avans 50%', 'avans50', 'avans_50'],
      cashPrice: ['Pret Cash', 'pretCash', 'pret_cash', 'avans80', 'avans_80'],
      status: ['Status', 'status', 'STATUS'],
      agent: ['Agent', 'agent'],
      commission: ['Comision', 'comision'],
      observations: ['Observatii', 'observatii'],
      corp: ['Corp', 'corp', 'CORP'],
    };
    const synonyms = map[key] || [key];
    for (const k of synonyms) {
      const v = (property as any)[k];
      if (v !== undefined && v !== null && String(v) !== '') return v;
    }
    return '';
  };

  const formatPrice = (value: any): string => {
    if (!value) return '-';
    const price = typeof value === 'number' ? value : parseFloat(String(value).replace(/[€\s]/g, '').replace(/,/g, ''));
    if (isNaN(price)) return '-';
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatArea = (value: any): string => {
    if (!value) return '-';
    const area = typeof value === 'number' ? value : parseFloat(String(value));
    if (isNaN(area)) return '-';
    return `${area.toFixed(2)} m²`;
  };

  const getStatusConfig = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'disponibil') return { label: 'Disponibil', color: 'bg-success/10 text-success border-success/20', dot: 'bg-success' };
    if (s === 'rezervat') return { label: 'Rezervat', color: 'bg-warning/10 text-warning border-warning/20', dot: 'bg-warning' };
    if (s === 'vandut') return { label: 'Vândut', color: 'bg-info/10 text-info border-info/20', dot: 'bg-info' };
    return { label: 'Disponibil', color: 'bg-success/10 text-success border-success/20', dot: 'bg-success' };
  };

  const calculateCommission = (property: Property, priceType: 'credit' | 'cash'): string => {
    if (commissionType === 'fixed') {
      return formatPrice(commissionValue);
    }
    const price = getValue(property, priceType === 'credit' ? 'creditPrice' : 'cashPrice');
    const priceNum = typeof price === 'number' ? price : parseFloat(String(price).replace(/[€\s]/g, '').replace(/,/g, ''));
    if (isNaN(priceNum)) return '-';
    return formatPrice(priceNum * (commissionValue / 100));
  };

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nu există proprietăți de afișat</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {properties.map((property) => {
        const status = getValue(property, 'status') || 'disponibil';
        const statusConfig = getStatusConfig(status);
        const client = clients.find(c => c.id === property.client_id);

        return (
          <Card
            key={property.id}
            className={`group p-5 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] space-y-4 ${
              selectedProperties.has(property.id) ? 'ring-2 ring-primary' : ''
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                {canSelect && (
                  <div className="pt-1">
                    <Checkbox
                      checked={selectedProperties.has(property.id)}
                      onCheckedChange={(checked) => 
                        onPropertySelectionChange(property.id, checked as boolean)
                      }
                      className="h-5 w-5"
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {getValue(property, 'floor')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">
                    Ap. {getValue(property, 'apartment')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {getValue(property, 'type')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <PropertyPlanViewer
                  imageUrl={getValue(property, 'property_plan_url') || getValue(property, 'plan') || getValue(property, 'planUrl') || getValue(property, 'imageUrl')}
                  propertyName={`Ap. ${getValue(property, 'apartment')}`}
                />
                {isAuthenticated && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(property)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <div>
              {onStatusChange && isAuthenticated ? (
                <Select
                  value={status}
                  onValueChange={(value) => onStatusChange(property.id, value)}
                  disabled={isUserRole}
                >
                  <SelectTrigger className="w-full h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponibil">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success" />
                        Disponibil
                      </div>
                    </SelectItem>
                    <SelectItem value="rezervat">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-warning" />
                        Rezervat
                      </div>
                    </SelectItem>
                    <SelectItem value="vandut">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-info" />
                        Vândut
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={`${statusConfig.color} w-full justify-center border`}>
                  <div className={`w-2 h-2 rounded-full ${statusConfig.dot} mr-2`} />
                  {statusConfig.label}
                </Badge>
              )}
            </div>

            {/* Details */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Suprafață:</span>
                <span className="font-medium">{formatArea(getValue(property, 'area'))}</span>
              </div>
              
              {isRenewChiajna ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Credit:</span>
                    <span className="font-semibold text-primary">
                      {formatPrice(getValue(property, 'creditPrice'))}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cash:</span>
                    <span className="font-semibold">
                      {formatPrice(getValue(property, 'cashPrice'))}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Credit:</span>
                    <span className="font-semibold text-primary">
                      {formatPrice(getValue(property, 'creditPrice'))}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avans 50%:</span>
                    <span className="font-semibold">
                      {formatPrice(getValue(property, 'avans50'))}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avans 80%:</span>
                    <span className="font-semibold">
                      {formatPrice(getValue(property, 'cashPrice'))}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Client & Agent */}
            {isAuthenticated && (
              <div className="space-y-2 pt-2 border-t">
                {onClientChange && (
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Client:</label>
                    <Popover 
                      open={openClientCombo[property.id]} 
                      onOpenChange={(open) => setOpenClientCombo(prev => ({ ...prev, [property.id]: open }))}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openClientCombo[property.id]}
                          className="w-full h-9 justify-between text-sm"
                          disabled={isUserRole}
                        >
                          {property.client_id 
                            ? clients.find(c => c.id === property.client_id)?.name || 'Selectează client'
                            : 'Fără client'
                          }
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[280px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Caută client..." />
                          <CommandList>
                            <CommandEmpty>Nu s-au găsit clienți.</CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                value="none"
                                onSelect={() => {
                                  onClientChange(property.id, null);
                                  setOpenClientCombo(prev => ({ ...prev, [property.id]: false }));
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    !property.client_id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <span className="text-muted-foreground">Fără client</span>
                              </CommandItem>
                              {clients.map((c) => (
                                <CommandItem
                                  key={c.id}
                                  value={c.name}
                                  onSelect={() => {
                                    onClientChange(property.id, c.id);
                                    setOpenClientCombo(prev => ({ ...prev, [property.id]: false }));
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      property.client_id === c.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {c.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                {getValue(property, 'agent') && (
                  <div className="flex items-center gap-2 text-sm">
                    <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Agent:</span>
                    <span className="font-medium">{getValue(property, 'agent')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Commission & Observations */}
            {isAuthenticated && (userRole === 'admin' || userRole === 'manager') && (
              <div className="flex gap-2 pt-2 border-t">
                {onCommissionChange && (
                  <Select
                    value={getValue(property, 'commission') ? 'current' : ''}
                    onValueChange={(value) => {
                      if (value === 'credit' || value === 'cash') {
                        const commission = calculateCommission(property, value as 'credit' | 'cash');
                        onCommissionChange(property.id, commission);
                      } else if (value === 'remove') {
                        onCommissionChange(property.id, '');
                      }
                    }}
                  >
                    <SelectTrigger className="flex-1 h-9 text-xs">
                      <SelectValue placeholder="Comision">
                        {getValue(property, 'commission') ? (
                          <span className="text-success font-medium">{getValue(property, 'commission')}</span>
                        ) : (
                          "Calc. comision"
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {commissionType === 'percentage' ? (
                        <>
                          <SelectItem value="credit">
                            Credit: {calculateCommission(property, 'credit')}
                          </SelectItem>
                          <SelectItem value="cash">
                            Cash: {calculateCommission(property, 'cash')}
                          </SelectItem>
                        </>
                      ) : (
                        <SelectItem value="credit">
                          Fix: {calculateCommission(property, 'credit')}
                        </SelectItem>
                      )}
                      {getValue(property, 'commission') && (
                        <SelectItem value="remove" className="text-destructive">
                          Șterge
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}

                {onObservatiiChange && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Observații</h4>
                        <Textarea
                          value={getValue(property, 'observations') || ''}
                          onChange={(e) => onObservatiiChange(property.id, e.target.value)}
                          placeholder="Adaugă observații..."
                          className="min-h-[100px] text-sm"
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
