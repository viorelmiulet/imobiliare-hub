import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, ArrowRight, Users, LogOut, Shield, TrendingUp, Sparkles, BarChart3, Home, Zap } from "lucide-react";
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
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5 } 
    }
  };

  const stats = [
    { label: "Complexe", value: complexes.length, icon: Building2, gradient: "from-primary to-accent" },
    { label: "Total Proprietăți", value: totalProperties, icon: Home, gradient: "from-accent to-pink-500" },
    { label: "Disponibile", value: availableProperties, icon: Sparkles, gradient: "from-success to-emerald-400" },
    { label: "Vândute", value: soldProperties, icon: TrendingUp, gradient: "from-info to-cyan-400" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-mesh pointer-events-none" />
      <div className="fixed inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
      
      {/* Floating orbs */}
      <div className="fixed top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-float pointer-events-none" />
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-accent/15 rounded-full blur-[120px] animate-float pointer-events-none" style={{ animationDelay: '-3s' }} />
      <div className="fixed top-1/2 left-1/2 w-64 h-64 bg-success/10 rounded-full blur-[80px] animate-pulse-glow pointer-events-none" />

      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 glass border-b"
      >
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 3 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-primary to-accent rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500" />
                <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
              </motion.div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Administrare Vânzări</h1>
                {user && (
                  <p className="text-sm text-muted-foreground hidden sm:block">
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
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10" onClick={() => navigate('/admin')}>
                        <Shield className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  )}
                  <ThemeToggle />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-destructive/10 hover:text-destructive" onClick={signOut}>
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </>
              ) : (
                <>
                  <ThemeToggle />
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      className="rounded-xl shadow-lg shadow-primary/25 px-6 bg-gradient-to-r from-primary to-accent hover:opacity-90" 
                      onClick={() => navigate('/auth')}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Autentificare
                    </Button>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 md:px-6 py-8 md:py-16 space-y-12 md:space-y-20 relative z-10">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center space-y-8 py-8 md:py-20"
        >
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-sm font-medium"
            >
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-semibold">
                {overallSoldPercentage}% din portofoliu vândut
              </span>
            </motion.div>
            
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none">
              <span className="gradient-text-animated">Gestionează</span>
              <br />
              <span className="text-foreground">proprietățile</span>
            </h2>
          </div>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Platformă completă pentru administrarea vânzărilor imobiliare. 
            <span className="text-foreground font-medium"> Monitorizare în timp real.</span>
          </p>
          
          {user && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
            >
              <ClientDialog />
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full sm:w-auto rounded-xl border-2 hover:border-primary/50 hover:bg-primary/5 px-8 h-12"
                  onClick={() => navigate("/clients")}
                >
                  <Users className="h-5 w-5 mr-2" />
                  Lista Clienți
                </Button>
              </motion.div>
            </motion.div>
          )}
        </motion.section>

        {/* Stats Grid */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative p-6 md:p-8 rounded-3xl glass border hover:border-primary/30 transition-all duration-500 cursor-default overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              <div className="relative z-10 space-y-4">
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-4xl md:text-5xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* Complexes Section */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
                Complexe Imobiliare
              </h3>
              <p className="text-muted-foreground">
                Selectează un complex pentru a vedea detaliile
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3 px-5 py-2.5 rounded-full glass border">
              <div className="h-2.5 w-2.5 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium">{complexes.length} active</span>
            </div>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {complexes.map((complex, index) => {
              const colorIndex = (index % 6) + 1;
              const soldCount = complex.total_properties - complex.available_properties;
              const soldPercentage = complex.total_properties > 0 
                ? Math.round((soldCount / complex.total_properties) * 100) 
                : 0;
              
              const gradients = [
                "from-primary to-accent",
                "from-accent to-pink-500",
                "from-success to-emerald-400",
                "from-warning to-orange-400",
                "from-info to-cyan-400",
                "from-pink-500 to-rose-400",
              ];
              
              return (
                <motion.button
                  key={complex.id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/complex/${complex.id}`)}
                  className="group text-left relative p-6 md:p-8 rounded-3xl glass border hover:border-primary/30 transition-all duration-500 overflow-hidden"
                >
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <motion.div 
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="relative"
                      >
                        <div 
                          className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center shadow-xl overflow-hidden`}
                        >
                          {complex.image ? (
                            <img 
                              src={complex.image.startsWith('/') ? complex.image : `/images/${complex.image}`}
                              alt={complex.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Building2 className="h-9 w-9 text-white" />
                          )}
                        </div>
                      </motion.div>
                      
                      <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-primary group-hover:shadow-lg transition-all duration-300">
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                    
                    {/* Title */}
                    <div className="space-y-1">
                      <h4 className="font-bold text-xl md:text-2xl group-hover:text-primary transition-colors duration-300 line-clamp-2">
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
                        <span className={`text-sm font-bold px-3 py-1 rounded-lg bg-gradient-to-r ${gradients[index % gradients.length]} text-white`}>
                          {soldPercentage}%
                        </span>
                      </div>
                      <div className="relative h-3 bg-muted/50 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${soldPercentage}%` }}
                          transition={{ duration: 1.2, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${gradients[index % gradients.length]} rounded-full`}
                        />
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-xl bg-success/5 border border-success/10 group-hover:border-success/20 transition-colors">
                        <p className="text-xs text-muted-foreground mb-1">Disponibile</p>
                        <p className="text-2xl font-bold text-success">
                          {complex.available_properties}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-info/5 border border-info/10 group-hover:border-info/20 transition-colors">
                        <p className="text-xs text-muted-foreground mb-1">Vândute</p>
                        <p className="text-2xl font-bold text-info">
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
