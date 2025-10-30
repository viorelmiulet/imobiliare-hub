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
import { Filter, X, Check, ChevronsUpDown } from "lucide-react";
import { Property } from "@/types/property";
import { useIsMobile } from "@/hooks/use-mobile";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface PropertyFiltersProps {
  selectedFloor: string;
  selectedType: string;
  selectedStatus: string;
  selectedCorp: string;
  selectedClient: string;
  onFloorChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCorpChange: (value: string) => void;
  onClientChange: (value: string) => void;
  properties: Property[];
  clients?: Array<{ id: string; name: string }>;
}

export const PropertyFilters = ({
  selectedFloor,
  selectedType,
  selectedStatus,
  selectedCorp,
  selectedClient,
  onFloorChange,
  onTypeChange,
  onStatusChange,
  onCorpChange,
  onClientChange,
  properties,
  clients = [],
}: PropertyFiltersProps) => {
  const isMobile = useIsMobile();
  const [openClientCombo, setOpenClientCombo] = useState(false);
  const uniqueFloors = Array.from(new Set(properties.map((p) => p.etaj)));
  const uniqueTypes = Array.from(new Set(properties.map((p) => p.tipCom)));
  const uniqueCorps = Array.from(new Set(properties.map((p) => p.corp).filter(Boolean))) as string[];
  
  const getClientLabel = (value: string) => {
    if (value === 'toti') return 'Toți clienții';
    if (value === 'fara_client') return 'Fără client';
    const client = clients.find(c => c.id === value);
    return client?.name || 'Selectează client';
  };

  const hasActiveFilters = selectedFloor !== 'toate' || selectedType !== 'toate' || 
                          selectedStatus !== 'toate' || selectedCorp !== 'toate' || selectedClient !== 'toti';

  const resetFilters = () => {
    onFloorChange('toate');
    onTypeChange('toate');
    onStatusChange('toate');
    onCorpChange('toate');
    onClientChange('toti');
  };

  const filterContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Client</Label>
          <Popover open={openClientCombo} onOpenChange={setOpenClientCombo}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openClientCombo}
                className="w-full h-9 justify-between"
              >
                {getClientLabel(selectedClient)}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Caută client..." />
                <CommandList>
                  <CommandEmpty>Nu s-au găsit clienți.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="toti"
                      onSelect={() => {
                        onClientChange('toti');
                        setOpenClientCombo(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedClient === 'toti' ? "opacity-100" : "opacity-0"
                        )}
                      />
                      Toți clienții
                    </CommandItem>
                    <CommandItem
                      value="fara_client"
                      onSelect={() => {
                        onClientChange('fara_client');
                        setOpenClientCombo(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedClient === 'fara_client' ? "opacity-100" : "opacity-0"
                        )}
                      />
                      Fără client
                    </CommandItem>
                    {clients.map((client) => (
                      <CommandItem
                        key={client.id}
                        value={client.name}
                        onSelect={() => {
                          onClientChange(client.id);
                          setOpenClientCombo(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedClient === client.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {client.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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

  const desktopFilters = (
    <div className="flex items-center gap-2">
      {uniqueCorps.length > 0 && (
        <Select value={selectedCorp} onValueChange={onCorpChange}>
          <SelectTrigger className="h-10 w-[140px]">
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
      )}

      <Select value={selectedFloor} onValueChange={onFloorChange}>
        <SelectTrigger className="h-10 w-[140px]">
          <SelectValue placeholder="Etaj" />
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

      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="h-10 w-[140px]">
          <SelectValue placeholder="Tip" />
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

      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="h-10 w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="toate">Toate statusurile</SelectItem>
          <SelectItem value="disponibil">Disponibil</SelectItem>
          <SelectItem value="rezervat">Rezervat</SelectItem>
          <SelectItem value="vandut">Vândut</SelectItem>
        </SelectContent>
      </Select>

      <Popover open={openClientCombo} onOpenChange={setOpenClientCombo}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openClientCombo}
            className="h-10 w-[180px] justify-between"
          >
            {getClientLabel(selectedClient)}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Caută client..." />
            <CommandList>
              <CommandEmpty>Nu s-au găsit clienți.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value="toti"
                  onSelect={() => {
                    onClientChange('toti');
                    setOpenClientCombo(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedClient === 'toti' ? "opacity-100" : "opacity-0"
                    )}
                  />
                  Toți clienții
                </CommandItem>
                <CommandItem
                  value="fara_client"
                  onSelect={() => {
                    onClientChange('fara_client');
                    setOpenClientCombo(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedClient === 'fara_client' ? "opacity-100" : "opacity-0"
                    )}
                  />
                  Fără client
                </CommandItem>
                {clients.map((client) => (
                  <CommandItem
                    key={client.id}
                    value={client.name}
                    onSelect={() => {
                      onClientChange(client.id);
                      setOpenClientCombo(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedClient === client.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {client.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="icon"
          onClick={resetFilters}
          className="h-10 w-10"
          title="Resetează filtre"
        >
          <X className="h-4 w-4" />
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

  return desktopFilters;
};
