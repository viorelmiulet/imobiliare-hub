import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Plus, Search, ArrowLeft, Settings, FileUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyTable } from "@/components/PropertyTable";
import { PropertyDialog } from "@/components/PropertyDialog";
import { PropertyFilters } from "@/components/PropertyFilters";
import { ComplexEditDialog } from "@/components/ComplexEditDialog";
import { ExcelImportDialog } from "@/components/ExcelImportDialog";
import { Property } from "@/types/property";
import { Complex } from "@/types/complex";
import { useProperties } from "@/hooks/useProperties";
import { useComplexes } from "@/hooks/useComplexes";
import { useClients } from "@/hooks/useClients";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ThemeToggle";

const ComplexDetails = () => {
  const { complexId } = useParams<{ complexId: string }>();
  const navigate = useNavigate();
  const { complexes } = useComplexes();
  const { properties, addProperty, updateProperty, deleteProperty } = useProperties(complexId || "");
  const { clients } = useClients();
  const isMobile = useIsMobile();
  
  const [currentComplex, setCurrentComplex] = useState<Complex | undefined>();
  const [columns, setColumns] = useState<string[]>([
    'Etaj', 'Nr. ap.', 'Tip Apartament', 'Suprafata', 'Pret Credit', 
    'Pret Cash', 'Status', 'Client', 'Agent', 'Comision', 'Observatii'
  ]);

  useEffect(() => {
    const complex = complexes.find((c) => c.id === complexId);
    if (complex) {
      setCurrentComplex({
        id: complex.id,
        name: complex.name,
        location: complex.location,
        description: complex.description,
        totalProperties: complex.total_properties,
        availableProperties: complex.available_properties,
        image: complex.image
      });
    }
  }, [complexes, complexId]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFloor, setSelectedFloor] = useState<string>("toate");
  const [selectedType, setSelectedType] = useState<string>("toate");
  const [selectedStatus, setSelectedStatus] = useState<string>("toate");
  const [selectedCorp, setSelectedCorp] = useState<string>("toate");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isComplexEditOpen, setIsComplexEditOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  if (!currentComplex) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Complex negăsit</p>
            <Button onClick={() => navigate("/")} className="mt-4 w-full">
              Înapoi la Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleComplexUpdate = async (updatedComplex: Complex) => {
    setCurrentComplex(updatedComplex);
    // Update in database will be handled by useComplexes hook
  };

  const filteredProperties = properties
    .filter((property) => {
      const matchesSearch = searchTerm === "" || Object.values(property).some(value => 
        value && String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesFloor =
        selectedFloor === "toate" || property.etaj === selectedFloor || property.ETAJ === selectedFloor;

      const matchesType =
        selectedType === "toate" || property.tipCom === selectedType || property['TIP COM'] === selectedType;

      const matchesStatus =
        selectedStatus === "toate" || property.status === selectedStatus || property.STATUS === selectedStatus;

      const matchesCorp =
        selectedCorp === "toate" || property.corp === selectedCorp || property.CORP === selectedCorp;

      return matchesSearch && matchesFloor && matchesType && matchesStatus && matchesCorp;
    })
    .sort((a, b) => {
      // Sort by floor order
      const floorOrder: Record<string, number> = {
        'DEMISOL': 0,
        'PARTER': 1,
        'P': 1,
        'ETAJ 1': 2,
        'E1': 2,
        'ETAJ 2': 3,
        'E2': 3,
        'ETAJ 3': 4,
        'E3': 4,
        'ETAJ 4': 5,
        'E4': 5,
        'ETAJ 5': 6,
        'E5': 6,
        'ETAJ 6': 7,
        'E6': 7,
      };

      const etajA = (a.etaj || a.ETAJ || a.Etaj || '').toUpperCase();
      const etajB = (b.etaj || b.ETAJ || b.Etaj || '').toUpperCase();
      const floorA = floorOrder[etajA] ?? 999;
      const floorB = floorOrder[etajB] ?? 999;

      if (floorA !== floorB) {
        return floorA - floorB;
      }

      // Then sort by apartment number
      const getApNumber = (prop: Property): number => {
        const nrAp = prop.nrAp || prop['Nr. ap.'] || prop['nr_ap'] || '';
        const match = String(nrAp).match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      };

      return getApNumber(a) - getApNumber(b);
    });

  const getPropertyStatus = (property: Property): string => {
    return (property as any).status || (property as any).Status || (property as any).STATUS || 'disponibil';
  };

  const getPropertyCommission = (property: Property): number => {
    const commission = (property as any).Comision || (property as any).comision || '';
    if (!commission) return 0;
    // Extract numeric value from commission string (e.g., "1.234,56 €" -> 1234.56)
    const cleanStr = String(commission).replace(/[€\s]/g, '').replace(/\./g, '').replace(/,/g, '.');
    return parseFloat(cleanStr) || 0;
  };

  const availableCount = properties.filter((p) => {
    const status = getPropertyStatus(p);
    return status.toLowerCase() === "disponibil";
  }).length;
  const reservedCount = properties.filter((p) => {
    const status = getPropertyStatus(p);
    return status.toLowerCase() === "rezervat";
  }).length;
  const soldCount = properties.filter((p) => {
    const status = getPropertyStatus(p);
    return status.toLowerCase() === "vandut";
  }).length;
  const totalCommissions = properties.reduce((sum, p) => sum + getPropertyCommission(p), 0);

  const handleAddProperty = async (property: Omit<Property, "id">) => {
    const newProperty = {
      ...property,
      id: Date.now().toString(),
    };
    await addProperty(newProperty);
    setIsDialogOpen(false);
  };

  const handleEditProperty = async (property: Property) => {
    await updateProperty(property);
    setEditingProperty(null);
    setIsDialogOpen(false);
  };

  const handleDeleteProperty = async (id: string) => {
    await deleteProperty(id);
  };

  const handleStatusChange = async (id: string, status: string) => {
    const property = properties.find(p => p.id === id);
    if (property) {
      const updatedProperty = {
        ...property,
        status: status as "disponibil" | "rezervat" | "vandut"
      };
      // Update all possible status field variations
      (updatedProperty as any)['Status'] = status;
      (updatedProperty as any)['STATUS'] = status;
      await updateProperty(updatedProperty);
    }
  };

  const handleClientChange = async (id: string, clientId: string | null) => {
    const property = properties.find(p => p.id === id);
    if (property) {
      const updatedProperty = {
        ...property,
        client_id: clientId
      };
      await updateProperty(updatedProperty);
    }
  };

  const handleCommissionChange = async (id: string, commission: string) => {
    const property = properties.find(p => p.id === id);
    if (property) {
      const updatedProperty = {
        ...property,
        Comision: commission,
        comision: commission
      };
      await updateProperty(updatedProperty);
    }
  };

  const handleObservatiiChange = async (id: string, observatii: string) => {
    const property = properties.find(p => p.id === id);
    if (property) {
      const updatedProperty = {
        ...property,
        Observatii: observatii,
        observatii: observatii
      };
      await updateProperty(updatedProperty);
    }
  };

  const openEditDialog = (property: Property) => {
    setEditingProperty(property);
    setIsDialogOpen(true);
  };

  const handleExcelImport = async (importedProperties: Property[], importedColumns: string[]) => {
    for (const property of importedProperties) {
      await addProperty(property);
    }
    setColumns(importedColumns);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header with Back Button */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/")}
              className="hover:bg-primary hover:text-primary-foreground transition-all shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="p-3 bg-gradient-to-br from-primary to-info rounded-xl shadow-lg shrink-0">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent truncate">
                {currentComplex.name}
              </h1>
              <p className="text-sm text-muted-foreground truncate">{currentComplex.location}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto items-stretch sm:items-center">
            <ThemeToggle />
            <Button
              variant="outline"
              onClick={() => setIsComplexEditOpen(true)}
              className="gap-2 shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Editează Complex</span>
              <span className="sm:hidden">Complex</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsImportDialogOpen(true)}
              className="gap-2 shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
            >
              <FileUp className="h-4 w-4" />
              <span className="hidden sm:inline">Importă Excel</span>
              <span className="sm:hidden">Import</span>
            </Button>
            <Button
              onClick={() => {
                setEditingProperty(null);
                setIsDialogOpen(true);
              }}
              className="gap-2 shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Adaugă
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card className="border-l-4 border-l-primary shadow-md hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Proprietăți
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{properties.length}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success shadow-md hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Disponibile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-success">
                {availableCount}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning shadow-md hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rezervate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-warning">
                {reservedCount}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-info shadow-md hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Vândute
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-info">{soldCount}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent shadow-md hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Comisioane
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-accent">
                {new Intl.NumberFormat('ro-RO', {
                  style: 'currency',
                  currency: 'EUR',
                  minimumFractionDigits: 2,
                }).format(totalCommissions)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>
              Filtre și Căutare
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Caută după număr apartament, nume, agent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <PropertyFilters
              selectedFloor={selectedFloor}
              selectedType={selectedType}
              selectedStatus={selectedStatus}
              selectedCorp={selectedCorp}
              onFloorChange={setSelectedFloor}
              onTypeChange={setSelectedType}
              onStatusChange={setSelectedStatus}
              onCorpChange={setSelectedCorp}
              properties={properties}
            />
          </CardContent>
        </Card>

        {/* Properties Table with Corps Tabs (conditional) */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>
              Proprietăți
            </CardTitle>
          </CardHeader>
          <CardContent>
            {properties.some(p => p.corp) ? (
              <Tabs defaultValue="corp1" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="corp1" className="gap-2">
                    <Building2 className="h-4 w-4" />
                    Corp 1 ({filteredProperties.filter(p => p.corp === "CORP 1").length})
                  </TabsTrigger>
                  <TabsTrigger value="corp2" className="gap-2">
                    <Building2 className="h-4 w-4" />
                    Corp 2 ({filteredProperties.filter(p => p.corp === "CORP 2").length})
                  </TabsTrigger>
                </TabsList>
              <TabsContent value="corp1">
                <PropertyTable
                  properties={filteredProperties.filter(p => p.corp === "CORP 1")}
                  columns={columns}
                  onEdit={openEditDialog}
                  onStatusChange={handleStatusChange}
                  onClientChange={handleClientChange}
                  onCommissionChange={handleCommissionChange}
                  onObservatiiChange={handleObservatiiChange}
                  clients={clients}
                />
              </TabsContent>
              <TabsContent value="corp2">
                <PropertyTable
                  properties={filteredProperties.filter(p => p.corp === "CORP 2")}
                  columns={columns}
                  onEdit={openEditDialog}
                  onStatusChange={handleStatusChange}
                  onClientChange={handleClientChange}
                  onCommissionChange={handleCommissionChange}
                  onObservatiiChange={handleObservatiiChange}
                  clients={clients}
                />
              </TabsContent>
              </Tabs>
            ) : (
              <PropertyTable
                properties={filteredProperties}
                columns={columns}
                onEdit={openEditDialog}
                onStatusChange={handleStatusChange}
                onClientChange={handleClientChange}
                onCommissionChange={handleCommissionChange}
                onObservatiiChange={handleObservatiiChange}
                clients={clients}
              />
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Property Dialog */}
        <PropertyDialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setEditingProperty(null);
          }}
          onSubmit={
            editingProperty
              ? handleEditProperty
              : (handleAddProperty as any)
          }
          property={editingProperty}
        />

        {/* Edit Complex Dialog */}
        <ComplexEditDialog
          open={isComplexEditOpen}
          onOpenChange={setIsComplexEditOpen}
          onSubmit={handleComplexUpdate}
          complex={currentComplex}
        />

        {/* Excel Import Dialog */}
        <ExcelImportDialog
          open={isImportDialogOpen}
          onOpenChange={setIsImportDialogOpen}
          complexId={complexId || ""}
          onImport={handleExcelImport}
        />
      </div>
    </div>
  );
};

export default ComplexDetails;
