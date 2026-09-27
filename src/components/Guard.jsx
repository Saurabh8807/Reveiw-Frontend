import { Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import { useAuth } from '../context/AuthContext';

/** Route guard: requires login, optionally admin role. */
export default function Guard({ children, admin }) {
  const { user, loading } = useAuth();
  if (loading) return <Container sx={{ mt: 4 }}>Loading…</Container>;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}
