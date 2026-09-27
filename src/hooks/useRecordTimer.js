import { useEffect, useRef, useState } from 'react';

/** Elapsed-seconds timer with auto-stop at a max duration. */
export function useRecordTimer(maxSec, onLimit) {
  const [secs, setSecs] = useState(0);
  const timer = useRef(null);
  const onLimitRef = useRef(onLimit);
  onLimitRef.current = onLimit;

  const start = () => {
    setSecs(0);
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setSecs((s) => {
        if (s + 1 >= maxSec) {
          clearInterval(timer.current);
          onLimitRef.current?.();
        }
        return s + 1;
      });
    }, 1000);
  };

  const stop = () => clearInterval(timer.current);

  useEffect(() => () => clearInterval(timer.current), []);

  return { secs, startTimer: start, stopTimer: stop };
}
