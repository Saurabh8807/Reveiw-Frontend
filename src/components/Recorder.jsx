import { useState } from 'react';
import { Box, Button, LinearProgress, MenuItem, TextField, Typography, Alert, Paper } from '@mui/material';
import api from '../api';
import { useMediaRecorder } from '../hooks/useMediaRecorder';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useRecordTimer } from '../hooks/useRecordTimer';

const MAX_SEC = 300; // 5 min, mirrors backend
const MAX_BYTES = 10 * 1024 * 1024;

export default function Recorder({ onUploaded }) {
  const [recording, setRecording] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [language, setLanguage] = useState('en-IN');
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const { blob, start: startMic, stop: stopMic, reset: resetBlob } = useMediaRecorder();
  const { liveTranscript, startSpeech, stopSpeech } = useSpeechRecognition(language);
  const { secs, startTimer, stopTimer } = useRecordTimer(MAX_SEC, () => {
    handleStop();
    setMsg({ t: 'warn', m: `Auto-stopped at ${MAX_SEC}s limit.` });
  });

  const handleStart = async () => {
    setMsg(null);
    resetBlob();
    try {
      await startMic();
      setRecording(true);
      startSpeech();
      startTimer();
    } catch {
      setMsg({ t: 'err', m: 'Microphone blocked. Allow mic access and use HTTPS/localhost.' });
    }
  };

  const handleStop = () => {
    stopTimer();
    stopMic();
    stopSpeech();
    setRecording(false);
  };

  const upload = async () => {
    if (!blob) return;
    if (blob.size > MAX_BYTES) { setMsg({ t: 'err', m: 'File > 10MB. Please record a shorter clip.' }); return; }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('audio', blob, `feedback_${Date.now()}.webm`);
      fd.append('orderId', orderId);
      fd.append('language', language);
      fd.append('clientTranscript', liveTranscript);
      fd.append('durationSec', String(secs));
      const r = await api.post('/feedback/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg({ t: 'ok', m: 'Uploaded! Transcription running — refresh list in a few seconds.' });
      resetBlob();
      onUploaded?.(r.data.feedback);
    } catch (e) {
      setMsg({ t: 'err', m: e.response?.data?.error || 'Upload failed' });
    } finally { setBusy(false); }
  };

  const mmss = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 5, p: { xs: 3, sm: 4 }, overflow: 'hidden', position: 'relative',
        backgroundImage: 'linear-gradient(160deg, #ffffff 0%, #fdf8f1 100%)',
      }}
    >
      <Box
        sx={{
          position: 'absolute', top: -70, right: -70, width: 220, height: 220, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,147,12,0.22), transparent 70%)',
        }}
      />
      <Typography variant="h6">Share your experience</Typography>
      <Typography variant="body2" color="text.secondary">
        Tap record, speak naturally — up to 5 min · English, हिन्दी & मराठी welcome
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mt: 2.5, flexWrap: 'wrap' }}>
        <TextField size="small" label="Order ID (optional)" value={orderId} onChange={(e) => setOrderId(e.target.value)} sx={{ minWidth: 180 }} />
        <TextField size="small" select label="Language" value={language} onChange={(e) => setLanguage(e.target.value)} sx={{ minWidth: 170 }}>
          <MenuItem value="en-IN">English (India)</MenuItem>
          <MenuItem value="hi-IN">हिन्दी</MenuItem>
          <MenuItem value="mr-IN">मराठी</MenuItem>
        </TextField>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mt: 3, flexWrap: 'wrap' }}>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          {recording && (
            <Box
              sx={{
                position: 'absolute', inset: -6, borderRadius: '50%',
                border: '2px solid #c0392b', opacity: 0.6,
                animation: 'pulse-ring 1.4s ease-out infinite',
                '@keyframes pulse-ring': {
                  '0%': { transform: 'scale(0.85)', opacity: 0.7 },
                  '100%': { transform: 'scale(1.25)', opacity: 0 },
                },
              }}
            />
          )}
          <Button
            variant="contained"
            color={recording ? 'inherit' : 'error'}
            onClick={recording ? handleStop : handleStart}
            sx={{
              width: 76, height: 76, borderRadius: '50% !important', p: '0 !important', minWidth: 0,
              fontSize: 26,
              ...(!recording && {
                backgroundImage: 'linear-gradient(135deg, #d35450, #b03a32)',
                boxShadow: '0 10px 24px rgba(176,58,50,0.45)',
              }),
            }}
            aria-label={recording ? 'Stop recording' : 'Start recording'}
          >
            {recording ? '■' : '●'}
          </Button>
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {recording ? `Recording… ${mmss}` : 'Tap the mic to start'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {recording ? 'Speak close to your microphone' : 'Your voice helps our bakers improve'}
          </Typography>
        </Box>
        {recording && (
          <Button variant="outlined" color="inherit" onClick={handleStop} sx={{ ml: 'auto' }}>
            Stop · {mmss}
          </Button>
        )}
      </Box>

      {recording && <LinearProgress color="error" sx={{ mt: 2, borderRadius: 4, height: 8 }} variant="determinate" value={Math.min(100, (secs / MAX_SEC) * 100)} />}
      {liveTranscript && (
        <Alert severity="info" sx={{ mt: 2, borderRadius: 3, bgcolor: '#f3ecff', border: '1px solid #ddd0f5', color: '#4a3a6e' }}>
          <b>Live transcript:</b> {liveTranscript}
        </Alert>
      )}
      {blob && !recording && (
        <Box sx={{ mt: 2.5, p: 2, borderRadius: 3, bgcolor: '#faf6f0', border: '1px solid rgba(142,42,60,0.12)' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Preview your recording ({mmss})</Typography>
          <audio controls src={URL.createObjectURL(blob)} style={{ width: '100%' }} />
          <Box sx={{ display: 'flex', gap: 1.5, mt: 1.5 }}>
            <Button variant="contained" onClick={upload} disabled={busy}>
              {busy ? 'Uploading…' : 'Submit feedback'}
            </Button>
            <Button variant="text" color="inherit" onClick={resetBlob}>Discard</Button>
          </Box>
        </Box>
      )}
      {msg && <Alert severity={msg.t === 'err' ? 'error' : msg.t === 'warn' ? 'warning' : 'success'} sx={{ mt: 2, borderRadius: 3 }}>{msg.m}</Alert>}
    </Paper>
  );
}
