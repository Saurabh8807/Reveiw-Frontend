import { Alert, Box, Button, Card, CardContent, Typography, Chip } from '@mui/material';
import SentimentChip from './SentimentChip';
import ReviewForm from './ReviewForm';

function transcriptForEdit(f) {
  const t = f.transcript?.text || '';
  return t.startsWith('[Auto') ? '' : t;
}

export default function FeedbackCard({ feedback: f, editing, onEdit, onCancelEdit, onSave, onDelete }) {
  const lowConf = (f.transcript?.confidence ?? 0) < 0.5;
  return (
    <Card sx={{ mt: 2, boxShadow: 2, transition: 'box-shadow 0.15s', '&:hover': { boxShadow: 4 } }}>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <SentimentChip label={f.sentiment?.label} confidence={f.sentiment?.confidence} />
          {lowConf && <Chip size="small" color="warning" variant="outlined" label="Low confidence — please review" />}
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="caption" color="text.secondary">
            {f.user?.name} · {new Date(f.createdAt).toLocaleString()}
          </Typography>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          {f.user?.email} · {f.language} · {(f.sizeBytes / 1024).toFixed(0)} KB
          {f.orderId && ` · Order ${f.orderId}`}
        </Typography>

        <Box sx={{ mt: 1.5, borderRadius: 2, bgcolor: '#faf6f0', border: '1px solid rgba(142,42,60,0.1)', p: 1 }}>
          <audio controls src={f.audioUrl} style={{ width: '100%' }} />
        </Box>

        <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 2, bgcolor: '#fbfaf8', borderLeft: '3px solid #e8930c' }}>
          <Typography variant="caption" color="text.secondary">
            TRANSCRIPT · {f.transcript?.engine} · CONF {f.transcript?.confidence}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.6 }}>{f.transcript?.text}</Typography>
          {f.sentiment?.keywords?.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
              {f.sentiment.keywords.map((k) => (
                <Chip key={k} size="small" label={k} sx={{ bgcolor: '#f1e4e6', color: '#8e2a3c', fontSize: 11 }} />
              ))}
            </Box>
          )}
        </Box>

        {f.adminNotes && <Alert severity="info" sx={{ mt: 1.5, borderRadius: 2 }}>Note: {f.adminNotes}</Alert>}

        {!editing
          ? <Box sx={{ mt: 1.5, display: 'flex', gap: 1 }}>
              <Button size="small" variant="outlined" onClick={onEdit}>Review / Correct</Button>
              <Button size="small" color="error" onClick={onDelete}>Delete</Button>
            </Box>
          : <ReviewForm
              key={f.id}
              initialText={transcriptForEdit(f)}
              initialNotes={f.adminNotes || ''}
              onSave={onSave}
              onCancel={onCancelEdit}
            />}
      </CardContent>
    </Card>
  );
}
