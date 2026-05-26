'use client'

import { isObservable, observable, toJS } from 'mobx';
import { useState } from 'react';

export function useObservableDraft<T extends object>(original: T) {
  if (!isObservable(original)) {
    throw new Error("The provided object must be an observable.");
  }

  const [draft, setDraft] = useState(() => observable(structuredClone(toJS(original ?? {}))) as T);

  function isDirty() {
    return JSON.stringify(toJS(original ?? {})) !== JSON.stringify(toJS(draft));
  }

  function applyChanges() {
    Object.assign(original ?? {}, toJS(draft));
  }

  function resetChanges() {
    setDraft(observable(structuredClone(toJS(original ?? {}))) as T);
  }

  return [draft, isDirty, resetChanges, applyChanges] as const;
}