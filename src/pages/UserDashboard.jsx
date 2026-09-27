import { useCallback, useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Typography, Alert, Stack, Chip } from '@mui/material';
import Recorder from '../components/Recorder';
import SentimentChip from '../components/SentimentChip';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function UserDashboard() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');
  const { user } = useAuth();

  const load = useCallback(async () => {
    try { const r = await api.get('/feedback/my'); setItems(r.data.feedbacks); }
    catch (e) { setErr(e.response?.data?.error || 'Failed to load'); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const firstName = user?.name?.split(' ')[0] || 'friend';

  return (
    <Box sx={{ maxWidth: 860, mx: 'auto', p: { xs: 2, sm: 3 }, pb: 6 }}>
      <Box
        sx={{
          borderRadius: 5, p: { xs: 3, sm: 4 }, mb: 3, color: '#fff', position: 'relative', overflow: 'hidden',
          backgroundImage: 'linear-gradient(120deg, #5f1a27 0%, #8e2a3c 60%, #b65063 100%)',
          boxShadow: '0 14px 34px rgba(95,26,39,0.35)',
        }}
      >
        <Box
          sx={{
            position: 'absolute', right: -40, top: -60, fontSize: 170, opacity: 0.16,
            transform: 'rotate(-12deg)', userSelect: 'none',
          }}
        >
          🧁
        </Box>
        <Typography variant="h4" sx={{ color: '#fff' }}>Namaste, {firstName}! 🙏</Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', mt: 1, maxWidth: 560 }}>
          Baked something you loved — or something we can do better? Record a quick voice note about
          your order. Our women-led kitchen in Mumbai listens to every single one.
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Chip label={`${items.length} feedback${items.length === 1 ? '' : 's'} shared`} sx={{ bgcolor: 'rgba(255,255,255,0.16)', color: '#fff', fontWeight: 600 }} />
          <Chip label="Avg. reply within a day" sx={{ bgcolor: 'rgba(232,147,12,0.9)', color: '#3d2500', fontWeight: 700 }} />
        </Stack>
      </Box>

      <Recorder onUploaded={load} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 4, mb: 1 }}>
        <Typography variant="h6">Your voice notes</Typography>
        <Chip size="small" label={items.length} sx={{ bgcolor: '#f1e4e6', color: '#8e2a3c', fontWeight: 700 }} />
        <Box sx={{ flexGrow: 1 }} />
        <Button size="small" variant="text" onClick={load} sx={{ color: '#8e2a3c' }}>Refresh</Button>
      </Box>

      {err && <Alert severity="error" sx={{ mt: 2, borderRadius: 3 }}>{err}</Alert>}

      {items.map((f) => (
        <Card key={f.id} sx={{ mt: 2, boxShadow: 2, transition: 'transform 0.15s, box-shadow 0.15s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <SentimentChip label={f.sentiment?.label} confidence={f.sentiment?.confidence} />
              <Typography variant="caption" color="text.secondary">
                {new Date(f.createdAt).toLocaleString()} · {f.language} · {f.durationSec}s
              </Typography>
              {f.orderId && <Chip size="small" variant="outlined" label={`Order ${f.orderId}`} />}
            </Box>
            <Box sx={{ mt: 1.5, borderRadius: 2, bgcolor: '#faf6f0', p: 1 }}>
              <audio controls src={f.audioUrl} style={{ width: '100%' }} />
            </Box>
            <Typography variant="body2" sx={{ mt: 1.5, lineHeight: 1.6 }}>
              <b>Transcript:</b> {f.transcript?.text || 'Transcription in progress…'}
            </Typography>
          </CardContent>
        </Card>
      ))}
      {items.length === 0 && (
        <Card sx={{ mt: 2, textAlign: 'center', py: 4, borderStyle: 'dashed' }}>
          <Typography sx={{ fontSize: 40 }}>🎙️</Typography>
          <Typography color="text.secondary">No feedback yet — your first recording will appear here.</Typography>
        </Card>
      )}
    </Box>
  );
}
