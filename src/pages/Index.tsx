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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 glass-card border-b animate-fade-in">
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                <Building2 className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base md:text-lg font-bold tracking-tight truncate bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Administrare vanzari
                </h1>
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
                    <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10 hover:bg-primary/10" onClick={() => navigate('/admin')}>
                      <Shield className="h-4 w-4" />
                    </Button>
                  )}
                  <ThemeToggle />
                  <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10 hover:bg-destructive/10 hover:text-destructive" onClick={signOut}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <ThemeToggle />
                  <Button variant="default" size="sm" className="text-xs md:text-sm shadow-lg shadow-primary/20" onClick={() => navigate('/auth')}>
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
        <section className="py-6 md:py-12 text-center space-y-3 md:space-y-4 animate-fade-in">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-slide-in">
            Selectează un complex
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Gestionează proprietățile și vânzările din fiecare complex imobiliar
          </p>
          
          {user && (
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center pt-2 md:pt-4 max-w-md mx-auto animate-scale-in">
              <ClientDialog />
              <Button variant="outline" className="w-full sm:w-auto border-2 hover:border-primary hover:shadow-lg transition-all" onClick={() => navigate("/clients")}>
                <Users className="h-4 w-4 mr-2" />
                Clienți
              </Button>
            </div>
          )}
        </section>

        {/* Stats Cards - Bento Style */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto animate-fade-in">
          <div className="col-span-1 glass-card p-4 md:p-6 rounded-xl md:rounded-2xl border-2 hover:border-primary/50 touch-manipulation group transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
            <div className="space-y-1 md:space-y-2">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Complexe</p>
              <p className="text-2xl md:text-4xl font-bold tracking-tighter bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                {complexes.length}
              </p>
            </div>
          </div>
          
          <div className="col-span-1 glass-card p-4 md:p-6 rounded-xl md:rounded-2xl border-2 hover:border-primary/50 touch-manipulation group transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
            <div className="space-y-1 md:space-y-2">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Proprietăți</p>
              <p className="text-2xl md:text-4xl font-bold tracking-tighter bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                {complexes.reduce((acc, c) => acc + c.total_properties, 0)}
              </p>
            </div>
          </div>
          
          <div className="col-span-1 glass-card p-4 md:p-6 rounded-xl md:rounded-2xl border-2 hover:border-success/50 touch-manipulation group transition-all duration-300 hover:shadow-xl hover:shadow-success/10">
            <div className="space-y-1 md:space-y-2">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Disponibile</p>
              <p className="text-2xl md:text-4xl font-bold tracking-tighter bg-gradient-to-br from-success to-success/60 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                {complexes.reduce((acc, c) => acc + c.available_properties, 0)}
              </p>
            </div>
          </div>
          
          <div className="col-span-1 glass-card p-4 md:p-6 rounded-xl md:rounded-2xl border-2 hover:border-info/50 touch-manipulation group transition-all duration-300 hover:shadow-xl hover:shadow-info/10">
            <div className="space-y-1 md:space-y-2">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Vândute</p>
              <p className="text-2xl md:text-4xl font-bold tracking-tighter bg-gradient-to-br from-info to-info/60 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                {complexes.reduce((acc, c) => acc + (c.total_properties - c.available_properties), 0)}
              </p>
            </div>
          </div>
        </section>

        {/* Complexes - Modern Futuristic Grid */}
        <section className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Complexe
            </h3>
            <p className="text-sm text-muted-foreground px-3 py-1 rounded-full glass-card border">
              {complexes.length} complexe active
            </p>
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
                  className="group text-left glass-card p-4 md:p-6 rounded-xl md:rounded-2xl border-2 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 active:scale-[0.98] md:hover:scale-[1.02] touch-manipulation min-h-[180px] md:min-h-0 relative overflow-hidden"
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="space-y-3 md:space-y-4 relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div 
                        className="h-14 w-14 md:h-20 md:w-20 rounded-xl md:rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg"
                        style={{ 
                          backgroundColor: complex.image ? 'transparent' : `hsl(var(--complex-${colorIndex}) / 0.15)`,
                          boxShadow: complex.image ? 'none' : `0 8px 24px hsl(var(--complex-${colorIndex}) / 0.2)`
                        }}
                      >
                        {complex.image ? (
                          <img 
                            src={complex.image.startsWith('/') ? complex.image : `/images/${complex.image}`}
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
                      <div className="h-8 w-8 rounded-full glass-card border flex items-center justify-center group-hover:border-primary transition-all">
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                    
                    {/* Title */}
                    <div>
                      <h4 className="font-semibold text-base md:text-lg mb-1 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/70 group-hover:bg-clip-text group-hover:text-transparent transition-all line-clamp-2">
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
                        <span className="font-medium px-2 py-0.5 rounded-md glass-card border group-hover:border-primary transition-colors">
                          {soldPercentage}%
                        </span>
                      </div>
                      <div className="h-2 md:h-2.5 bg-muted/50 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500 shadow-lg shadow-primary/50"
                          style={{ width: `${soldPercentage}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex gap-3 md:gap-4 pt-1 md:pt-2">
                      <div className="flex-1 space-y-0.5 md:space-y-1 glass-card rounded-lg p-2 border hover:border-success/50 transition-colors">
                        <p className="text-xs text-muted-foreground">Disponibile</p>
                        <p className="text-base md:text-lg font-semibold bg-gradient-to-br from-success to-success/60 bg-clip-text text-transparent">
                          {complex.available_properties}
                        </p>
                      </div>
                      <div className="flex-1 space-y-0.5 md:space-y-1 glass-card rounded-lg p-2 border hover:border-info/50 transition-colors">
                        <p className="text-xs text-muted-foreground">Vândute</p>
                        <p className="text-base md:text-lg font-semibold bg-gradient-to-br from-info to-info/60 bg-clip-text text-transparent">
                          {soldCount}
                        </p>
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
