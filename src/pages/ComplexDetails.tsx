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
import { BulkActionsToolbar } from "@/components/BulkActionsToolbar";
import { BulkPlanUploadDialog } from "@/components/BulkPlanUploadDialog";
import { BulkCommissionDialog } from "@/components/BulkCommissionDialog";
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
import { clearRenewChiajnaData } from "@/utils/clearRenewChiajnaData";
import { importRenewChiajna2Data } from "@/utils/importRenewChiajna2Data";
import { toast } from "sonner";

const ComplexDetails = () => {
  const { complexId } = useParams<{ complexId: string }>();
  const navigate = useNavigate();
  const { complexes, updateComplex, loading: complexesLoading } = useComplexes();
  const { properties, addProperty, updateProperty, deleteProperty, loading: propertiesLoading } = useProperties(complexId || "");
  const { clients } = useClients();
  const { profile, user, isAdmin, isManager } = useAuth();
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
      
      // Use complex-specific columns if available
      if (complex.column_schema && complex.column_schema.length > 0) {
        setColumns(complex.column_schema);
      } else {
        // Default columns if no schema is defined
        setColumns([
          'Etaj', 'Nr. ap.', 'Tip Apartament', 'Suprafata', 'Pret Credit', 
          'Pret Cash', 'Status', 'Client', 'Agent', 'Comision', 'Observatii'
        ]);
      }
    }
  }, [complexes, complexId]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFloor, setSelectedFloor] = useState<string>("toate");
  const [selectedType, setSelectedType] = useState<string>("toate");
  const [selectedStatus, setSelectedStatus] = useState<string>("toate");
  const [selectedCorp, setSelectedCorp] = useState<string>("toate");
  const [selectedClient, setSelectedClient] = useState<string>("toti");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isComplexEditOpen, setIsComplexEditOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set());
  const [isBulkPlanDialogOpen, setIsBulkPlanDialogOpen] = useState(false);
  const [isBulkCommissionDialogOpen, setIsBulkCommissionDialogOpen] = useState(false);

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

  const handleClearRenewChiajnaData = async () => {
    if (complexId !== "complex-3") return;
    
    if (!confirm("Sigur doriți să ștergeți toate proprietățile din Renew Chiajna?")) {
      return;
    }
    
    setIsImporting(true);
    try {
      await clearRenewChiajnaData();
      toast.success("Toate datele au fost șterse cu succes din Renew Chiajna!");
      // Refresh the page to reload all data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Clear error:", error);
      toast.error("Eroare la ștergerea datelor");
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportRenewChiajna2Data = async () => {
    if (complexId !== "complex-3") return;
    
    setIsImporting(true);
    try {
      const result = await importRenewChiajna2Data();
      toast.success(`Importul a fost finalizat cu succes! ${result.count} proprietăți au fost încărcate (${result.available} disponibile).`);
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

        const matchesClient =
          selectedClient === "toti" || 
          (selectedClient === "fara_client" && !property.client_id) ||
          property.client_id === selectedClient;

        return matchesSearch && matchesFloor && matchesType && matchesStatus && matchesCorp && matchesClient;
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
  }, [properties, searchTerm, selectedFloor, selectedType, selectedStatus, selectedCorp, selectedClient]);

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
    
    // Update complex column schema in database
    if (complexId && importedColumns.length > 0) {
      await updateComplex(complexId, { column_schema: importedColumns });
    }
  }, [addProperty, complexId, updateComplex]);

  const handlePropertySelectionChange = useCallback((propertyId: string, selected: boolean) => {
    setSelectedProperties(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(propertyId);
      } else {
        newSet.delete(propertyId);
      }
      return newSet;
    });
  }, []);

  const handleBulkPlanUpload = useCallback(async (planUrl: string) => {
    const selectedIds = Array.from(selectedProperties);
    let successCount = 0;
    
    for (const id of selectedIds) {
      const property = properties.find(p => p.id === id);
      if (property) {
        try {
          await updateProperty({
            ...property,
            property_plan_url: planUrl
          });
          successCount++;
        } catch (error) {
          console.error(`Error updating property ${id}:`, error);
        }
      }
    }
    
    toast.success(`Plan aplicat pentru ${successCount} proprietăți`);
    setSelectedProperties(new Set());
  }, [selectedProperties, properties, updateProperty]);

  const handleBulkCommissionSet = useCallback(async (commission: string) => {
    const selectedIds = Array.from(selectedProperties);
    let successCount = 0;
    
    for (const id of selectedIds) {
      const property = properties.find(p => p.id === id);
      if (property) {
        try {
          let finalCommission = commission;
          
          if (commission === 'auto') {
            // Auto calculate based on complex settings
            if (currentComplex?.commission_type === 'fixed') {
              finalCommission = `${currentComplex.commission_value}€`;
            } else {
              const price = (property as any).pretCuTva || (property as any).avans80 || 0;
              const priceNum = typeof price === 'number' ? price : parseFloat(String(price).replace(/[€\s]/g, '').replace(/,/g, ''));
              if (!isNaN(priceNum)) {
                const commissionValue = priceNum * ((currentComplex?.commission_value || 2) / 100);
                finalCommission = `${commissionValue.toFixed(2)}€`;
              }
            }
          } else {
            finalCommission = `${commission}€`;
          }
          
          await updateProperty({
            ...property,
            Comision: finalCommission,
            comision: finalCommission
          });
          successCount++;
        } catch (error) {
          console.error(`Error updating property ${id}:`, error);
        }
      }
    }
    
    toast.success(`Comision setat pentru ${successCount} proprietăți`);
    setSelectedProperties(new Set());
  }, [selectedProperties, properties, updateProperty, currentComplex]);

  // Show loading if hooks are loading OR if we're waiting for currentComplex to be set
  const isStillLoading = complexesLoading || propertiesLoading || (!currentComplex && complexes.length > 0);
  
  if (isStillLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="p-8 rounded-2xl border bg-card">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Se încarcă...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentComplex) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="p-8 rounded-2xl border bg-card space-y-4 text-center">
          <p className="text-sm text-muted-foreground">Complex negăsit</p>
          <Button onClick={() => navigate("/")} size="sm">
            Înapoi la Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left side - Back button and complex info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="shrink-0 h-9 w-9"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <Building2 className="h-4 w-4 text-primary-foreground" />
              </div>
              
              <div className="min-w-0">
                <h1 className="text-sm font-bold tracking-tight truncate">
                  {currentComplex.name}
                </h1>
                <p className="text-xs text-muted-foreground truncate">
                  {currentComplex.location}
                </p>
              </div>
            </div>

            {/* Right side - Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <ThemeToggle />
              
              {!user && (
                <Button variant="default" size="sm" onClick={() => navigate('/auth')}>
                  Login
                </Button>
              )}
              
              {user && (
                <>
                  {complexId === "complex-1" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleImportComplex1Data}
                      disabled={isImporting}
                    >
                      <FileUp className="h-4 w-4" />
                      <span className="hidden md:inline ml-2">
                        {isImporting ? "Import..." : "Import"}
                      </span>
                    </Button>
                  )}
                  
                  {complexId === "complex-viilor33" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleImportViilor33Data}
                      disabled={isImporting}
                    >
                      <FileUp className="h-4 w-4" />
                      <span className="hidden md:inline ml-2">
                        {isImporting ? "Import..." : "Date"}
                      </span>
                    </Button>
                  )}
                  
                  {complexId === "complex-3" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleImportRenewChiajna2Data}
                        disabled={isImporting}
                      >
                        <FileUp className="h-4 w-4" />
                        <span className="hidden md:inline ml-2">
                          {isImporting ? "Import..." : "Import Date"}
                        </span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleClearRenewChiajnaData}
                        disabled={isImporting}
                      >
                        <span className="hidden md:inline ml-2">
                          {isImporting ? "Ștergere..." : "Șterge Date"}
                        </span>
                      </Button>
                    </>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsComplexEditOpen(true)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsImportDialogOpen(true)}
                  >
                    <FileUp className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingProperty(null);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden md:inline ml-2">Adaugă</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards - Minimalist Bento Style */}
        <section className="grid gap-3 grid-cols-2 md:grid-cols-5">
          <div className="p-4 rounded-2xl border bg-card">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Total</p>
              <p className="text-3xl font-bold tracking-tighter">{properties.length}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl border bg-card">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Disponibile</p>
              <p className="text-3xl font-bold tracking-tighter text-success">
                {statistics.availableCount}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl border bg-card">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Rezervate</p>
              <p className="text-3xl font-bold tracking-tighter text-warning">
                {statistics.reservedCount}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl border bg-card">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Vândute</p>
              <p className="text-3xl font-bold tracking-tighter text-info">{statistics.soldCount}</p>
            </div>
          </div>

          {(isAdmin || isManager) && (
            <div className="p-4 rounded-2xl border bg-card col-span-2 md:col-span-1">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Comisioane</p>
                {statistics.corpNames.length > 1 ? (
                  <div className="space-y-1.5">
                    {statistics.corpNames.map(corp => (
                      <div key={corp} className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">{corp}:</span>
                        <span className="font-semibold text-accent">
                          {new Intl.NumberFormat('ro-RO', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(statistics.commissionsPerCorp[corp])} €
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-xs font-medium">Total:</span>
                      <span className="text-lg font-bold tracking-tighter text-accent">
                        {new Intl.NumberFormat('ro-RO', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(statistics.totalCommissions)} €
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-2xl font-bold tracking-tighter text-accent">
                    {new Intl.NumberFormat('ro-RO', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(statistics.totalCommissions)} €
                  </p>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Search and Filters - Inline */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">Proprietăți</h2>
            <p className="text-sm text-muted-foreground">
              {filteredProperties.length} din {properties.length}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Caută apartament, client, agent..."
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
              selectedClient={selectedClient}
              onFloorChange={setSelectedFloor}
              onTypeChange={setSelectedType}
              onStatusChange={setSelectedStatus}
              onCorpChange={setSelectedCorp}
              onClientChange={setSelectedClient}
              properties={properties}
              clients={clients}
            />
          </div>
        </section>

        {/* Properties Table with Corps Tabs (conditional) */}
        <section className="rounded-2xl border bg-card p-6">
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
                          selectedProperties={selectedProperties}
                          onPropertySelectionChange={handlePropertySelectionChange}
                          complexId={complexId}
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
                selectedProperties={selectedProperties}
                onPropertySelectionChange={handlePropertySelectionChange}
                complexId={complexId}
              />
          )}
        </section>

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

        {/* Bulk Actions Toolbar */}
        <BulkActionsToolbar
          selectedCount={selectedProperties.size}
          onClearSelection={() => setSelectedProperties(new Set())}
          onUploadPlan={() => setIsBulkPlanDialogOpen(true)}
          onSetCommission={() => setIsBulkCommissionDialogOpen(true)}
        />

        {/* Bulk Plan Upload Dialog */}
        <BulkPlanUploadDialog
          open={isBulkPlanDialogOpen}
          onOpenChange={setIsBulkPlanDialogOpen}
          selectedCount={selectedProperties.size}
          onUpload={handleBulkPlanUpload}
        />

        {/* Bulk Commission Dialog */}
        <BulkCommissionDialog
          open={isBulkCommissionDialogOpen}
          onOpenChange={setIsBulkCommissionDialogOpen}
          selectedCount={selectedProperties.size}
          commissionType={currentComplex?.commission_type}
          commissionValue={currentComplex?.commission_value}
          onSetCommission={handleBulkCommissionSet}
        />
      </main>
    </div>
  );
};

export default ComplexDetails;
