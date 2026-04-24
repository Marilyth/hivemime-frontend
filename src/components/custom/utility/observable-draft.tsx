'use client'

import { observable, toJS } from 'mobx';
import { useState } from 'react';

export function useObservableDraft<T>(original: T) {
  const [draft, setDraft] = useState(() => observable(structuredClone(toJS(original ?? {}))) as T);

  function isDirty() {
    return JSON.stringify(toJS(original ?? {})) !== JSON.stringify(toJS(draft));
  }

  function resetChanges() {
    setDraft(observable(structuredClone(toJS(original ?? {}))) as T);
  }

  return [draft, isDirty, resetChanges] as const;
}