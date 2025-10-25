import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Plus, Search, Filter, ArrowLeft, Settings } from "lucide-react";
import { PropertyTable } from "@/components/PropertyTable";
import { PropertyDialog } from "@/components/PropertyDialog";
import { PropertyFilters } from "@/components/PropertyFilters";
import { ComplexEditDialog } from "@/components/ComplexEditDialog";
import { Property } from "@/types/property";
import { Complex } from "@/types/complex";
import { initialProperties } from "@/data/initialProperties";
import { eurocasa65gProperties } from "@/data/eurocasa65g-properties";
import { complexes } from "@/data/complexes";

const ComplexDetails = () => {
  const { complexId } = useParams<{ complexId: string }>();
  const navigate = useNavigate();
  const [currentComplex, setCurrentComplex] = useState<Complex | undefined>(
    complexes.find((c) => c.id === complexId)
  );

  // Load properties based on complex ID
  const getPropertiesForComplex = (id: string): Property[] => {
    switch (id) {
      case "complex-1":
        return initialProperties;
      case "complex-2":
        return eurocasa65gProperties;
      default:
        return [];
    }
  };

  const [properties, setProperties] = useState<Property[]>(
    getPropertiesForComplex(complexId || "")
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFloor, setSelectedFloor] = useState<string>("toate");
  const [selectedType, setSelectedType] = useState<string>("toate");
  const [selectedStatus, setSelectedStatus] = useState<string>("toate");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isComplexEditOpen, setIsComplexEditOpen] = useState(false);
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

  const handleComplexUpdate = (updatedComplex: Complex) => {
    setCurrentComplex(updatedComplex);
    // In a real app, this would update the complex in a database or global state
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.nrAp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.nume?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.agent?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFloor =
      selectedFloor === "toate" || property.etaj === selectedFloor;

    const matchesType =
      selectedType === "toate" || property.tipCom === selectedType;

    const matchesStatus =
      selectedStatus === "toate" || property.status === selectedStatus;

    return matchesSearch && matchesFloor && matchesType && matchesStatus;
  });

  const availableCount = properties.filter((p) => p.status === "disponibil").length;
  const reservedCount = properties.filter((p) => p.status === "rezervat").length;
  const soldCount = properties.filter((p) => p.status === "vandut").length;

  const handleAddProperty = (property: Omit<Property, "id">) => {
    const newProperty = {
      ...property,
      id: Date.now().toString(),
    };
    setProperties([...properties, newProperty]);
    setIsDialogOpen(false);
  };

  const handleEditProperty = (property: Property) => {
    setProperties(
      properties.map((p) => (p.id === property.id ? property : p))
    );
    setEditingProperty(null);
    setIsDialogOpen(false);
  };

  const handleDeleteProperty = (id: string) => {
    setProperties(properties.filter((p) => p.id !== id));
  };

  const openEditDialog = (property: Property) => {
    setEditingProperty(property);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/")}
              className="hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="p-3 bg-gradient-to-br from-primary to-info rounded-xl shadow-lg">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
                {currentComplex.name}
              </h1>
              <p className="text-muted-foreground">{currentComplex.location}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsComplexEditOpen(true)}
              className="gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Settings className="h-4 w-4" />
              Editează Complex
            </Button>
            <Button
              onClick={() => {
                setEditingProperty(null);
                setIsDialogOpen(true);
              }}
              className="gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-4 w-4" />
              Adaugă Proprietate
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-l-4 border-l-primary shadow-md hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Proprietăți
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{properties.length}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success shadow-md hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Disponibile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
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
              <div className="text-3xl font-bold text-warning">
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
              <div className="text-3xl font-bold text-info">{soldCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
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
              onFloorChange={setSelectedFloor}
              onTypeChange={setSelectedType}
              onStatusChange={setSelectedStatus}
              properties={properties}
            />
          </CardContent>
        </Card>

        {/* Properties Table */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>
              Proprietăți ({filteredProperties.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyTable
              properties={filteredProperties}
              onEdit={openEditDialog}
              onDelete={handleDeleteProperty}
            />
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
      </div>
    </div>
  );
};

export default ComplexDetails;
