import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Property } from "@/types/property";
import { useIsMobile } from "@/hooks/use-mobile";
import { Client } from "@/hooks/useClients";

interface PropertyTableProps {
  properties: Property[];
  columns: string[];
  onEdit: (property: Property) => void;
  onStatusChange?: (id: string, status: string) => void;
  onClientChange?: (id: string, clientId: string | null) => void;
  clients?: Client[];
}

export const PropertyTable = ({
  properties,
  columns,
  onEdit,
  onStatusChange,
  onClientChange,
  clients = [],
}: PropertyTableProps) => {
  const isMobile = useIsMobile();

  // Resolve values for both old (label-based) and new (key-based) datasets
  const getValue = (property: Property, columnName: string): any => {
    const map: Record<string, string[]> = {
      'Etaj': ['Etaj', 'etaj', 'ETAJ'],
      'Nr. ap.': ['Nr. ap.', 'nrAp', 'nr_ap', 'Nr Ap', 'nr ap'],
      'Tip Apartament': ['Tip Apartament', 'tipCom', 'TIP COM', 'tip_apartament'],
      'Suprafata': ['Suprafata', 'mpUtili', 'suprafata', 'mp'],
      'Pret Credit': ['Pret Credit', 'pretCuTva', 'pret', 'pret_credit'],
      'Pret Cash': ['Pret Cash', 'pretCash', 'pret_cash', 'avans80'],
      'Client': ['Client', 'clientName', 'nume'],
      'Agent': ['Agent', 'agent'],
      'Comision': ['Comision', 'comision'],
      'Observatii': ['Observatii', 'observatii'],
      'Status': ['Status', 'status', 'STATUS'],
      'Corp': ['Corp', 'corp', 'CORP'],
    };
    const synonyms = map[columnName] || [columnName];
    for (const key of synonyms) {
      const v = (property as any)[key];
      if (v !== undefined && v !== null && String(v) !== '') return v;
    }
    return '';
  };

  const formatValue = (value: any, columnName: string): string => {
    if (value === null || value === undefined || value === '') return '-';

    if (typeof value === 'number' &&
        (columnName.toLowerCase().includes('pret') ||
         columnName.toLowerCase().includes('avans') ||
         columnName.toLowerCase().includes('price'))) {
      return new Intl.NumberFormat('ro-RO', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
      }).format(value);
    }

    if (typeof value === 'number' &&
        (columnName.toLowerCase().includes('mp') ||
         columnName.toLowerCase().includes('suprafata'))) {
      return value.toFixed(2);
    }

    return String(value);
  };

  const parsePrice = (price: any): number => {
    if (!price && price !== 0) return 0;
    if (typeof price === 'number') return price;
    const cleanStr = String(price).replace(/[€\s]/g, '').replace(/,/g, '');
    return parseFloat(cleanStr) || 0;
  };

  const calculateCommission = (property: Property, priceType: 'credit' | 'cash'): string => {
    const priceValue = priceType === 'credit'
      ? getValue(property, 'Pret Credit')
      : getValue(property, 'Pret Cash');
    const price = parsePrice(priceValue);
    const commission = price * 0.02;
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(commission);
  };

  const renderCommissionCell = (property: Property, columnName: string) => {
    const currentCommission = getValue(property, columnName);
    
    // If commission already exists and is not empty, just display it
    if (currentCommission && String(currentCommission).trim() !== '') {
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium text-success">{currentCommission}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (onEdit) {
                onEdit({
                  ...property,
                  [columnName]: ''
                });
              }
            }}
            className="h-7 w-7 p-0 hover:bg-destructive hover:text-destructive-foreground"
            title="Șterge comision"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      );
    }

    // If commission is empty, show calculator
    return (
      <Select
        onValueChange={(value) => {
          const commission = calculateCommission(property, value as 'credit' | 'cash');
          // Update property with calculated commission
          if (onEdit) {
            onEdit({
              ...property,
              [columnName]: commission
            });
          }
        }}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Calculează..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="credit">
            <div className="flex flex-col">
              <span className="font-medium">Din Credit</span>
              <span className="text-xs text-muted-foreground">
                2% = {calculateCommission(property, 'credit')}
              </span>
            </div>
          </SelectItem>
          <SelectItem value="cash">
            <div className="flex flex-col">
              <span className="font-medium">Din Cash</span>
              <span className="text-xs text-muted-foreground">
                2% = {calculateCommission(property, 'cash')}
              </span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    );
  };

  // Mobile card view
  if (isMobile) {
    return (
      <div className="space-y-4">
        {properties.length === 0 ? (
          <Card>
            <CardContent className="text-center text-muted-foreground py-8">
              Nu există proprietăți de afișat
            </CardContent>
          </Card>
        ) : (
          properties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">
                    Ap. {getValue(property, 'Nr. ap.')}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(property)}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {columns.filter(col => col !== 'id' && col !== 'Nr. ap.').map((column) => (
                  <div key={`${property.id}-${column}`} className="flex justify-between items-center py-1 border-b last:border-0">
                    <span className="text-sm text-muted-foreground font-medium">{column}:</span>
                    <span className="text-sm font-semibold">
                      {column.toLowerCase().includes('status') && onStatusChange ? (
                        <Select
                          value={getValue(property, column) || 'disponibil'}
                          onValueChange={(value) => onStatusChange(property.id, value)}
                        >
                          <SelectTrigger className="w-[130px] h-8">
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
                      ) : column.toLowerCase() === 'client' && onClientChange ? (
                        <Select
                          value={property.client_id || 'none'}
                          onValueChange={(value) => onClientChange(property.id, value === 'none' ? null : value)}
                        >
                          <SelectTrigger className="w-[150px] h-8">
                            <SelectValue placeholder="Selectează client" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Fără client</SelectItem>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : column.toLowerCase().includes('comision') ? (
                        renderCommissionCell(property, column)
                      ) : (
                        formatValue(getValue(property, column), column)
                      )}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  }

  // Desktop table view
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {columns.filter(col => col !== 'id').map((column) => (
              <TableHead key={column} className="font-semibold">
                {column}
              </TableHead>
            ))}
            <TableHead className="font-semibold text-right">Acțiuni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="text-center text-muted-foreground py-8"
              >
                Nu există proprietăți de afișat
              </TableCell>
            </TableRow>
          ) : (
            properties.map((property) => (
              <TableRow
                key={property.id}
                className="hover:bg-muted/30 transition-colors"
              >
                {columns.filter(col => col !== 'id').map((column) => (
                  <TableCell key={`${property.id}-${column}`}>
                    {column.toLowerCase().includes('status') && onStatusChange ? (
                      <Select
                        value={getValue(property, column) || 'disponibil'}
                        onValueChange={(value) => onStatusChange(property.id, value)}
                      >
                        <SelectTrigger className="w-[130px]">
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
                    ) : column.toLowerCase() === 'client' && onClientChange ? (
                      <Select
                        value={property.client_id || 'none'}
                        onValueChange={(value) => onClientChange(property.id, value === 'none' ? null : value)}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Selectează client" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Fără client</SelectItem>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : column.toLowerCase().includes('comision') ? (
                      renderCommissionCell(property, column)
                    ) : (
                      formatValue(getValue(property, column), column)
                    )}
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(property)}
                    className="hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
