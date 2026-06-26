import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/store/slices/authSlice';
import type { AppDispatch, RootState } from '@/store/store';
import { Sparkles, Mail, Lock } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('admin@tnp.com');
  const [password, setPassword] = useState('admin123');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError("Please enter both email and password.");
      return;
    }
    setLocalError("");
    dispatch(loginUser({ email, password }));
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden" style={{ background: "var(--gradient-mesh), var(--color-background)" }}>
      <div className="absolute inset-0 -z-0 opacity-60">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full blur-3xl" style={{ background: "color-mix(in oklab, var(--primary) 30%, transparent)" }} />
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full blur-3xl" style={{ background: "color-mix(in oklab, var(--primary-glow) 30%, transparent)" }} />
      </div>
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-10 animate-fade-in">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-14 w-14 rounded-2xl grid place-items-center shadow-elegant mb-4" style={{ background: "var(--gradient-primary)" }}>
            <Sparkles className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Admin Portal Login</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage your job portal</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" className="pl-10" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="pl-10" />
            </div>
          </div>
          
          {displayError && (
            <div className="text-xs font-medium text-[var(--destructive)] bg-[color-mix(in_oklab,var(--destructive)_10%,transparent)] border border-[color-mix(in_oklab,var(--destructive)_25%,transparent)] rounded-lg px-3 py-2">
              {displayError}
            </div>
          )}
          
          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <p className="text-xs text-center text-muted-foreground mt-6">Protected area · TNP Admin</p>
      </div>
    </div>
  );
};

export default Login;
