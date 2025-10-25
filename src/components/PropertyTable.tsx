import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { Property } from "@/types/property";

interface PropertyTableProps {
  properties: Property[];
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
}

export const PropertyTable = ({
  properties,
  onEdit,
  onDelete,
}: PropertyTableProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "disponibil":
        return (
          <Badge className="bg-success text-success-foreground">
            Disponibil
          </Badge>
        );
      case "rezervat":
        return (
          <Badge className="bg-warning text-warning-foreground">
            Rezervat
          </Badge>
        );
      case "vandut":
        return (
          <Badge className="bg-info text-info-foreground">Vândut</Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    if (!price) return "-";
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Etaj</TableHead>
            <TableHead className="font-semibold">Nr. Ap</TableHead>
            <TableHead className="font-semibold">Tip Com</TableHead>
            <TableHead className="font-semibold text-right">MP Utili</TableHead>
            <TableHead className="font-semibold text-right">
              Preț cu TVA 21%
            </TableHead>
            <TableHead className="font-semibold text-right">
              Avans 50%
            </TableHead>
            <TableHead className="font-semibold text-right">
              Avans 80%
            </TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Nume</TableHead>
            <TableHead className="font-semibold">Contact</TableHead>
            <TableHead className="font-semibold">Agent</TableHead>
            <TableHead className="font-semibold">Observații</TableHead>
            <TableHead className="font-semibold text-right">Acțiuni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={13}
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
                <TableCell className="font-medium">{property.etaj}</TableCell>
                <TableCell className="font-medium">{property.nrAp}</TableCell>
                <TableCell>{property.tipCom}</TableCell>
                <TableCell className="text-right">
                  {property.mpUtili.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatPrice(property.pretCuTva)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatPrice(property.avans50)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatPrice(property.avans80)}
                </TableCell>
                <TableCell>{getStatusBadge(property.status)}</TableCell>
                <TableCell>{property.nume || "-"}</TableCell>
                <TableCell className="text-sm">{property.contact || "-"}</TableCell>
                <TableCell>{property.agent || "-"}</TableCell>
                <TableCell className="text-sm">{property.observatii || "-"}</TableCell>
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
