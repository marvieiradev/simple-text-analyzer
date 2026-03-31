import { useState } from "react";

export function useComparacao() {
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  async function comparar(texto1: string, texto2: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        body: JSON.stringify({ texto1, texto2 }),
      });

      setResultado(await res.json());
    } finally {
      setLoading(false);
    }
  }

  return { resultado, comparar, loading };
}
