import { useState, useEffect, useMemo, useCallback } from "react";
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
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ThemeToggle";
import { importComplex1Data } from "@/utils/importComplex1Data";
import { importViilor33Data } from "@/utils/importViilor33Data";
import { toast } from "sonner";

const ComplexDetails = () => {
  const { complexId } = useParams<{ complexId: string }>();
  const navigate = useNavigate();
  const { complexes, updateComplex, loading: complexesLoading } = useComplexes();
  const { properties, addProperty, updateProperty, deleteProperty, loading: propertiesLoading } = useProperties(complexId || "");
  const { clients } = useClients();
  const { profile, user } = useAuth();
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
        image: complex.image,
        commission_type: complex.commission_type,
        commission_value: complex.commission_value,
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
  const [isImporting, setIsImporting] = useState(false);

  const handleImportComplex1Data = async () => {
    if (complexId !== "complex-1") return;
    
    setIsImporting(true);
    try {
      await importComplex1Data();
      toast.success("Importul a fost finalizat cu succes! 119 proprietăți au fost încărcate.");
      // Refresh properties
      window.location.reload();
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Eroare la importul datelor");
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportViilor33Data = async () => {
    if (complexId !== "complex-viilor33") return;
    
    setIsImporting(true);
    try {
      const result = await importViilor33Data();
      toast.success(`Importul a fost finalizat cu succes! ${result.count} proprietăți au fost încărcate.`);
      // Refresh the page to reload all data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Eroare la importul datelor");
    } finally {
      setIsImporting(false);
    }
  };

  // ALL HOOKS MUST BE BEFORE ANY CONDITIONAL RETURNS
  const handleComplexUpdate = useCallback(async (updatedComplex: Complex) => {
    await updateComplex(updatedComplex.id, {
      name: updatedComplex.name,
      location: updatedComplex.location,
      description: updatedComplex.description,
      commission_type: updatedComplex.commission_type,
      commission_value: updatedComplex.commission_value,
    });
    setCurrentComplex(updatedComplex);
  }, [updateComplex]);

  // Memoized helper functions
  const getPropertyStatus = useCallback((property: Property): string => {
    return (property as any).status || (property as any).Status || (property as any).STATUS || 'disponibil';
  }, []);

  const getPropertyCommission = useCallback((property: Property): number => {
    // Extract commission from various possible keys and parse robustly
    const synonyms = ['Comision', 'comision'];
    let commissionValue = '';
    for (const key of synonyms) {
      const v = (property as any)[key];
      if (v !== undefined && v !== null && String(v).trim() !== '') {
        commissionValue = String(v);
        break;
      }
    }
    if (!commissionValue) return 0;

    // Normalize: remove NBSP and keep only digits, separators and minus
    let cleanStr = commissionValue
      .replace(/\u00A0/g, '')
      .replace(/[^0-9,.-]/g, '');

    const lastComma = cleanStr.lastIndexOf(',');
    const lastDot = cleanStr.lastIndexOf('.');

    if (lastComma !== -1 && lastDot !== -1) {
      // Decide decimal by the rightmost separator
      if (lastComma > lastDot) {
        // Comma is decimal: remove all dots (thousands), replace last comma with dot
        cleanStr = cleanStr.replace(/\./g, '');
        const parts = cleanStr.split(',');
        const decimal = parts.pop();
        cleanStr = parts.join('') + '.' + (decimal ?? '0');
      } else {
        // Dot is decimal: remove all commas (thousands)
        cleanStr = cleanStr.replace(/,/g, '');
      }
    } else if (lastComma !== -1) {
      // Only comma present: treat as decimal
      cleanStr = cleanStr.replace(/,/g, '.');
    } // else: only dot or integer

    const parsed = parseFloat(cleanStr);
    return isNaN(parsed) ? 0 : parsed;
  }, []);

  // Memoized filtered and sorted properties
  const filteredProperties = useMemo(() => {
    return properties
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
  }, [properties, searchTerm, selectedFloor, selectedType, selectedStatus, selectedCorp]);

  // Memoized statistics
  const statistics = useMemo(() => {
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
    
    // Calculate commissions per corp
    const corpNames = Array.from(
      new Set(
        properties
          .map(p => (p as any).corp || (p as any).CORP)
          .filter(Boolean)
      )
    ) as string[];
    
    const commissionsPerCorp = corpNames.reduce((acc, corp) => {
      const corpProperties = properties.filter(p => ((p as any).corp || (p as any).CORP) === corp);
      const corpTotal = corpProperties.reduce((sum, p) => sum + getPropertyCommission(p), 0);
      acc[corp] = corpTotal;
      return acc;
    }, {} as Record<string, number>);

    return {
      availableCount,
      reservedCount,
      soldCount,
      totalCommissions,
      corpNames,
      commissionsPerCorp
    };
  }, [properties, getPropertyStatus, getPropertyCommission]);

  const handleAddProperty = useCallback(async (property: Omit<Property, "id">) => {
    const newProperty = {
      ...property,
      id: Date.now().toString(),
    };
    await addProperty(newProperty);
    setIsDialogOpen(false);
  }, [addProperty]);

  const handleEditProperty = useCallback(async (property: Property) => {
    await updateProperty(property);
    setEditingProperty(null);
    setIsDialogOpen(false);
  }, [updateProperty]);

  const handleDeleteProperty = useCallback(async (id: string) => {
    await deleteProperty(id);
  }, [deleteProperty]);

  const handleStatusChange = useCallback(async (id: string, status: string) => {
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
  }, [properties, updateProperty]);

  const handleClientChange = useCallback(async (id: string, clientId: string | null) => {
    const property = properties.find(p => p.id === id);
    if (property) {
      const updatedProperty = {
        ...property,
        client_id: clientId
      };
      await updateProperty(updatedProperty);
    }
  }, [properties, updateProperty]);

  const handleCommissionChange = useCallback(async (id: string, commission: string) => {
    const property = properties.find(p => p.id === id);
    if (property) {
      const updatedProperty = {
        ...property,
        Comision: commission,
        comision: commission
      };
      await updateProperty(updatedProperty);
    }
  }, [properties, updateProperty]);

  const handleObservatiiChange = useCallback(async (id: string, observatii: string) => {
    const property = properties.find(p => p.id === id);
    if (property) {
      const updatedProperty = {
        ...property,
        Observatii: observatii,
        observatii: observatii
      };
      await updateProperty(updatedProperty);
    }
  }, [properties, updateProperty]);

  const openEditDialog = useCallback((property: Property) => {
    setEditingProperty(property);
    setIsDialogOpen(true);
  }, []);

  const handleExcelImport = useCallback(async (importedProperties: Property[], importedColumns: string[]) => {
    for (const property of importedProperties) {
      await addProperty(property);
    }
    setColumns(importedColumns);
  }, [addProperty]);

  // Show loading if hooks are loading OR if we're waiting for currentComplex to be set
  const isStillLoading = complexesLoading || propertiesLoading || (!currentComplex && complexes.length > 0);
  
  if (isStillLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-center text-muted-foreground">Se încarcă...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            {!user && (
              <Button
                variant="outline"
                onClick={() => navigate('/auth')}
                className="gap-2 shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
              >
                Autentificare
              </Button>
            )}
            {user && (
              <>
                {complexId === "complex-1" && (
                  <Button
                    variant="outline"
                    onClick={handleImportComplex1Data}
                    disabled={isImporting}
                    className="gap-2 shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
                  >
                    <FileUp className="h-4 w-4" />
                    {isImporting ? "Se importă..." : "Import complet"}
                  </Button>
                )}
                {complexId === "complex-viilor33" && (
                  <Button
                    variant="outline"
                    onClick={handleImportViilor33Data}
                    disabled={isImporting}
                    className="gap-2 shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
                  >
                    <FileUp className="h-4 w-4" />
                    {isImporting ? "Se importă..." : "Import date"}
                  </Button>
                )}
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
              </>
            )}
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
                {statistics.availableCount}
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
                {statistics.reservedCount}
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
              <div className="text-2xl sm:text-3xl font-bold text-info">{statistics.soldCount}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent shadow-md hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Comisioane
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statistics.corpNames.length > 1 ? (
                <div className="space-y-2">
                  {statistics.corpNames.map(corp => (
                    <div key={corp} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">{corp}:</span>
                      <span className="text-lg font-bold text-accent">
                        {new Intl.NumberFormat('ro-RO', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(statistics.commissionsPerCorp[corp])} EUR
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="text-sm font-semibold">Total:</span>
                    <span className="text-xl font-bold text-accent">
                      {new Intl.NumberFormat('ro-RO', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(statistics.totalCommissions)} EUR
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-xl sm:text-2xl font-bold text-accent">
                  {new Intl.NumberFormat('ro-RO', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(statistics.totalCommissions)}
                  {` EUR`}
                </div>
              )}
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
            {properties.some(p => (p as any).corp || (p as any).CORP) ? (
              (() => {
                const corpNames = Array.from(
                  new Set(
                    properties
                      .map(p => (p as any).corp || (p as any).CORP)
                      .filter(Boolean)
                  )
                ) as string[];
                const firstCorp = corpNames[0] || 'all';
                return (
                  <Tabs defaultValue={firstCorp} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      {corpNames.map((corp) => (
                        <TabsTrigger key={corp} value={corp} className="gap-2">
                          <Building2 className="h-4 w-4" />
                          {corp} ({filteredProperties.filter(p => ((p as any).corp || (p as any).CORP) === corp).length})
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {corpNames.map((corp) => (
                      <TabsContent key={corp} value={corp}>
                        <PropertyTable
                          properties={filteredProperties.filter(p => ((p as any).corp || (p as any).CORP) === corp)}
                          columns={columns}
                          onEdit={openEditDialog}
                          onStatusChange={handleStatusChange}
                          onClientChange={handleClientChange}
                          onCommissionChange={handleCommissionChange}
                          onObservatiiChange={handleObservatiiChange}
                          clients={clients}
                          userRole={profile?.role}
                          commissionType={currentComplex?.commission_type}
                          commissionValue={currentComplex?.commission_value}
                          isAuthenticated={!!user}
                        />
                      </TabsContent>
                    ))}
                  </Tabs>
                );
              })()
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
                userRole={profile?.role}
                commissionType={currentComplex?.commission_type}
                commissionValue={currentComplex?.commission_value}
                isAuthenticated={!!user}
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
          userRole={profile?.role}
        />

        {/* Edit Complex Dialog */}
        {currentComplex && (
          <ComplexEditDialog
            open={isComplexEditOpen}
            onOpenChange={setIsComplexEditOpen}
            onSubmit={handleComplexUpdate}
            complex={currentComplex}
          />
        )}

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
