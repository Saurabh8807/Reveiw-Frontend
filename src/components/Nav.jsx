import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Chip } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function Nav() {
  const { user, logout } = useAuth();
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundImage: 'linear-gradient(120deg, #5f1a27 0%, #8e2a3c 55%, #a0344a 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
      }}
    >
      <Toolbar sx={{ maxWidth: 1100, width: '100%', mx: 'auto' }}>
        <Box
          sx={{
            width: 36, height: 36, borderRadius: '12px', mr: 1.5,
            backgroundImage: 'linear-gradient(135deg, #f7b955, #e8930c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
          }}
        >
          🧁
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.1, color: '#fff' }}>
            BakeHouse Mumbai
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 10 }}>
            Voice Feedback Portal
          </Typography>
        </Box>
        {user ? (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {user.role === 'admin' && (
              <Button color="inherit" component={Link} to="/admin" sx={{ bgcolor: 'rgba(255,255,255,0.14)', '&:hover': { bgcolor: 'rgba(255,255,255,0.24)' } }}>
                Dashboard
              </Button>
            )}
            <Button color="inherit" component={Link} to="/">Record</Button>
            <Chip
              avatar={<Avatar sx={{ bgcolor: '#e8930c', color: '#3d2500', fontWeight: 800 }}>{((user.name || user.email || '?')[0] || '?').toUpperCase()}</Avatar>}
              label={`${user.name?.split(' ')[0] || user.email} · ${user.role}`}
              sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.14)', display: { xs: 'none', sm: 'flex' } }}
            />
            <Button color="inherit" onClick={logout} sx={{ opacity: 0.85 }}>Logout</Button>
          </Box>
        ) : (
          <Button color="inherit" component={Link} to="/login">Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
