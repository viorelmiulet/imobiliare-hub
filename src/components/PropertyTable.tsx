import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
  const [manualCommissionOpen, setManualCommissionOpen] = useState<Record<string, boolean>>({});
  const [manualCommissionValue, setManualCommissionValue] = useState<string>('');
  
  // Determine complex type
  const isRenewChiajna = complexId === 'complex-3';
  const isViilor33 = complexId === 'complex-viilor33';

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

  // Group properties by floor
  const groupedByFloor = properties.reduce((acc, property) => {
    const floor = getValue(property, 'floor') || 'Fără etaj';
    if (!acc[floor]) {
      acc[floor] = [];
    }
    acc[floor].push(property);
    return acc;
  }, {} as Record<string, Property[]>);

  // Get sorted floor keys
  const getFloorOrder = (etajStr: string): number => {
    const etaj = String(etajStr).toUpperCase().trim();
    
    const floorOrder: Record<string, number> = {
      'DEMISOL': 0,
      'D': 0,
      'PARTER': 1,
      'P': 1,
      'ETAJ 1': 2,
      'E1': 2,
      '1': 2,
      'ETAJ 2': 3,
      'E2': 3,
      '2': 3,
      'ETAJ 3': 4,
      'E3': 4,
      '3': 4,
      'ETAJ 4': 5,
      'E4': 5,
      '4': 5,
      'ETAJ 5': 6,
      'E5': 6,
      '5': 6,
      'ETAJ 6': 7,
      'E6': 7,
      '6': 7,
      'ETAJ 7': 8,
      'E7': 8,
      '7': 8,
      'ETAJ 8': 9,
      'E8': 9,
      '8': 9,
      'ETAJ 9': 10,
      'E9': 10,
      '9': 10,
      'ETAJ 10': 11,
      'E10': 11,
      '10': 11,
    };
    
    if (floorOrder[etaj] !== undefined) {
      return floorOrder[etaj];
    }
    
    const match = etaj.match(/(?:ETAJ|E)\s*(\d+)/);
    if (match) {
      return parseInt(match[1]) + 1;
    }
    
    const numMatch = etaj.match(/^(\d+)$/);
    if (numMatch) {
      return parseInt(numMatch[1]) + 1;
    }
    
    return 999;
  };

  const sortedFloors = Object.keys(groupedByFloor).sort((a, b) => {
    return getFloorOrder(a) - getFloorOrder(b);
  });

  const normalizeFloorLabel = (floor: string): string => {
    const upper = floor.toUpperCase().trim();
    if (upper === 'D') return 'DEMISOL';
    if (upper === 'P') return 'PARTER';
    if (upper === 'E1' || upper === '1') return 'ETAJ 1';
    if (upper === 'E2' || upper === '2') return 'ETAJ 2';
    if (upper === 'E3' || upper === '3') return 'ETAJ 3';
    if (upper === 'E4' || upper === '4') return 'ETAJ 4';
    if (upper === 'E5' || upper === '5') return 'ETAJ 5';
    if (upper === 'E6' || upper === '6') return 'ETAJ 6';
    if (upper === 'E7' || upper === '7') return 'ETAJ 7';
    if (upper === 'E8' || upper === '8') return 'ETAJ 8';
    if (upper === 'E9' || upper === '9') return 'ETAJ 9';
    if (upper === 'E10' || upper === '10') return 'ETAJ 10';
    const match = upper.match(/E(\d+)/);
    if (match) return `ETAJ ${match[1]}`;
    return upper;
  };

  return (
    <div className="space-y-8">
      {sortedFloors.map((floor) => (
        <div key={floor} className="space-y-4 animate-fade-in">
          {/* Floor Header */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-primary/20"></div>
            </div>
            <div className="relative flex justify-start">
              <span className="bg-background pr-4 text-lg md:text-xl font-bold text-primary uppercase tracking-wide">
                {normalizeFloorLabel(floor)}
              </span>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {groupedByFloor[floor].map((property) => {
        const status = getValue(property, 'status') || 'disponibil';
        const statusConfig = getStatusConfig(status);
        const client = clients.find(c => c.id === property.client_id);

        return (
          <Card
            key={property.id}
            className={`group p-4 md:p-5 hover:shadow-lg transition-all duration-300 active:scale-[0.98] md:hover:scale-[1.02] space-y-3 md:space-y-4 touch-manipulation ${
              selectedProperties.has(property.id) ? 'ring-2 ring-primary' : ''
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2 md:gap-3">
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
              
              {isViilor33 ? (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Preț:</span>
                  <span className="font-semibold text-primary">
                    {formatPrice(getValue(property, 'creditPrice'))}
                  </span>
                </div>
              ) : isRenewChiajna ? (
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
                  <div className="flex-1 flex gap-1">
                    <Select
                      value={getValue(property, 'commission') ? 'current' : ''}
                      onValueChange={(value) => {
                        if (value === 'credit' || value === 'cash') {
                          const commission = calculateCommission(property, value as 'credit' | 'cash');
                          onCommissionChange(property.id, commission);
                        } else if (value === 'remove') {
                          onCommissionChange(property.id, '');
                        } else if (value === 'manual') {
                          setManualCommissionOpen(prev => ({ ...prev, [property.id]: true }));
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
                        <SelectItem value="manual">
                          Manual...
                        </SelectItem>
                        {getValue(property, 'commission') && (
                          <SelectItem value="remove" className="text-destructive">
                            Șterge
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    
                    <Popover 
                      open={manualCommissionOpen[property.id]}
                      onOpenChange={(open) => {
                        setManualCommissionOpen(prev => ({ ...prev, [property.id]: open }));
                        if (!open) setManualCommissionValue('');
                      }}
                    >
                      <PopoverTrigger asChild>
                        <div className="hidden" />
                      </PopoverTrigger>
                      <PopoverContent className="w-72 p-4" align="start">
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-sm font-medium">Introdu comision manual</label>
                            <p className="text-xs text-muted-foreground">Exemplu: 5000 sau 5.000 €</p>
                          </div>
                          <Input
                            type="text"
                            placeholder="ex: 5000 €"
                            value={manualCommissionValue}
                            onChange={(e) => setManualCommissionValue(e.target.value)}
                            className="h-9"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                if (manualCommissionValue.trim()) {
                                  onCommissionChange(property.id, manualCommissionValue.trim());
                                  setManualCommissionOpen(prev => ({ ...prev, [property.id]: false }));
                                  setManualCommissionValue('');
                                }
                              }}
                            >
                              Salvează
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setManualCommissionOpen(prev => ({ ...prev, [property.id]: false }));
                                setManualCommissionValue('');
                              }}
                            >
                              Anulează
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
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
        </div>
      ))}
    </div>
  );
};
