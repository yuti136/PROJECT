import { useEffect, useState } from "react";
import { subscribeToast } from "./use-toast";
import { Toast } from "./toast";

export function Toaster() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const unsub = subscribeToast((t) => {
      setToast(t);

      setTimeout(() => {
        setToast(null);
      }, 5000);
    });

    return () => unsub();
  }, []);

  if (!toast) return null;

  return (
    <Toast title={toast.title} description={toast.description} />
  );
}
