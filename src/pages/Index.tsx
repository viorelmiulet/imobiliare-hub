import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Home, ArrowRight } from "lucide-react";
import { complexes } from "@/data/complexes";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-br from-primary to-info rounded-2xl shadow-xl">
              <Building2 className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
            Dashboard Complexe Rezidențiale
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Selectează un complex pentru a gestiona proprietățile și vânzările
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
          <Card className="border-l-4 border-l-primary shadow-md hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Total Complexe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{complexes.length}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success shadow-md hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Home className="h-4 w-4" />
                Total Proprietăți
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {complexes.reduce((acc, c) => acc + c.totalProperties, 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning shadow-md hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Home className="h-4 w-4" />
                Disponibile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">
                {complexes.reduce((acc, c) => acc + c.availableProperties, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Complexes Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {complexes.map((complex) => (
            <Card
              key={complex.id}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary"
              onClick={() => navigate(`/complex/${complex.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-gradient-to-br from-primary/10 to-info/10 rounded-lg group-hover:from-primary group-hover:to-info transition-all">
                    <Building2 className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-all" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
                <CardTitle className="text-xl mt-4">{complex.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {complex.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {complex.description}
                </p>
                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-lg font-bold">{complex.totalProperties}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Disponibile</p>
                    <p className="text-lg font-bold text-success">
                      {complex.availableProperties}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Vândute</p>
                    <p className="text-lg font-bold text-info">
                      {complex.totalProperties - complex.availableProperties}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
