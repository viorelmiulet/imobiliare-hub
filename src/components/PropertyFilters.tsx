import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { Property } from "@/types/property";
import { useIsMobile } from "@/hooks/use-mobile";

interface PropertyFiltersProps {
  selectedFloor: string;
  selectedType: string;
  selectedStatus: string;
  selectedCorp: string;
  onFloorChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCorpChange: (value: string) => void;
  properties: Property[];
}

export const PropertyFilters = ({
  selectedFloor,
  selectedType,
  selectedStatus,
  selectedCorp,
  onFloorChange,
  onTypeChange,
  onStatusChange,
  onCorpChange,
  properties,
}: PropertyFiltersProps) => {
  const isMobile = useIsMobile();
  const uniqueFloors = Array.from(new Set(properties.map((p) => p.etaj)));
  const uniqueTypes = Array.from(new Set(properties.map((p) => p.tipCom)));
  const uniqueCorps = Array.from(new Set(properties.map((p) => p.corp).filter(Boolean))) as string[];

  const filterContent = (
    <div className="grid grid-cols-1 gap-4">
      {uniqueCorps.length > 0 && (
        <div className="space-y-2">
          <Label>Corp</Label>
          <Select value={selectedCorp} onValueChange={onCorpChange}>
            <SelectTrigger>
              <SelectValue placeholder="Toate corpurile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="toate">Toate corpurile</SelectItem>
              {uniqueCorps.map((corp) => (
                <SelectItem key={corp} value={corp}>
                  {corp}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label>Etaj</Label>
        <Select value={selectedFloor} onValueChange={onFloorChange}>
          <SelectTrigger>
            <SelectValue placeholder="Toate etajele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="toate">Toate etajele</SelectItem>
            {uniqueFloors.map((floor) => (
              <SelectItem key={floor} value={floor}>
                {floor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Tip Compartimentare</Label>
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Toate tipurile" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="toate">Toate tipurile</SelectItem>
            {uniqueTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Toate statusurile" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="toate">Toate statusurile</SelectItem>
            <SelectItem value="disponibil">Disponibil</SelectItem>
            <SelectItem value="rezervat">Rezervat</SelectItem>
            <SelectItem value="vandut">Vândut</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full">
            <Filter className="h-4 w-4 mr-2" />
            Filtre
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh]">
          <SheetHeader>
            <SheetTitle>Filtrează Proprietăți</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {filterContent}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {filterContent}
    </div>
  );
};
