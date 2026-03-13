import { stopwords } from "./stopworks";

export function limparTexto(texto: string) {
  return texto
    .toLowerCase()
    .replace(/[^\p{L}\s]/gu, "")
    .split(/\s+/)
    .filter((p) => p.length > 2)
    .filter((p) => !stopwords.has(p));
}

export function similaridadeJaccard(a: string[], b: string[]) {
  const setA = new Set(a);
  const setB = new Set(b);

  const intersecao = [...setA].filter((x) => setB.has(x));

  const uniao = new Set([...setA, ...setB]);

  return {
    score: Math.round((intersecao.length / uniao.size) * 100),
    palavrasComuns: intersecao,
  };
}

export function interpretar(score: number) {
  if (score < 20) {
    return {
      nivel: "Muito diferente",
      cor: "blue",
      descricao: "Os textos possuem vocabulário bastante distinto.",
    };
  }

  if (score < 40) {
    return {
      nivel: "Pouca semelhança",
      cor: "green",
      descricao:
        "Algumas palavras coincidem, mas os textos parecem tratar de conteúdos diferentes.",
    };
  }

  if (score < 60) {
    return {
      nivel: "Semelhança moderada",
      cor: "yellow",
      descricao: "Os textos compartilham algumas ideias.",
    };
  }

  if (score < 80) {
    return {
      nivel: "Alta semelhança",
      cor: "orange",
      descricao: "Os textos compartilham muitas palavras ou estruturas.",
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
