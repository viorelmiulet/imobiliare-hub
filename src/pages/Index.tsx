import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Home, ArrowRight, Users, LogOut, Shield } from "lucide-react";
import { useComplexes } from "@/hooks/useComplexes";
import { useAuth } from "@/hooks/useAuth";
import { ClientDialog } from "@/components/ClientDialog";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const navigate = useNavigate();
  const { complexes } = useComplexes();
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
      
      <div className="container mx-auto p-3 sm:p-6 space-y-6 sm:space-y-8 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center pt-2 px-4 glass-card rounded-2xl p-4 animate-fade-in">
          <div className="text-sm font-medium">
            <span className="text-muted-foreground">Bine ai venit, </span>
            <span className="text-foreground">{profile?.full_name || profile?.email}</span>
          </div>
          <div className="flex items-center gap-2">
            {profile?.role === 'admin' && (
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
                className="gap-2 glass-hover"
                size="sm"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Button>
            )}
            <ThemeToggle />
            <Button
              variant="outline"
              onClick={signOut}
              className="gap-2 glass-hover hover:border-destructive/50 hover:text-destructive"
              size="sm"
            >
              <LogOut className="h-4 w-4" />
              Deconectare
            </Button>
          </div>
        </div>
        
        <div className="text-center space-y-6 pb-4 animate-fade-in [animation-delay:0.1s]">
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-info rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative p-4 sm:p-5 bg-gradient-to-br from-primary via-accent to-info rounded-3xl shadow-2xl hover:shadow-primary/50 transition-all hover:scale-105">
                <Building2 className="h-12 w-12 sm:h-14 sm:w-14 text-primary-foreground" />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-info bg-clip-text text-transparent px-4 animate-fade-in [animation-delay:0.2s]">
              Administrare vanzari
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4 animate-fade-in [animation-delay:0.3s]">
              Selectează un complex pentru a gestiona proprietățile și vânzările
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2 animate-fade-in [animation-delay:0.4s]">
            <ClientDialog />
            <Button
              onClick={() => navigate("/clients")}
              variant="outline"
              className="gap-2 glass-hover shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Users className="h-4 w-4" />
              Vizualizare Clienți
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto animate-fade-in [animation-delay:0.5s]">
          <Card className="glass-card border-l-4 border-l-primary shadow-lg hover:shadow-2xl transition-all hover:scale-105 gradient-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Total Complexe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {complexes.length}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-l-4 border-l-success shadow-lg hover:shadow-2xl transition-all hover:scale-105 gradient-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Home className="h-4 w-4 text-success" />
                Total Proprietăți
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-r from-success to-success/70 bg-clip-text text-transparent">
                {complexes.reduce((acc, c) => acc + c.total_properties, 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-l-4 border-l-warning shadow-lg hover:shadow-2xl transition-all hover:scale-105 gradient-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Home className="h-4 w-4 text-warning" />
                Disponibile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-r from-warning to-warning/70 bg-clip-text text-transparent">
                {complexes.reduce((acc, c) => acc + c.available_properties, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Complexes Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto animate-fade-in [animation-delay:0.6s]">
          {complexes.map((complex, index) => {
            const colorIndex = (index % 6) + 1;
            return (
              <Card
                key={complex.id}
                className="group glass-card hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 hover:scale-105 gradient-border overflow-hidden relative"
                style={{
                  borderColor: 'hsl(var(--border))',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `hsl(var(--complex-${colorIndex}))`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'hsl(var(--border))';
                }}
                onClick={() => navigate(`/complex/${complex.id}`)}
              >
                {/* Decorative gradient overlay */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, hsl(var(--complex-${colorIndex})), transparent)`,
                  }}
                />
                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div 
                      className="p-4 rounded-xl transition-all duration-300 shadow-lg group-hover:shadow-xl relative"
                      style={{
                        backgroundColor: `hsl(var(--complex-${colorIndex}) / 0.15)`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `hsl(var(--complex-${colorIndex}))`;
                        e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                        const icon = e.currentTarget.querySelector('svg');
                        if (icon) (icon as SVGSVGElement).style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = `hsl(var(--complex-${colorIndex}) / 0.15)`;
                        e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                        const icon = e.currentTarget.querySelector('svg');
                        if (icon) (icon as SVGSVGElement).style.color = `hsl(var(--complex-${colorIndex}))`;
                      }}
                    >
                      <Building2 
                        className="h-7 w-7 transition-all duration-300" 
                        style={{ color: `hsl(var(--complex-${colorIndex}))` }}
                      />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
                  >
                    <ArrowRight className="h-5 w-5" style={{ color: `hsl(var(--complex-${colorIndex}))` }} />
                  </Button>
                </div>
                <CardTitle className="text-xl mt-4 group-hover:text-primary transition-colors">
                  {complex.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <div className="flex justify-between items-center pt-4 border-t border-border/50">
                  <div className="text-center">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Total</p>
                    <p className="text-xl font-bold bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {complex.total_properties}
                    </p>
                  </div>
                  <div className="text-center px-4 py-2 rounded-lg bg-success/10 group-hover:bg-success/20 transition-colors">
                    <p className="text-xs font-medium text-success mb-1">Disponibile</p>
                    <p className="text-xl font-bold text-success">
                      {complex.available_properties}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Vândute</p>
                    <p className="text-xl font-bold bg-gradient-to-b from-info to-info/70 bg-clip-text text-transparent">
                      {complex.total_properties - complex.available_properties}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Index;
