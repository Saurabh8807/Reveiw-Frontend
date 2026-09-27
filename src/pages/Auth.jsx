import { useState } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, Alert, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Shell({ title, subtitle, children }) {
  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
      <Card sx={{ width: '100%', maxWidth: 440, overflow: 'hidden', boxShadow: 4 }}>
        <Box
          sx={{
            px: 4, pt: 4, pb: 3, color: '#fff',
            backgroundImage: 'linear-gradient(135deg, #5f1a27 0%, #8e2a3c 60%, #a0344a 100%)',
          }}
        >
          <Box
            sx={{
              width: 46, height: 46, borderRadius: '14px', mb: 2, fontSize: 24,
              backgroundImage: 'linear-gradient(135deg, #f7b955, #e8930c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 14px rgba(0,0,0,0.3)',
            }}
          >
            🧁
          </Box>
          <Typography variant="h5" sx={{ color: '#fff' }}>{title}</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>{subtitle}</Typography>
        </Box>
        <CardContent sx={{ p: 4 }}>{children}</CardContent>
      </Card>
    </Box>
  );
}

export function Login() {
  const [email, setEmail] = useState('user@demo.in');
  const [password, setPassword] = useState('User123!');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  const { login, user } = useAuth();
  const go = (u) => nav(u?.role === 'admin' ? '/admin' : '/', { replace: true });
  if (user) { go(user); return null; }

  const submit = async () => {
    setErr(''); setBusy(true);
    try { go(await login(email, password)); }
    catch (e) { setErr(e.response?.data?.error || 'Login failed'); }
    finally { setBusy(false); }
  };

  return (
    <Shell title="Welcome back" subtitle="BakeHouse Mumbai · Voice Feedback Portal">
      <TextField fullWidth margin="normal" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField
        fullWidth margin="normal" type="password" label="Password" value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
      />
      {err && <Alert severity="error" sx={{ mt: 1 }}>{err}</Alert>}
      <Button fullWidth variant="contained" size="large" sx={{ mt: 2.5 }} onClick={submit} disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in'}
      </Button>
      <Typography sx={{ mt: 2, textAlign: 'center' }} variant="body2" color="text.secondary">
        No account? <Link to="/register" style={{ color: '#8e2a3c', fontWeight: 600 }}>Create one</Link>
      </Typography>
      <Divider sx={{ my: 2.5 }}>demo access</Divider>
      <Alert severity="info" sx={{ bgcolor: '#fdf6e9', border: '1px solid #f0dcb4', color: '#6d5416' }}>
        Customer — <b>user@demo.in</b> / User123!<br />
        Admin — <b>admin@bakers.in</b> / Admin123!
      </Alert>
    </Shell>
  );
}

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  const { register } = useAuth();

  const submit = async () => {
    setErr(''); setBusy(true);
    try { await register(name, email, password); nav('/'); }
    catch (e) { setErr(e.response?.data?.error || 'Register failed'); }
    finally { setBusy(false); }
  };

  return (
    <Shell title="Create account" subtitle="Join BakeHouse Mumbai's tasting community">
      <TextField fullWidth margin="normal" label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField fullWidth margin="normal" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField fullWidth margin="normal" type="password" label="Password (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} />
      {err && <Alert severity="error" sx={{ mt: 1 }}>{err}</Alert>}
      <Button fullWidth variant="contained" size="large" sx={{ mt: 2.5 }} onClick={submit} disabled={busy}>
        {busy ? 'Creating…' : 'Create account'}
      </Button>
      <Typography sx={{ mt: 2, textAlign: 'center' }} variant="body2" color="text.secondary">
        <Link to="/login" style={{ color: '#8e2a3c', fontWeight: 600 }}>Back to sign in</Link>
      </Typography>
    </Shell>
  );
}
