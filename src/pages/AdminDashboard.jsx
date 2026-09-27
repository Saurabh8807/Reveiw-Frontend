import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, MenuItem, Alert } from '@mui/material';
import StatsCards from '../components/StatsCards';
import FeedbackCard from '../components/FeedbackCard';
import { useFeedbackAdmin } from '../hooks/useFeedbackAdmin';

export default function AdminDashboard() {
  const [sentiment, setSentiment] = useState('');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const { items, stats, msg, load, saveReview, remove } = useFeedbackAdmin(sentiment, search);

  return (
    <Box sx={{ maxWidth: 1020, mx: 'auto', p: { xs: 2, sm: 3 }, pb: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4">Command Center</Typography>
          <Typography variant="body2" color="text.secondary">
            Listen, review transcripts and track how Mumbai feels about your food.
          </Typography>
        </Box>
      </Box>

      <StatsCards stats={stats} />

      <Paper elevation={2} sx={{ display: 'flex', gap: 2, mt: 2.5, p: 2, flexWrap: 'wrap', alignItems: 'center', borderRadius: 4 }}>
        <TextField select size="small" label="Sentiment" value={sentiment} onChange={(e) => setSentiment(e.target.value)} sx={{ minWidth: 170 }}>
          <MenuItem value="">All sentiments</MenuItem>
          <MenuItem value="positive">😊 Positive</MenuItem>
          <MenuItem value="neutral">😐 Neutral</MenuItem>
          <MenuItem value="negative">😟 Negative</MenuItem>
        </TextField>
        <TextField
          size="small" label="Search transcripts, orders, notes" value={search}
          onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 260, flexGrow: 1 }}
        />
        <Button variant="contained" onClick={load}>Refresh</Button>
      </Paper>

      {msg && <Alert severity="success" sx={{ mt: 2, borderRadius: 3 }}>{msg}</Alert>}
      {stats && stats.lowConfidenceTranscripts > 0 && (
        <Alert severity="warning" sx={{ mt: 2, borderRadius: 3 }}>
          {stats.lowConfidenceTranscripts} transcript(s) need a human ear — noisy audio or no STT key configured.
        </Alert>
      )}

      <Typography variant="h6" sx={{ mt: 3 }}>
        Feedback clips <Typography component="span" variant="body2" color="text.secondary">({(items || []).length})</Typography>
      </Typography>

      {(items || []).map((f) => (
        <FeedbackCard
          key={f.id}
          feedback={f}
          editing={editingId === f.id}
          onEdit={() => setEditingId(f.id)}
          onCancelEdit={() => setEditingId(null)}
          onSave={async (draft) => { await saveReview(f, draft); setEditingId(null); }}
          onDelete={() => remove(f.id)}
        />
      ))}
      {(items || []).length === 0 && (
        <Paper sx={{ mt: 2, textAlign: 'center', py: 5, borderStyle: 'dashed', bgcolor: 'transparent' }}>
          <Typography sx={{ fontSize: 40 }}>🔍</Typography>
          <Typography color="text.secondary">No feedback matches these filters yet.</Typography>
        </Paper>
      )}
    </Box>
  );
}
