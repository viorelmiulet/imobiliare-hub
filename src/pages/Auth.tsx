import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';

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
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
      
      {/* Main card */}
      <Card className="w-full max-w-md relative backdrop-blur-sm border-border/50 shadow-xl animate-fade-in">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <div className="relative bg-gradient-to-br from-primary to-accent p-4 rounded-2xl shadow-lg">
                <Building2 className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Bine ai venit!
            </CardTitle>
            <CardDescription className="text-base">
              Autentifică-te pentru a accesa platforma
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
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
                className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password" className="text-sm font-medium">
                Parolă
              </Label>
              <Input
                id="login-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 text-base font-medium shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]" 
              disabled={loading}
            >
              {loading ? 'Se autentifică...' : 'Autentificare'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
