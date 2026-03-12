export function limparTexto(texto: string) {
  return texto
    .toLowerCase()
    .replace(/[^\p{L}\s]/gu, "")
    .split(/\s+/)
    .filter((p) => p.length > 2);
}

export function similaridadeJaccard(a: string[], b: string[]) {
  const setA = new Set(a);
  const setB = new Set(b);

  const intersecao = [...setA].filter((x) => setB.has(x));

  const uniao = new Set([...setA, ...setB]);

  return {
    score: intersecao.length / uniao.size,
    palavrasComuns: intersecao,
  };
}

export function interpretar(score: number) {
  if (score < 0.2) {
    return {
      nivel: "Muito diferente",
      cor: "blue",
      descricao: "Os textos possuem vocabulário bastante distinto.",
    };
  }

  if (score < 0.4) {
    return {
      nivel: "Pouca semelhança",
      cor: "green",
      descricao: "Algumas palavras coincidem, mas o conteúdo parece diferente.",
    };
  }

  if (score < 0.6) {
    return {
      nivel: "Semelhança moderada",
      cor: "yellow",
      descricao: "Os textos compartilham algumas ideias.",
    };
  }

  if (score < 0.8) {
    return {
      nivel: "Alta semelhança",
      cor: "orange",
      descricao: "Os textos compartilham muitas palavras e estruturas.",
    };
  }

  return {
    nivel: "Muito semelhante",
    cor: "red",
    descricao: "Os textos são extremamente parecidos.",
  };
}

export function compararTextos(texto1: string, texto2: string) {
  const palavras1 = limparTexto(texto1);
  const palavras2 = limparTexto(texto2);

  const sim = similaridadeJaccard(palavras1, palavras2);

  const interpretacao = interpretar(sim.score);

  return {
    score: sim.score,
    palavrasComuns: sim.palavrasComuns.slice(0, 20),
    ...interpretacao,
  };
}
