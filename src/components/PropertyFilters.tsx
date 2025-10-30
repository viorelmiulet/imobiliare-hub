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
import { Filter, X } from "lucide-react";
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

  const hasActiveFilters = selectedFloor !== 'toate' || selectedType !== 'toate' || 
                          selectedStatus !== 'toate' || selectedCorp !== 'toate';

  const resetFilters = () => {
    onFloorChange('toate');
    onTypeChange('toate');
    onStatusChange('toate');
    onCorpChange('toate');
  };

  const filterContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {uniqueCorps.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Corp</Label>
            <Select value={selectedCorp} onValueChange={onCorpChange}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Toate" />
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
          <Label className="text-xs font-medium text-muted-foreground">Etaj</Label>
          <Select value={selectedFloor} onValueChange={onFloorChange}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Toate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="toate">Toate etajele</SelectItem>
              {uniqueFloors.map((floor, index) => (
                <SelectItem key={`floor-${floor}-${index}`} value={floor}>
                  {floor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Tip</Label>
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Toate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="toate">Toate tipurile</SelectItem>
              {uniqueTypes.map((type, index) => (
                <SelectItem key={`type-${type}-${index}`} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Status</Label>
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Toate" />
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

      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetFilters}
          className="w-full md:w-auto gap-2"
        >
          <X className="h-4 w-4" />
          Resetează filtre
        </Button>
      )}
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

  return filterContent;
};
