import { useRef, useState } from 'react';

/** Microphone capture via MediaRecorder. Returns blob on stop. */
export function useMediaRecorder() {
  const [blob, setBlob] = useState(null);
  const mrRef = useRef(null);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : undefined,
    });
    const chunks = [];
    mr.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
    mr.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      setBlob(new Blob(chunks, { type: mr.mimeType || 'audio/webm' }));
    };
    mrRef.current = mr;
    mr.start();
  };

  const stop = () => {
    try { mrRef.current?.stop(); } catch { /* already stopped */ }
  };

  const reset = () => setBlob(null);

  return { blob, start, stop, reset };
}
