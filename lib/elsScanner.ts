export function limparTexto(texto: string) {
  return texto
    .toLowerCase()
    .replace(/[^\p{L}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function gerarELS(palavras: string[], salto: number) {
  const resultado: string[] = [];

  for (let i = salto - 1; i < palavras.length; i += salto) {
    resultado.push(palavras[i]);
  }

  return resultado;
}

export function entropiaPalavras(lista: string[]) {
  const freq: any = {};

  lista.forEach((p) => {
    freq[p] = (freq[p] || 0) + 1;
  });

  const total = lista.length;

  let entropia = 0;

  Object.values(freq).forEach((v: any) => {
    const p = v / total;

    entropia -= p * Math.log2(p);
  });

  return entropia;
}

export function diversidade(lista: string[]) {
  const unicas = new Set(lista);

  return unicas.size / lista.length;
}

function scoreSequencia(seq: string[]) {
  if (seq.length < 6) return 0;
  if (seq.length > 25) return 0;

  const ent = entropiaPalavras(seq);
  const div = diversidade(seq);

  if (div < 0.8) return 0;
  if (ent < 2.5) return 0;

  return ent * div * seq.length;
}

export function scannerELS(texto: string) {
  const clean = limparTexto(texto);

  let palavras = clean.split(" ");

  if (palavras.length > 20000) {
    palavras = palavras.slice(0, 20000);
  }

  const resultados: any[] = [];

  for (let salto = 2; salto <= 50; salto++) {
    const seq = gerarELS(palavras, salto);

    const score = scoreSequencia(seq);

    resultados.push({
      salto,
      tamanho: seq.length,
      score,
      texto: seq.slice(0, 15).join(" "),
    });
  }

  resultados.sort((a, b) => b.score - a.score);

  return resultados.slice(0, 3);
}
