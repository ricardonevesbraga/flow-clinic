import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirecionar após login bem-sucedido e profile carregado
  useEffect(() => {
    if (user && profile && !authLoading) {
      // Redirecionar baseado no tipo de usuário
      if (profile.is_super_admin) {
        navigate('/super-admin/dashboard');
      } else {
        navigate('/app/dashboard');
      }
    }
  }, [user, profile, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      // O redirecionamento será feito pelo useEffect acima
    } catch (error) {
      // Erro já tratado no AuthContext
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4">
      <Card className="w-full max-w-md card-luxury border-border/50">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
            🏥 FlowClinic 🏥
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="email"
                className="bg-background border-input text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
                className="bg-background border-input text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-accent hover:text-accent/80 hover:underline transition-colors"
              >
                Esqueceu sua senha?
              </Link>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-accent font-semibold hover:text-accent/80 hover:underline transition-colors">
                Cadastre-se
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

