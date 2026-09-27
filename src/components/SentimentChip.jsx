import { Chip } from '@mui/material';

const STYLES = {
  positive: { bg: '#e6f4ec', fg: '#1e7e46', dot: '#1e7e46' },
  negative: { bg: '#fdecea', fg: '#b3261e', dot: '#c0392b' },
  neutral: { bg: '#f1ece4', fg: '#6d5c44', dot: '#b09a72' },
};

export default function SentimentChip({ label, confidence }) {
  const key = STYLES[label] ? label : 'neutral';
  const s = STYLES[key];
  return (
    <Chip
      size="small"
      label={`${key.charAt(0).toUpperCase() + key.slice(1)}${confidence != null ? ` · ${Math.round(confidence * 100)}%` : ''}`}
      sx={{
        bgcolor: s.bg,
        color: s.fg,
        '& .MuiChip-label': { display: 'flex', alignItems: 'center', gap: '6px', px: 0.5 },
      }}
      icon={
        <span
          style={{
            width: 8, height: 8, borderRadius: '50%',
            backgroundColor: s.dot, marginLeft: 8, display: 'inline-block',
          }}
        />
      }
    />
  );
}
