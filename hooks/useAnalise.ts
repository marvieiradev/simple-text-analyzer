import { useState } from "react";

export function useAnalise() {
  const [resultado, setResultado] = useState(null);
  const [els, setEls] = useState([]);
  const [loading, setLoading] = useState(false);

  async function analisar(texto: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ texto }),
      });

      const data = await res.json();
      setResultado(data);

      const elsRes = await fetch("/api/els-scan", {
        method: "POST",
        body: JSON.stringify({ texto }),
      });

      setEls(await elsRes.json());
    } finally {
      setLoading(false);
    }
  }

  return { resultado, els, analisar, loading };
}
