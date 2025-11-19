import { useState, useCallback } from "react";

let listeners = [];

export function useToast() {
  const notify = useCallback((toast) => {
    listeners.forEach((listener) => listener(toast));
  }, []);

  return { toast: notify };
}

export function subscribeToast(callback) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((cb) => cb !== callback);
  };
}
