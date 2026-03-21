import { stopwords } from "./stopworks";

export function extrairMetricas(texto: string) {
  const palavras = texto.trim().split(/\s+/);
  const frases = texto.split(/[.!?]+/).filter((f) => f.trim().length > 0);

  const totalPalavras = palavras.length;
  const totalFrases = frases.length || 1;

  if (totalPalavras < 30) {
    return {
      probabilidadeIA: -1,
      aviso: "Texto muito curto para análise confiável",
    };
  }

  const textoLower = texto.toLowerCase();

  // MÉTRICAS BASE

  const burst = burstiness(frases); // variação entre frases
  const previs = previsibilidade(palavras); // repetição de padrões

  const bigrams = gerarNGrams(palavras, 2);
  const trigrams = gerarNGrams(palavras, 3);

  const repBigram = repeticaoNGrams(bigrams); // repetição estrutural
  const repTrigram = repeticaoNGrams(trigrams);

  const entropiaCaracteres = entropia(texto);
  const entropiaPalavras = entropiaPalavrasCalc(palavras);

  const mediaFrase = totalPalavras / totalFrases;

  const diversidadeLexica =
    new Set(palavras.map((p) => p.toLowerCase())).size / totalPalavras;

  const varianciaFrases = variancia(
    frases.map((f) => f.trim().split(/\s+/).length)
  );

  const taxaPalavrasLongas =
    palavras.filter((p) => p.length > 10).length / totalPalavras;

  const repeticaoRelativa = 1 - diversidadeLexica;

  // DICIONÁRIOS

  const conectivosIA = [
    "além disso",
    "portanto",
    "dessa forma",
    "nesse contexto",
    "em conclusão",
    "por conseguinte",
    "vale destacar",
    "cabe ressaltar",
    "sob essa perspectiva",
    "diante desse cenário",
    "em síntese",
    "consequentemente",
  ];

  const conectivosHumanos = [
    "eu",
    "acho",
    "sinto",
    "cara",
    "tipo",
    "sabe",
    "assim",
    "enfim",
    "bom",
    "na real",
    "meio",
    "coisa",
    "isso",
    "aquilo",
    "sei lá",
    "às vezes",
    "um pouco",
  ];

  const subjetivos = [
    "acho",
    "sinto",
    "parece",
    "talvez",
    "acredito",
    "imagino",
    "às vezes",
    "me parece",
    "não sei",
    "difícil dizer",
    "depende",
  ];

  // CONECTIVOS NORMALIZADOS

  const taxaIA = contarOcorrencias(textoLower, conectivosIA) / totalPalavras;

  const taxaHumano =
    contarOcorrencias(textoLower, conectivosHumanos) / totalPalavras;

  const taxaSubjetivo =
    contarOcorrencias(textoLower, subjetivos) / totalPalavras;

  // SCORE

  let scoreIA = 0;
  let scoreHumano = 0;

  // ===== IA =====

  scoreIA += (1 - burst) * 40;
  scoreIA += previs * 40;
  scoreIA += repBigram * 60;
  scoreIA += repTrigram * 80;

  scoreIA += repeticaoRelativa * 20;

  if (varianciaFrases < 40) scoreIA += 10;
  if (mediaFrase > 14 && mediaFrase < 24) scoreIA += 10;
  if (taxaPalavrasLongas < 0.15) scoreIA += 5;

  if (previs < 0.2) {
    scoreIA *= 0.85;
  }

  if (previs > 0.25 && repBigram > 0.2 && burst < 0.6) {
    scoreIA += 30;
  }

  if (previs > 0.3 && diversidadeLexica > 0.5 && burst < 0.5) {
    scoreIA += 20;
  }

  if (
    previs > 0.28 &&
    diversidadeLexica > 0.5 &&
    varianciaFrases < 35 &&
    burst < 0.55
  ) {
    scoreIA += 60;
  }

  // equilíbrio artificial (IA disfarçada)
  const equilibrio =
    Math.abs(varianciaFrases - 40) < 10 &&
    Math.abs(diversidadeLexica - 0.55) < 0.1 &&
    previs > 0.18;

  if (equilibrio) scoreIA += 25;

  // conectivos IA normalizados
  if (taxaIA > 0.02) scoreIA += taxaIA * 200;

  // ===== HUMANO =====

  scoreHumano += burst * 20;
  scoreHumano += varianciaFrases * 0.2;

  if (burst > 0.65 && varianciaFrases > 50) scoreHumano += 20;

  if (burst > 0.7) scoreHumano += 25;

  if (previs < 0.18 && burst > 0.6) scoreHumano += 15;
  if (previs < 0.15) scoreHumano += 15;

  if (repBigram < 0.1) scoreHumano += 20;

  if (taxaHumano > 0.02) scoreHumano += taxaHumano * 200;
  if (taxaSubjetivo > 0.015) scoreHumano += taxaSubjetivo * 200;
  if (taxaSubjetivo > 0.01) scoreHumano += 50;

  const tamanhos = frases.map((f) => f.split(/\s+/).length);
  const max = Math.max(...tamanhos);
  const min = Math.min(...tamanhos);

  if (max - min > 15) scoreHumano += 20;

  // CORREÇÃO DE SPAM (repetição simples)

  const top = topPalavras(texto, 3);
  const dominancia = top[0]?.porcentagem || 0;

  if (dominancia > 20) {
    const fator = Math.min(dominancia / 100, 0.85);

    scoreIA *= 1 - fator;
    scoreHumano += 70 * fator;

    // reforço pra vocabulário pobre
    if (diversidadeLexica < 0.4) {
      scoreIA *= 0.2;
    }

    if (dominancia > 40) {
      scoreIA *= 0.1;
      scoreHumano += 30;
    }
  }

  if (repBigram > 0.4 && diversidadeLexica < 0.3) {
    scoreHumano += 20;
  }

  // RESULTADO FINAL

  let totalScore = scoreIA + scoreHumano;
  if (totalScore === 0) totalScore = 1;

  let scoreFinal = (scoreIA / totalScore) * 100;

  if (totalPalavras < 120) scoreFinal *= 0.95;
  if (totalPalavras > 1000) scoreFinal *= 0.9;

  scoreFinal = Math.max(0, Math.min(95, scoreFinal));

  // CONFIANÇA
  let confianca = 0;
  if (scoreFinal > 80) confianca = 0.9;
  else if (scoreFinal > 60) confianca = 0.75;
  else if (scoreFinal > 40) confianca = 0.6;
  else if (scoreFinal > 20) confianca = 0.4;
  else confianca = 0.2;

  // FEEDBACK VISUAL
  let visual = { phase: "", color: "" };
  if (scoreFinal > 70) {
    visual = { phase: "Provavelmente IA", color: "red" };
  } else if (scoreFinal <= 70 && scoreFinal > 40) {
    visual = { phase: "Indeterminado / Híbrido", color: "orange" };
  } else if (scoreFinal <= 40) {
    visual = { phase: "Provavelmente Humano", color: "green" };
  }

  // DEBUG
  /*console.log({
    scoreIA,
    scoreHumano,
    previs,
    burst,
    repBigram,
    repTrigram,
    diversidadeLexica,
    taxaIA,
    taxaHumano,
    dominancia,
    frequencia: frequenciaPalavras(texto),
  });*/

  // RETURN

  return {
    mediaFrase,
    diversidadeLexica,
    entropiaCaracteres,
    entropiaPalavras,
    varianciaFrases,
    probabilidadeIA: scoreFinal,
    frequencia: frequenciaPalavras(texto),
    els: els(texto, Math.max(2, Math.floor(scoreIA / 2))),
    burstiness: burst,
    confianca,
    visual,
  };
}

function entropia(texto: string) {
  const freq: any = {};
  const total = texto.length;

  for (let char of texto) {
    freq[char] = (freq[char] || 0) + 1;
  }

  let entropy = 0;
  for (let char in freq) {
    const p = freq[char] / total;
    entropy -= p * Math.log2(p);
  }

  if (typeof entropy !== "number") entropy = 0;

  return entropy;
}

function entropiaPalavrasCalc(palavras: string[]) {
  const freq: any = {};
  const total = palavras.length;

  palavras.forEach((p) => {
    const key = p.toLowerCase();
    freq[key] = (freq[key] || 0) + 1;
  });

  let entropy = 0;

  for (let key in freq) {
    const p = freq[key] / total;
    entropy -= p * Math.log2(p);
  }

  return entropy;
}

function variancia(array: number[]) {
  const media = array.reduce((a, b) => a + b, 0) / array.length;
  return array.reduce((a, b) => a + Math.pow(b - media, 2), 0) / array.length;
}

export function els(texto: string, salto: number) {
  const limpo = texto.replace(/[^a-zA-ZÀ-ÿ]/g, "").toLowerCase();
  let resultado = "";

  for (let i = 0; i < limpo.length; i += salto) {
    resultado += limpo[i];
  }
  return resultado;
}

function frequenciaPalavras(texto: string) {
  const freq: any = {};

  const palavras = texto
    .toLowerCase()
    .replace(/[^\p{L}\s]/gu, "") // remove pontuação
    .split(/\s+/)
    .filter((p) => p.length > 2) // ignora palavras curtas
    .filter((p) => !stopwords.has(p)); //ignora stopwords

  for (let palavra of palavras) {
    freq[palavra] = (freq[palavra] || 0) + 1;
  }

  // ordena e pega top 10
  const top10 = Object.entries(freq)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 10);

  // transforma de volta em objeto (igual sua função original)
  const resultado: any = {};

  top10.forEach(([palavra, count]) => {
    resultado[palavra] = count;
  });

  return resultado;
}

function frequenciaLetras(texto: string) {
  const freq: any = {};
  const limpo = texto.toLowerCase().replace(/[^a-zà-ÿ]/g, "");

  for (let char of limpo) {
    freq[char] = (freq[char] || 0) + 1;
  }

  return freq;
}

function repeticaoPalavras(palavras: string[]) {
  const freq: any = {};
  palavras.forEach((p) => {
    const key = p.toLowerCase();
    freq[key] = (freq[key] || 0) + 1;
  });

  const total = palavras.length;

  let repeticaoTotal = 0;

  for (let key in freq) {
    if (freq[key] > 1) {
      repeticaoTotal += freq[key] - 1;
    }
  }

  return repeticaoTotal / total;
}

function contarOcorrencias(texto: string, lista: string[]) {
  let count = 0;

  lista.forEach((termo) => {
    const regex = new RegExp(`\\b${termo}\\b`, "gi");
    const matches = texto.match(regex);
    if (matches) count += matches.length;
  });

  return count;
}

function topPalavras(texto: string, topN = 10) {
  const palavras = texto
    .toLowerCase()
    .replace(/[^\p{L}\s]/gu, "")
    .split(/\s+/)
    .filter((p) => p.length > 2);

  const freq: Record<string, number> = {};

  palavras.forEach((p) => {
    freq[p] = (freq[p] || 0) + 1;
  });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([palavra, count]) => ({
      palavra,
      count,
      porcentagem: (count / palavras.length) * 100,
    }));
}

function previsibilidade(palavras: string[]) {
  const freq: any = {};
  let score = 0;

  palavras.forEach((p, i) => {
    const key = p.toLowerCase();

    if (freq[key]) {
      score += freq[key]; // palavra repetida = previsível
    }

    freq[key] = (freq[key] || 0) + 1;
  });

  return score / palavras.length;
}

function burstiness(frases: string[]) {
  const tamanhos = frases.map((f) => f.trim().split(/\s+/).length);

  const media = tamanhos.reduce((a, b) => a + b, 0) / tamanhos.length;

  const variancia =
    tamanhos.reduce((a, b) => a + Math.pow(b - media, 2), 0) / tamanhos.length;

  const desvio = Math.sqrt(variancia);

  return desvio / media;
}

function gerarNGrams(palavras: string[], n = 2) {
  const grams: string[] = [];

  for (let i = 0; i < palavras.length - n + 1; i++) {
    grams.push(palavras.slice(i, i + n).join(" "));
  }

  return grams;
}

function repeticaoNGrams(ngrams: string[]) {
  const freq: Record<string, number> = {};
  let repetidos = 0;

  ngrams.forEach((g) => {
    if (freq[g]) {
      repetidos++;
    }
    freq[g] = (freq[g] || 0) + 1;
  });

  return repetidos / ngrams.length;
}
