import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/types/UserContext';
import Header from '@/components/Header';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useUser();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Admin Login Check
    if (email === 'admin123' && password === 'admin123') {
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      toast({
        title: "Admin Login Successful",
        description: "Welcome back, Admin.",
      });
      navigate('/');
    } else if (login(email)) {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate('/profile');
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-24 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-2xl">
              <Lock className="h-6 w-6 mr-2" />
              Sign In
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email or Username</label>
                <Input
                  id="email"
                  type="text"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account? <Link to="/register" className="text-primary hover:underline">Create one</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;