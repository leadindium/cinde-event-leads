'use client';
import { useEffect } from 'react';
import { useLeadStore } from './store';

/**
 * Rehidrata el Zustand store desde localStorage tras el mount.
 * Necesario porque el store usa `skipHydration: true` para evitar
 * mismatch de hidratación entre server (mockLeads) y client (localStorage).
 *
 * Renderiza nada — solo es un side-effect mount.
 */
export default function StoreHydrator() {
  useEffect(() => {
    useLeadStore.persist.rehydrate();
  }, []);
  return null;
}
