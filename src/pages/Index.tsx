import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, ArrowRight, Users, LogOut, Shield, TrendingUp, Sparkles, BarChart3 } from "lucide-react";
import { useComplexes } from "@/hooks/useComplexes";
import { useAuth } from "@/hooks/useAuth";
import { ClientDialog } from "@/components/ClientDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const { complexes } = useComplexes();
  const { profile, signOut, user } = useAuth();

  const totalProperties = complexes.reduce((acc, c) => acc + c.total_properties, 0);
  const availableProperties = complexes.reduce((acc, c) => acc + c.available_properties, 0);
  const soldProperties = totalProperties - availableProperties;
  const overallSoldPercentage = totalProperties > 0 ? Math.round((soldProperties / totalProperties) * 100) : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-success/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Fixed Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50"
      >
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-lg" />
                <div className="relative h-11 w-11 md:h-12 md:w-12 rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-accent flex items-center justify-center shadow-xl">
                  <Building2 className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
                </div>
              </motion.div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-bold tracking-tight">
                  Administrare Vânzări
                </h1>
                {user && (
                  <p className="text-xs text-muted-foreground truncate hidden sm:block">
                    {profile?.full_name || profile?.email}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  {profile?.role === 'admin' && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-primary/10 rounded-xl" onClick={() => navigate('/admin')}>
                        <Shield className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                  <ThemeToggle />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-destructive/10 hover:text-destructive rounded-xl" onClick={signOut}>
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </>
              ) : (
                <>
                  <ThemeToggle />
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="rounded-xl shadow-lg shadow-primary/25 px-6" onClick={() => navigate('/auth')}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Autentificare</span>
                      <span className="sm:hidden">Login</span>
                    </Button>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12 space-y-10 md:space-y-16 relative z-10">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-6 md:space-y-8 py-8 md:py-16"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary font-medium"
            >
              <TrendingUp className="h-4 w-4" />
              <span>{overallSoldPercentage}% vândut din portofoliu</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
              <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Gestionează-ți
              </span>
              <br />
              <span className="text-foreground">complexele</span>
            </h2>
          </div>
          
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Platformă modernă pentru administrarea vânzărilor imobiliare. 
            Urmărește proprietățile și clienții în timp real.
          </p>
          
          {user && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center pt-4"
            >
              <ClientDialog />
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full sm:w-auto rounded-xl border-2 hover:border-primary hover:bg-primary/5 px-8"
                  onClick={() => navigate("/clients")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Lista Clienți
                </Button>
              </motion.div>
            </motion.div>
          )}
        </motion.section>

        {/* Stats Cards - Modern Bento Style */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {[
            { label: "Complexe Active", value: complexes.length, icon: Building2, color: "primary" },
            { label: "Total Proprietăți", value: totalProperties, icon: BarChart3, color: "primary" },
            { label: "Disponibile", value: availableProperties, icon: Sparkles, color: "success" },
            { label: "Vândute", value: soldProperties, icon: TrendingUp, color: "info" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`group relative p-5 md:p-6 rounded-2xl md:rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 cursor-default overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative z-10 space-y-3">
                <div className={`h-10 w-10 md:h-12 md:w-12 rounded-xl bg-${stat.color}/10 flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 md:h-6 md:w-6 text-${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className={`text-3xl md:text-4xl font-bold tracking-tight text-${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* Complexes Grid */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                Complexe Imobiliare
              </h3>
              <p className="text-sm text-muted-foreground">
                Selectează un complex pentru a vedea detaliile
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm text-muted-foreground">{complexes.length} active</span>
            </div>
          </div>
          
          <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {complexes.map((complex, index) => {
              const colorIndex = (index % 6) + 1;
              const soldCount = complex.total_properties - complex.available_properties;
              const soldPercentage = complex.total_properties > 0 
                ? Math.round((soldCount / complex.total_properties) * 100) 
                : 0;
              
              return (
                <motion.button
                  key={complex.id}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/complex/${complex.id}`)}
                  className="group text-left relative p-6 md:p-8 rounded-2xl md:rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary/0 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 space-y-5">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <motion.div 
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="relative"
                      >
                        <div 
                          className="absolute inset-0 rounded-2xl blur-xl opacity-50"
                          style={{ backgroundColor: `hsl(var(--complex-${colorIndex}) / 0.3)` }}
                        />
                        <div 
                          className="relative h-16 w-16 md:h-20 md:w-20 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg"
                          style={{ 
                            backgroundColor: complex.image ? 'transparent' : `hsl(var(--complex-${colorIndex}) / 0.15)`,
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
                              className="h-7 w-7 md:h-8 md:w-8"
                              style={{ color: `hsl(var(--complex-${colorIndex}))` }}
                            />
                          )}
                        </div>
                      </motion.div>
                      
                      <div className="h-10 w-10 rounded-xl bg-card border border-border/50 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary-foreground group-hover:translate-x-0.5 transition-all duration-300" />
                      </div>
                    </div>
                    
                    {/* Title & Description */}
                    <div className="space-y-1">
                      <h4 className="font-semibold text-lg md:text-xl group-hover:text-primary transition-colors duration-300 line-clamp-2">
                        {complex.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {complex.total_properties} proprietăți în portofoliu
                      </p>
                    </div>
                    
                    {/* Progress */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Progres vânzări</span>
                        <span className="text-sm font-semibold px-3 py-1 rounded-lg bg-primary/10 text-primary">
                          {soldPercentage}%
                        </span>
                      </div>
                      <div className="relative h-2.5 bg-muted/50 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${soldPercentage}%` }}
                          transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full"
                        />
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-success/5 border border-success/10 group-hover:border-success/20 transition-colors">
                        <p className="text-xs text-muted-foreground mb-1">Disponibile</p>
                        <p className="text-xl font-bold text-success">
                          {complex.available_properties}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-info/5 border border-info/10 group-hover:border-info/20 transition-colors">
                        <p className="text-xs text-muted-foreground mb-1">Vândute</p>
                        <p className="text-xl font-bold text-info">
                          {soldCount}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Index;
