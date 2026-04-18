'use client';

import { useEffect, useState } from 'react';

const QUERY = '(max-width: 1023px)';

export function useIsBelowLg(): boolean {
  const [match, setMatch] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const update = () => setMatch(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  return match;
}
