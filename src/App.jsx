import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Nav from './components/Nav';
import Guard from './components/Guard';
import { Login, Register } from './pages/Auth';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Guard><UserDashboard /></Guard>} />
          <Route path="/admin" element={<Guard admin><AdminDashboard /></Guard>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
