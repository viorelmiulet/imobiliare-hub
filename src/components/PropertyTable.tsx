import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Property } from "@/types/property";

interface PropertyTableProps {
  properties: Property[];
  columns: string[];
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
}

export const PropertyTable = ({
  properties,
  columns,
  onEdit,
  onDelete,
  onStatusChange,
}: PropertyTableProps) => {
  const formatValue = (value: any, columnName: string): string => {
    if (value === null || value === undefined || value === '') return '-';
    
    // Format prices (columns containing "pret", "avans", "price")
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
    
    // Format numbers with 2 decimals (for MP, surface area, etc)
    if (typeof value === 'number' && 
        (columnName.toLowerCase().includes('mp') || 
         columnName.toLowerCase().includes('suprafata'))) {
      return value.toFixed(2);
    }
    
    return String(value);
  };

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
                        value={property[column] || 'disponibil'}
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
                    ) : (
                      formatValue(property[column], column)
                    )}
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(property)}
                      className="hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(property.id)}
                      className="hover:bg-destructive hover:text-destructive-foreground transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
