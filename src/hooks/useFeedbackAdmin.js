import { useCallback, useEffect, useState } from 'react';
import api from '../api';

/** Admin feedback data: list + stats + review + delete. */
export function useFeedbackAdmin(sentiment, search) {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    const r = await api.get('/feedback', { params: { sentiment: sentiment || undefined, search: search || undefined } });
    setItems(r.data.feedbacks);
    const s = await api.get('/stats/summary');
    setStats(s.data);
  }, [sentiment, search]);

  useEffect(() => { load().catch(() => {}); }, [load]);

  const saveReview = async (feedback, { text, notes }) => {
    await api.put(`/feedback/${feedback.id}/review`, {
      correctedTranscript: text ?? undefined,
      adminNotes: notes ?? undefined,
    });
    setMsg('Review saved, sentiment re-computed.');
    await load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this feedback?')) return;
    await api.delete(`/feedback/${id}`);
    await load();
  };

  return { items, stats, msg, load, saveReview, remove };
}
