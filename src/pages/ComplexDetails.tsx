import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Plus, Search, ArrowLeft, Settings, FileUp, Download } from "lucide-react";
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
import * as XLSX from 'xlsx';

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
    const knownKeys = ['Comision', 'comision', 'COMISION', 'commission'];
    let commissionValue = '';
    
    // Try known keys first
    for (const key of knownKeys) {
      const v = (property as any)[key];
      if (v !== undefined && v !== null && String(v).trim() !== '') {
        commissionValue = String(v);
        break;
      }
    }
    
    // If not found, try case-insensitive search for 'comision'
    if (!commissionValue) {
      for (const key in property) {
        if (key.toLowerCase().includes('comision')) {
          const v = (property as any)[key];
          if (v !== undefined && v !== null && String(v).trim() !== '') {
            commissionValue = String(v);
            break;
          }
        }
      }
    }
    
    if (!commissionValue) return 0;

    // Normalize: remove currency symbols, NBSP and spaces
    let cleanStr = commissionValue
      .replace(/\u00A0/g, '') // Remove NBSP
      .replace(/€/g, '')       // Remove euro symbol
      .replace(/\s+/g, '')     // Remove all spaces
      .trim();
    
    // Remove any remaining non-numeric characters except comma, dot and minus
    cleanStr = cleanStr.replace(/[^0-9,.-]/g, '');

    if (!cleanStr) return 0;

    const lastComma = cleanStr.lastIndexOf(',');
    const lastDot = cleanStr.lastIndexOf('.');

    if (lastComma !== -1 && lastDot !== -1) {
      // Both present -> decimal is the rightmost separator
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
      // Only comma present: determine thousands vs decimal
      if (/^\d{1,3}(,\d{3})+$/.test(cleanStr)) {
        // Thousands groups like 1,000 or 12,000 -> remove commas
        cleanStr = cleanStr.replace(/,/g, '');
      } else {
        // Decimal comma
        cleanStr = cleanStr.replace(/,/g, '.');
      }
    } else if (lastDot !== -1) {
      // Only dot present: determine thousands vs decimal
      if (/^\d{1,3}(\.\d{3})+$/.test(cleanStr)) {
        // Thousands groups like 1.000 or 12.345.678 -> remove dots
        cleanStr = cleanStr.replace(/\./g, '');
      }
      // else: treat dot as decimal separator and keep it
    } // else: integer

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
        // Sort by floor order - comprehensive mapping
        const getFloorOrder = (etajStr: string): number => {
          const etaj = String(etajStr).toUpperCase().trim();
          
          // Direct mappings
          const floorOrder: Record<string, number> = {
            'DEMISOL': 0,
            'D': 0,
            'PARTER': 1,
            'P': 1,
            'ETAJ 1': 2,
            'E1': 2,
            '1': 2,
            'ETAJ 2': 3,
            'E2': 3,
            '2': 3,
            'ETAJ 3': 4,
            'E3': 4,
            '3': 4,
            'ETAJ 4': 5,
            'E4': 5,
            '4': 5,
            'ETAJ 5': 6,
            'E5': 6,
            '5': 6,
            'ETAJ 6': 7,
            'E6': 7,
            '6': 7,
            'ETAJ 7': 8,
            'E7': 8,
            '7': 8,
            'ETAJ 8': 9,
            'E8': 9,
            '8': 9,
            'ETAJ 9': 10,
            'E9': 10,
            '9': 10,
            'ETAJ 10': 11,
            'E10': 11,
            '10': 11,
          };
          
          if (floorOrder[etaj] !== undefined) {
            return floorOrder[etaj];
          }
          
          // Try to extract numeric floor from patterns like "ETAJ 11", "E11"
          const match = etaj.match(/(?:ETAJ|E)\s*(\d+)/);
          if (match) {
            return parseInt(match[1]) + 1; // +1 to account for DEMISOL and PARTER
          }
          
          // If it's just a number
          const numMatch = etaj.match(/^(\d+)$/);
          if (numMatch) {
            return parseInt(numMatch[1]) + 1;
          }
          
          return 999; // Unknown floors go to end
        };

        const etajA = a.etaj || a.ETAJ || a.Etaj || '';
        const etajB = b.etaj || b.ETAJ || b.Etaj || '';
        const floorA = getFloorOrder(etajA);
        const floorB = getFloorOrder(etajB);

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

  const handleExportToExcel = useCallback(() => {
    if (filteredProperties.length === 0) {
      toast.error("Nu există proprietăți de exportat");
      return;
    }

    // Define known aliases between headers and internal keys
    const aliasMap: Record<string, string[]> = {
      'Etaj': ['etaj', 'ETAJ'],
      'Nr. ap.': ['nrAp', 'nr ap', 'nr_ap', 'nr.ap', 'apartament', 'numar apartament'],
      'Tip Apartament': ['tipCom', 'tip', 'tip_apartament'],
      'Suprafata': ['mpUtili', 'suprafata', 'mp_utili', 'mp utili'],
      'Pret Credit': ['pretCuTva', 'pret_credit', 'pret credit', 'pret cu tva'],
      'Pret Cash': ['pretCash', 'pret_cash', 'pret cash'],
      'Status': ['status', 'STATUS'],
      'Client': ['clientName', 'nume', 'client'],
      'Agent': ['agent'],
      'Comision': ['Comision', 'comision', 'COMISION'],
      'Observatii': ['Observatii', 'observatii', 'OBSERVATII'],
      'Corp': ['corp', 'CORP']
    };

    const normalize = (s: string) => s.toString().toLowerCase().replace(/[^a-z0-9]/g, '');

    const buildLookup = (obj: Record<string, any> = {}) => {
      const map = new Map<string, any>();
      Object.entries(obj).forEach(([k, v]) => {
        const keys = [k, k.toLowerCase(), k.toUpperCase(), normalize(k)];
        keys.forEach(key => map.set(key, v));
      });
      return map;
    };

    // Determine headers to export
    const headers = (columns && columns.length > 0)
      ? columns
      : Array.from(new Set(
          filteredProperties.flatMap(p => Object.keys(p as any))
        ));

    const exportData = filteredProperties.map(property => {
      const row: Record<string, any> = {};
      const flatMap = buildLookup(property as any);
      const dataMap = buildLookup((property as any).data || {});

      headers.forEach(header => {
        let value: any = '';
        // Special case: Client
        if (header.toLowerCase() === 'client') {
          value = (property as any).clientName || (property as any).nume || '';
        }

        if (!value) {
          // Try direct header matches
          const keysToTry = [header, header.toLowerCase(), header.toUpperCase(), normalize(header)];
          for (const k of keysToTry) {
            value = flatMap.get(k) ?? dataMap.get(k) ?? '';
            if (value !== '' && value !== undefined && value !== null) break;
          }
        }

        if (!value) {
          // Try aliases
          const aliases = aliasMap[header] || [];
          for (const alias of aliases) {
            const k = [alias, alias.toLowerCase(), alias.toUpperCase(), normalize(alias)];
            for (const kk of k) {
              value = flatMap.get(kk) ?? dataMap.get(kk) ?? '';
              if (value !== '' && value !== undefined && value !== null) break;
            }
            if (value) break;
          }
        }

        if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
          value = JSON.stringify(value);
        }
        row[header] = value ?? '';
      });

      return row;
    });

    // Create worksheet with forced headers order
    const worksheet = XLSX.utils.json_to_sheet(exportData, { header: headers as any });

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, currentComplex?.name || 'Proprietati');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const safeName = (currentComplex?.name || 'Complex').replace(/[^a-zA-Z0-9-_ ]/g, '');
    const filename = `${safeName}_${timestamp}.xlsx`;

    // Save file
    XLSX.writeFile(workbook, filename);

    toast.success(`Exportul a fost finalizat: ${filteredProperties.length} proprietăți`);
  }, [filteredProperties, columns, currentComplex]);

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
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0 bg-mesh pointer-events-none" />
        <div className="p-8 rounded-3xl glass border shadow-2xl">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-lg opacity-50 animate-pulse" />
              <div className="relative h-12 w-12 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Se încarcă...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentComplex) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0 bg-mesh pointer-events-none" />
        <div className="p-8 rounded-3xl glass border shadow-2xl space-y-4 text-center">
          <p className="text-sm text-muted-foreground">Complex negăsit</p>
          <Button onClick={() => navigate("/")} size="sm" className="rounded-xl">
            Înapoi la Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-mesh pointer-events-none" />
      <div className="fixed inset-0 bg-dot-pattern opacity-20 pointer-events-none" />
      
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="container mx-auto px-3 md:px-4 py-2.5 md:py-3">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            {/* Left side - Back button and complex info */}
            <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="shrink-0 h-9 w-9 rounded-xl hover:bg-primary/10"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 shadow-lg">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              
              <div className="min-w-0">
                <h1 className="text-sm md:text-base font-bold tracking-tight truncate">
                  {currentComplex.name}
                </h1>
                <p className="text-xs text-muted-foreground truncate hidden sm:block">
                  {currentComplex.location}
                </p>
              </div>
            </div>

            {/* Right side - Action buttons */}
            <div className="flex items-center gap-1 md:gap-2 shrink-0">
              <ThemeToggle />
              
              {!user && (
                <Button variant="default" size="sm" className="h-8 text-xs md:h-9 md:text-sm" onClick={() => navigate('/auth')}>
                  Login
                </Button>
              )}
              
              {user && (
                <>
                  {complexId === "complex-1" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 md:h-9 md:w-9"
                      onClick={handleImportComplex1Data}
                      disabled={isImporting}
                      title="Import date"
                    >
                      <FileUp className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </Button>
                  )}
                  
                  {complexId === "complex-viilor33" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 md:h-9 md:w-9"
                      onClick={handleImportViilor33Data}
                      disabled={isImporting}
                      title="Import date"
                    >
                      <FileUp className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </Button>
                  )}
                  
                  {complexId === "complex-3" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 md:h-9 md:w-9"
                      onClick={handleImportRenewChiajna2Data}
                      disabled={isImporting}
                      title="Import date"
                    >
                      <FileUp className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 md:h-9 md:w-9"
                    onClick={handleExportToExcel}
                    title="Export Excel"
                  >
                    <Download className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 md:h-9 md:w-9"
                    onClick={() => setIsComplexEditOpen(true)}
                    title="Setări"
                  >
                    <Settings className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 md:h-9 md:w-9 hidden sm:flex"
                    onClick={() => setIsImportDialogOpen(true)}
                    title="Import Excel"
                  >
                    <FileUp className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    className="h-8 md:h-9"
                    onClick={() => {
                      setEditingProperty(null);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Plus className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    <span className="hidden md:inline ml-2 text-xs md:text-sm">Adaugă</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8 relative z-10">
        {/* Stats Cards - Modern Glass Style */}
        <section className="grid gap-4 grid-cols-2 md:grid-cols-5 stagger-children">
          <div className="p-5 rounded-2xl glass border hover:border-primary/30 transition-all duration-300 group">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Total</p>
              <p className="text-3xl md:text-4xl font-bold tracking-tight group-hover:text-primary transition-colors">{properties.length}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl glass border hover:border-success/30 transition-all duration-300 group">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Disponibile</p>
              <p className="text-3xl md:text-4xl font-bold tracking-tight text-success">
                {statistics.availableCount}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl glass border hover:border-warning/30 transition-all duration-300 group">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Rezervate</p>
              <p className="text-3xl md:text-4xl font-bold tracking-tight text-warning">
                {statistics.reservedCount}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl glass border hover:border-info/30 transition-all duration-300 group">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Vândute</p>
              <p className="text-3xl md:text-4xl font-bold tracking-tight text-info">{statistics.soldCount}</p>
            </div>
          </div>

          {(isAdmin || isManager) && (
            <div className="p-5 rounded-2xl glass border hover:border-accent/30 col-span-2 md:col-span-1 transition-all duration-300 group">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Comisioane</p>
                {statistics.corpNames.length > 1 ? (
                  <div className="space-y-2">
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
                    <div className="flex justify-between items-center pt-2 border-t border-border/50">
                      <span className="text-xs font-medium">Total:</span>
                      <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {new Intl.NumberFormat('ro-RO', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(statistics.totalCommissions)} €
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
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

        {/* Search and Filters */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base md:text-lg font-bold tracking-tight">Proprietăți</h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              {filteredProperties.length} din {properties.length}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2 md:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Caută apartament, client, agent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
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
        <section className="rounded-3xl glass border p-6 md:p-8">
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
