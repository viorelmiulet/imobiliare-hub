import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, User, Building2, Phone, Mail } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useComplexes } from "@/hooks/useComplexes";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
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
      const propertiesMap: Record<string, PropertyWithComplex[]> = {};
      
      for (const client of clients) {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('client_id', client.id);
        
        if (!error && data) {
          propertiesMap[client.id] = data.map(prop => {
            const complex = complexes.find(c => c.id === prop.complex_id);
            return {
              id: prop.id,
              complex_id: prop.complex_id,
              complex_name: complex?.name || 'Unknown',
              data: prop.data
            };
          });
        }
      }
      
      setClientProperties(propertiesMap);
    };

    if (clients.length > 0 && complexes.length > 0) {
      fetchClientProperties();
    }
  }, [clients, complexes]);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
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
              <User className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
                Clienți și Proprietăți
              </h1>
              <p className="text-sm text-muted-foreground">Vizualizare completă clienți</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-l-4 border-l-primary shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Clienți
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{clients.length}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cu Proprietăți
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {Object.keys(clientProperties).filter(id => clientProperties[id].length > 0).length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-info shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Proprietăți Asociate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-info">
                {Object.values(clientProperties).reduce((sum, props) => sum + props.length, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Caută client după nume, telefon sau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Clients List */}
        <div className="grid gap-4">
          {filteredClients.length === 0 ? (
            <Card>
              <CardContent className="text-center text-muted-foreground py-8">
                Nu există clienți de afișat
              </CardContent>
            </Card>
          ) : (
            filteredClients.map((client) => {
              const properties = clientProperties[client.id] || [];
              
              return (
                <Card key={client.id} className="shadow-md hover:shadow-lg transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5 text-primary" />
                          {client.name}
                        </CardTitle>
                        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {client.phone}
                          </div>
                          {client.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {client.email}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-sm font-semibold">
                            {properties.length} {properties.length === 1 ? 'Proprietate' : 'Proprietăți'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {properties.length > 0 && (
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground mb-2">
                          Proprietăți asociate:
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {properties.map((property) => (
                            <div
                              key={property.id}
                              className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                              onClick={() => navigate(`/complex/${property.complex_id}`)}
                            >
                              <Building2 className="h-4 w-4 text-primary shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  {property.complex_name}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
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
