import { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

export default function ReviewForm({ initialText, initialNotes, onSave, onCancel }) {
  const [text, setText] = useState(initialText);
  const [notes, setNotes] = useState(initialNotes);

  return (
    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <TextField multiline rows={2} label="Corrected transcript" value={text} onChange={(e) => setText(e.target.value)} />
      <TextField label="Admin notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button size="small" variant="contained" onClick={() => onSave({ text, notes })}>Save</Button>
        <Button size="small" onClick={onCancel}>Cancel</Button>
      </Box>
    </Box>
  );
}
