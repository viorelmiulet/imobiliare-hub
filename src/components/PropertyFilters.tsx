import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Property } from "@/types/property";

interface PropertyFiltersProps {
  selectedFloor: string;
  selectedType: string;
  selectedStatus: string;
  onFloorChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  properties: Property[];
}

export const PropertyFilters = ({
  selectedFloor,
  selectedType,
  selectedStatus,
  onFloorChange,
  onTypeChange,
  onStatusChange,
  properties,
}: PropertyFiltersProps) => {
  const uniqueFloors = Array.from(new Set(properties.map((p) => p.etaj)));
  const uniqueTypes = Array.from(new Set(properties.map((p) => p.tipCom)));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
};
