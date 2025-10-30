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
  const { profile, signOut, user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b">
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-primary flex items-center justify-center">
                <Building2 className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base md:text-lg font-bold tracking-tight truncate">Administrare vanzari</h1>
                {user && (
                  <p className="text-xs text-muted-foreground truncate hidden sm:block">
                    {profile?.full_name || profile?.email}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1 md:gap-2">
              {user ? (
                <>
                  {profile?.role === 'admin' && (
                    <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10" onClick={() => navigate('/admin')}>
                      <Shield className="h-4 w-4" />
                    </Button>
                  )}
                  <ThemeToggle />
                  <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10" onClick={signOut}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <ThemeToggle />
                  <Button variant="default" size="sm" className="text-xs md:text-sm" onClick={() => navigate('/auth')}>
                    <span className="hidden sm:inline">Autentificare</span>
                    <span className="sm:hidden">Login</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 md:px-4 py-4 md:py-8 space-y-6 md:space-y-8">
        {/* Hero Section */}
        <section className="py-6 md:py-12 text-center space-y-3 md:space-y-4">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
            Selectează un complex
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Gestionează proprietățile și vânzările din fiecare complex imobiliar
          </p>
          
          {user && (
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center pt-2 md:pt-4 max-w-md mx-auto">
              <ClientDialog />
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate("/clients")}>
                <Users className="h-4 w-4 mr-2" />
                Clienți
              </Button>
            </div>
          )}
        </section>

        {/* Stats Cards - Bento Style */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
          <div className="col-span-1 p-4 md:p-6 rounded-xl md:rounded-2xl border bg-card touch-manipulation">
            <div className="space-y-1 md:space-y-2">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Complexe</p>
              <p className="text-2xl md:text-4xl font-bold tracking-tighter">{complexes.length}</p>
            </div>
          </div>
          
          <div className="col-span-1 p-4 md:p-6 rounded-xl md:rounded-2xl border bg-card touch-manipulation">
            <div className="space-y-1 md:space-y-2">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Proprietăți</p>
              <p className="text-2xl md:text-4xl font-bold tracking-tighter text-primary">
                {complexes.reduce((acc, c) => acc + c.total_properties, 0)}
              </p>
            </div>
          </div>
          
          <div className="col-span-1 p-4 md:p-6 rounded-xl md:rounded-2xl border bg-card touch-manipulation">
            <div className="space-y-1 md:space-y-2">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Disponibile</p>
              <p className="text-2xl md:text-4xl font-bold tracking-tighter text-success">
                {complexes.reduce((acc, c) => acc + c.available_properties, 0)}
              </p>
            </div>
          </div>
          
          <div className="col-span-1 p-4 md:p-6 rounded-xl md:rounded-2xl border bg-card touch-manipulation">
            <div className="space-y-1 md:space-y-2">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Vândute</p>
              <p className="text-2xl md:text-4xl font-bold tracking-tighter text-info">
                {complexes.reduce((acc, c) => acc + (c.total_properties - c.available_properties), 0)}
              </p>
            </div>
          </div>
        </section>

        {/* Complexes - Modern Minimalist Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold tracking-tight">Complexe</h3>
            <p className="text-sm text-muted-foreground">{complexes.length} complexe active</p>
          </div>
          
          <div className="grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {complexes.map((complex, index) => {
              const colorIndex = (index % 6) + 1;
              const soldCount = complex.total_properties - complex.available_properties;
              const soldPercentage = Math.round((soldCount / complex.total_properties) * 100);
              
              return (
                <button
                  key={complex.id}
                  onClick={() => navigate(`/complex/${complex.id}`)}
                  className="group text-left p-4 md:p-6 rounded-xl md:rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 active:scale-[0.98] md:hover:scale-[1.02] hover:border-primary/50 touch-manipulation min-h-[180px] md:min-h-0"
                >
                  <div className="space-y-3 md:space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div 
                        className="h-14 w-14 md:h-20 md:w-20 rounded-lg md:rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-110"
                        style={{ backgroundColor: complex.image ? 'transparent' : `hsl(var(--complex-${colorIndex}) / 0.1)` }}
                      >
                        {complex.image ? (
                          <img 
                            src={complex.image} 
                            alt={complex.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Building2 
                            className="h-5 w-5 md:h-6 md:w-6"
                            style={{ color: `hsl(var(--complex-${colorIndex}))` }}
                          />
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    
                    {/* Title */}
                    <div>
                      <h4 className="font-semibold text-base md:text-lg mb-1 group-hover:text-primary transition-colors line-clamp-2">
                        {complex.name}
                      </h4>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {complex.total_properties} proprietăți
                      </p>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-1.5 md:space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Vândute</span>
                        <span className="font-medium">{soldPercentage}%</span>
                      </div>
                      <div className="h-1.5 md:h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${soldPercentage}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex gap-3 md:gap-4 pt-1 md:pt-2">
                      <div className="flex-1 space-y-0.5 md:space-y-1">
                        <p className="text-xs text-muted-foreground">Disponibile</p>
                        <p className="text-base md:text-lg font-semibold text-success">{complex.available_properties}</p>
                      </div>
                      <div className="flex-1 space-y-0.5 md:space-y-1">
                        <p className="text-xs text-muted-foreground">Vândute</p>
                        <p className="text-base md:text-lg font-semibold text-info">{soldCount}</p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
