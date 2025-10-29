import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, User, Building2, Phone, Mail, Upload } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useComplexes } from "@/hooks/useComplexes";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";

interface PropertyWithComplex {
  id: string;
  complex_id: string;
  complex_name: string;
  data: any;
}

export default function ClientsOverview() {
  const navigate = useNavigate();
  const { clients } = useClients();
  const { complexes } = useComplexes();
  const [searchTerm, setSearchTerm] = useState("");
  const [clientProperties, setClientProperties] = useState<Record<string, PropertyWithComplex[]>>({});

  useEffect(() => {
    const fetchClientProperties = async () => {
      // Fetch all properties with client_id in one query instead of multiple queries
      const clientIds = clients.map(c => c.id);
      
      if (clientIds.length === 0) {
        setClientProperties({});
        return;
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .in('client_id', clientIds);
      
      if (!error && data) {
        // Group properties by client_id
        const propertiesMap: Record<string, PropertyWithComplex[]> = {};
        
        data.forEach(prop => {
          if (!prop.client_id) return;
          
          const complex = complexes.find(c => c.id === prop.complex_id);
          const propertyWithComplex = {
            id: prop.id,
            complex_id: prop.complex_id,
            complex_name: complex?.name || 'Unknown',
            data: prop.data
          };
          
          if (!propertiesMap[prop.client_id]) {
            propertiesMap[prop.client_id] = [];
          }
          propertiesMap[prop.client_id].push(propertyWithComplex);
        });
        
        setClientProperties(propertiesMap);
      }
    };

    if (clients.length > 0 && complexes.length > 0) {
      fetchClientProperties();
    }
  }, [clients, complexes]);

  const filteredClients = useMemo(() => 
    clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [clients, searchTerm]
  );

  const clientsWithProperties = useMemo(() => 
    Object.keys(clientProperties).filter(id => clientProperties[id].length > 0).length,
    [clientProperties]
  );

  const totalProperties = useMemo(() => 
    Object.values(clientProperties).reduce((sum, props) => sum + props.length, 0),
    [clientProperties]
  );

  const getPropertyLabel = (property: PropertyWithComplex) => {
    const data = property.data;
    const nrAp = data.nrAp || data['Nr. ap.'] || data.nr_ap || '';
    const etaj = data.etaj || data.ETAJ || data.Etaj || '';
    const corp = data.corp || data.CORP || '';
    
    let label = '';
    if (corp) label += `${corp} - `;
    if (etaj) label += `${etaj} - `;
    label += `Ap. ${nrAp}`;
    
    return label;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 animate-fade-in">
      <div className="container mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:gap-4 animate-slide-in">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/")}
              className="hover:bg-primary hover:text-primary-foreground transition-all duration-300 shrink-0 h-9 w-9 sm:h-10 sm:w-10 active:scale-95"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div className="p-2 sm:p-3 bg-gradient-to-br from-primary via-accent to-info rounded-xl shadow-xl shrink-0 group hover:scale-110 transition-all duration-300">
              <User className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-info bg-clip-text text-transparent">
                Clienți și Proprietăți
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Vizualizare completă clienți</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate("/import-contacts")}
              className="flex items-center gap-2 flex-1 sm:flex-initial shadow-md hover:shadow-lg active:scale-95"
              size="sm"
            >
              <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Import VCF</span>
              <span className="sm:hidden">Import</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
          <Card className="glass-card border-l-4 border-l-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Total Clienți
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{clients.length}</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-l-4 border-l-success shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-success" />
                Cu Proprietăți
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-success to-success/70 bg-clip-text text-transparent">{clientsWithProperties}</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-l-4 border-l-info shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-info" />
                Total Proprietăți Asociate
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-info to-info/70 bg-clip-text text-transparent">{totalProperties}</div>
            </CardContent>
          </Card>
        </div>
        {/* Search */}
        <Card>
          <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Caută după nume, telefon sau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 sm:pl-10 text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Clients List */}
        <div className="grid gap-4">
          {filteredClients.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="text-center text-muted-foreground py-8">
                Nu există clienți de afișat
              </CardContent>
            </Card>
          ) : (
            filteredClients.map((client) => {
              const properties = clientProperties[client.id] || [];
              
              return (
                <Card key={client.id} className="glass-card shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] gradient-border">
                  <CardHeader className="pb-3 p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1 min-w-0">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                          <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                          <span className="truncate">{client.name}</span>
                        </CardTitle>
                        <div className="flex flex-col gap-1 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                            <span className="truncate">{client.phone}</span>
                          </div>
                          {client.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                              <span className="truncate">{client.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <div className="text-xs sm:text-sm font-semibold whitespace-nowrap">
                            {properties.length} {properties.length === 1 ? 'Prop.' : 'Prop.'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {properties.length > 0 && (
                     <CardContent className="p-4 sm:p-6 pt-0">
                      <div className="space-y-2">
                        <div className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Proprietăți asociate:
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {properties.map((property) => (
                            <div
                              key={property.id}
                              className="flex items-center gap-2 p-2.5 sm:p-3 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 hover:from-muted hover:to-muted/50 active:scale-95 transition-all cursor-pointer touch-manipulation shadow-sm hover:shadow-md"
                              onClick={() => navigate(`/complex/${property.complex_id}`)}
                            >
                              <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs sm:text-sm font-medium truncate">
                                  {property.complex_name}
                                </div>
                                <div className="text-[10px] sm:text-xs text-muted-foreground truncate">
                                  {getPropertyLabel(property)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
