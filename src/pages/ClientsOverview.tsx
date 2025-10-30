import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, User, Building2, Phone, Mail, Upload, MessageCircle } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              
              <div>
                <h1 className="text-lg font-bold tracking-tight">Clienți</h1>
                <p className="text-xs text-muted-foreground">
                  Vizualizare completă clienți
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/import-contacts")}
              >
                <Upload className="h-4 w-4" />
                <span className="hidden md:inline ml-2">Import VCF</span>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <section className="grid grid-cols-3 gap-4 max-w-4xl">
          <div className="p-6 rounded-2xl border bg-card">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Clienți</p>
              <p className="text-4xl font-bold tracking-tighter">{clients.length}</p>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl border bg-card">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Cu Proprietăți</p>
              <p className="text-4xl font-bold tracking-tighter text-primary">{clientsWithProperties}</p>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl border bg-card">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Asocieri</p>
              <p className="text-4xl font-bold tracking-tighter text-success">{totalProperties}</p>
            </div>
          </div>
        </section>

        {/* Search */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">Listă Clienți</h2>
            <p className="text-sm text-muted-foreground">
              {filteredClients.length} clienți
            </p>
          </div>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Caută după nume, telefon sau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </section>

        {/* Clients List */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Nu există clienți de afișat</p>
            </div>
          ) : (
            filteredClients.map((client) => {
              const properties = clientProperties[client.id] || [];
              
              return (
                <div
                  key={client.id}
                  className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 hover:scale-[1.02] space-y-4"
                >
                  {/* Client Info */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg">{client.name}</h3>
                      {properties.length > 0 && (
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {properties.length} prop.
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{client.phone}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                        onClick={() => {
                          const phoneNumber = client.phone.replace(/[\s\-\(\)]/g, '');
                          window.open(`https://wa.me/${phoneNumber}`, '_blank');
                        }}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {client.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Associated Properties */}
                  {properties.length > 0 && (
                    <div className="pt-4 border-t space-y-2">
                      <p className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5" />
                        Proprietăți asociate:
                      </p>
                      <div className="space-y-2">
                        {properties.map((property) => (
                          <button
                            key={property.id}
                            onClick={() => navigate(`/complex/${property.complex_id}`)}
                            className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all text-xs space-y-1"
                          >
                            <div className="font-medium">{property.complex_name}</div>
                            <div className="text-muted-foreground">
                              {getPropertyLabel(property)}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
}
