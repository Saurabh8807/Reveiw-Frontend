import { useEffect, useRef, useState } from 'react';

/** Live interim transcript via Web Speech API (no-op where unsupported). */
export function useSpeechRecognition(language) {
  const [liveTranscript, setLiveTranscript] = useState('');
  const recogRef = useRef(null);
  const langRef = useRef(language);
  langRef.current = language;

  const start = () => {
    setLiveTranscript('');
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    try {
      const r = new SR();
      r.lang = langRef.current;
      r.interimResults = true;
      r.continuous = true;
      r.onresult = (e) => {
        let t = '';
        for (const res of e.results) t += res[0].transcript + ' ';
        setLiveTranscript(t.trim().slice(0, 4000));
      };
      recogRef.current = r;
      r.start();
    } catch { /* speech recognition unavailable */ }
  };

  const stop = () => {
    try { recogRef.current?.stop(); } catch { /* already stopped */ }
  };

  useEffect(() => () => {
    try { recogRef.current?.stop(); } catch { /* unmount */ }
  }, []);

  return { liveTranscript, startSpeech: start, stopSpeech: stop };
}
