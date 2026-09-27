import { createTheme } from '@mui/material';

/**
 * BakeHouse Mumbai — warm premium bakery brand.
 * Deep maroon + amber on cream. Rounded geometry, soft shadows, no uppercase buttons.
 */
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#8e2a3c', light: '#b65063', dark: '#5f1a27', contrastText: '#fff' },
    secondary: { main: '#e8930c', light: '#f7b955', dark: '#b26a00', contrastText: '#3d2500' },
    success: { main: '#1e7e46' },
    warning: { main: '#c26a00' },
    error: { main: '#c0392b' },
    background: { default: '#faf6f0', paper: '#ffffff' },
    text: { primary: '#2e2226', secondary: '#7a6a70' },
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h5: { fontWeight: 800, letterSpacing: '-0.015em' },
    h6: { fontWeight: 700, letterSpacing: '-0.01em' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 14 },
  shadows: [
    'none',
    '0 1px 2px rgba(94,26,39,0.06)',
    '0 2px 8px rgba(94,26,39,0.07)',
    '0 6px 18px rgba(94,26,39,0.08)',
    '0 10px 28px rgba(94,26,39,0.10)',
    ...Array(20).fill('0 12px 32px rgba(94,26,39,0.12)'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            'radial-gradient(1200px 500px at 85% -10%, rgba(232,147,12,0.14), transparent 60%), radial-gradient(900px 420px at -10% 0%, rgba(142,42,60,0.10), transparent 55%)',
          backgroundAttachment: 'fixed',
        },
        audio: { borderRadius: 10, outline: 'none' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, padding: '9px 22px' },
        containedPrimary: {
          backgroundImage: 'linear-gradient(135deg, #a0344a 0%, #8e2a3c 60%, #6f1f2e 100%)',
          boxShadow: '0 6px 16px rgba(142,42,60,0.35)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 18, border: '1px solid rgba(142,42,60,0.08)' },
      },
    },
    MuiTextField: { defaultProps: { variant: 'outlined' } },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
  },
});

export default theme;
