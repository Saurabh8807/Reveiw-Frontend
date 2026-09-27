import { Card, CardContent, Grid, Typography, Box } from '@mui/material';

const DEFS = [
  { key: 'total', label: 'Total clips', icon: '🎙️', gradient: 'linear-gradient(135deg, #5f1a27, #8e2a3c)' },
  { key: 'positive', label: 'Positive', icon: '😊', gradient: 'linear-gradient(135deg, #1e7e46, #37a05f)' },
  { key: 'neutral', label: 'Neutral', icon: '😐', gradient: 'linear-gradient(135deg, #8a6d3b, #c49a3f)' },
  { key: 'negative', label: 'Needs attention', icon: '🔔', gradient: 'linear-gradient(135deg, #a93226, #d35450)' },
];

export default function StatsCards({ stats }) {
  if (!stats) return null;
  const values = { total: stats.total, ...stats.bySentiment };
  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {DEFS.map((c) => (
        <Grid item xs={6} md={3} key={c.key}>
          <Card elevation={3} sx={{ backgroundImage: c.gradient, border: 'none', color: '#fff' }}>
            <CardContent sx={{ pb: '16px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4" sx={{ color: '#fff' }}>{values[c.key] ?? 0}</Typography>
                <Box sx={{ fontSize: 26, bgcolor: 'rgba(255,255,255,0.18)', borderRadius: '12px', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {c.icon}
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', mt: 0.5, fontWeight: 600 }}>
                {c.label}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
