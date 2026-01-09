import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Building2, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn(loginEmail, loginPassword);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-mesh pointer-events-none" />
      <div className="fixed inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
      
      {/* Floating orbs */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="fixed top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-float pointer-events-none" 
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="fixed bottom-20 left-20 w-80 h-80 bg-accent/20 rounded-full blur-[100px] animate-float pointer-events-none" 
        style={{ animationDelay: '-3s' }}
      />
      
      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative"
      >
        <Card className="glass border-border/50 shadow-2xl">
          <CardHeader className="text-center space-y-6 pb-8">
            <motion.div 
              className="flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="relative group">
                <div className="absolute -inset-3 bg-gradient-to-r from-primary to-accent rounded-3xl opacity-50 blur-xl group-hover:opacity-75 transition-opacity duration-500" />
                <div className="relative bg-gradient-to-br from-primary to-accent p-5 rounded-2xl shadow-xl">
                  <Building2 className="h-10 w-10 text-white" />
                </div>
              </div>
            </motion.div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold">
                Bine ai venit!
              </CardTitle>
              <CardDescription className="text-base">
                Autentifică-te pentru a accesa platforma
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Label htmlFor="login-email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="email@exemplu.ro"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="h-12 rounded-xl border-2 transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </motion.div>
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Label htmlFor="login-password" className="text-sm font-medium">
                  Parolă
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl border-2 transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/25 transition-all" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Se autentifică...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Autentificare
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
