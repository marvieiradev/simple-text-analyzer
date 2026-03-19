export function extrairMetricas(texto: string) {
  const palavras = texto.trim().split(/\s+/);
  const frases = texto.split(/[.!?]+/).filter((f) => f.trim().length > 0);

  const totalPalavras = palavras.length;
  const totalFrases = frases.length || 1;

  if (totalPalavras < 30) {
    return {
      warning: true,
      probabilidadeIA: 0,
      aviso: "Texto muito curto para análise confiável",
    };
  }

  const textoLower = texto.toLowerCase();

  // ===== MÉTRICAS =====
  const burst = burstiness(frases);
  const repeticao = repeticaoPalavras(palavras);
  const previs = previsibilidade(palavras);

  const bigrams = gerarNGrams(palavras, 2);
  const trigrams = gerarNGrams(palavras, 3);

  const repBigram = repeticaoNGrams(bigrams);
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

  // ===== SCORE =====
  let scoreIA = 0;
  let scoreHumano = 0;

  // ===== IA =====
  if (entropiaCaracteres > 4.2 && entropiaCaracteres < 5) scoreIA += 15;
  if (entropiaPalavras > 5 && entropiaPalavras < 6.5) scoreIA += 15;

  if (varianciaFrases < 40) scoreIA += 10;
  if (diversidadeLexica > 0.4 && diversidadeLexica < 0.7) scoreIA += 15;
  if (mediaFrase > 14 && mediaFrase < 24) scoreIA += 15;
  if (taxaPalavrasLongas < 0.15) scoreIA += 10;

  if (repeticao > 0.3) scoreIA += 80;
  else if (repeticao > 0.15) scoreIA += 40;

  //if (burst < 0.55) scoreIA += 15;
  scoreIA += (1 - burst) * 40;

  if (diversidadeLexica > 0.5 && varianciaFrases < 30 && burst < 0.5) {
    scoreIA += 20;
  }

  const conectivosIA = (
    textoLower.match(/(além disso|portanto|dessa forma|nesse contexto)/g) || []
  ).length;

  if (conectivosIA > 2) scoreIA += 10;

  //if (previs > 0.3) scoreIA += 25;
  //else if (previs > 0.15) scoreIA += 10;
  scoreIA += previs * 60;

  //const formalCount = (
  //textoLower.match(/(além disso|portanto|dessa forma|nesse contexto)/g) || []
  //).length;

  //if (formalCount > 2) scoreIA += 8;

  //if (repBigram > 0.2) scoreIA += 20;
  //if (repTrigram > 0.1) scoreIA += 25;
  scoreIA += repBigram * 80;
  scoreIA += repTrigram * 100;

  if (previs > 0.25 && repBigram > 0.2 && burst < 0.6) {
    scoreIA += 30;
  }

  if (previs > 0.15 && previs < 0.25) {
    scoreIA += 5;
  }

  if (previs > 0.2 && diversidadeLexica > 0.45) {
    scoreIA += 5;
  }

  if (previs > 0.2 && diversidadeLexica > 0.45 && varianciaFrases < 50) {
    scoreIA += 20;
  }

  const equilibrio =
    Math.abs(varianciaFrases - 40) < 10 &&
    Math.abs(diversidadeLexica - 0.55) < 0.1 &&
    previs > 0.18;

  if (equilibrio) {
    scoreIA += 25;
  }

  //scoreIA *= 0.85;
  if (scoreIA > 120) scoreIA = 120;

  // ===== HUMANO =====
  //if (burst > 0.7) scoreHumano += 30;
  //if (varianciaFrases > 80) scoreHumano += 15;
  if (burst > 0.65 && varianciaFrases > 50) {
    scoreHumano += 20;
  }
  scoreHumano += burst * 20;
  scoreHumano += varianciaFrases * 0.2;

  const conectivosHumanos = [
    "eu",
    "acho",
    "sinto",
    "talvez",
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
  ];

  let countHuman = conectivosHumanos.reduce(
    (acc, p) => acc + (textoLower.includes(p) ? 1 : 0),
    0
  );

  if (countHuman > 2) scoreHumano += 30;

  const pontuacaoHumana = (texto.match(/(\.\.\.|!|\?)/g) || []).length;
  if (pontuacaoHumana > 2) scoreHumano += 20;

  const frasesCurtas = frases.filter((f) => f.split(/\s+/).length < 6).length;
  if (frasesCurtas > 2) scoreHumano += 20;

  if (/(talvez|acho|parece|às vezes|meio|um pouco)/.test(textoLower)) {
    scoreHumano += 30;
  }

  if (previs < 0.18 && burst > 0.6) scoreHumano += 15;
  if (previs < 0.15) scoreHumano += 15;
  if (previs < 0.12) scoreHumano += 10;

  if (
    /(acho|sinto|parece|talvez|acredito|imagino|às vezes|me parece)/.test(
      textoLower
    )
  ) {
    scoreHumano += 20;
  }

  if (/(talvez|não sei|difícil dizer|depende)/.test(textoLower)) {
    scoreHumano += 30;
  }

  const tamanhos = frases.map((f) => f.split(/\s+/).length);
  const max = Math.max(...tamanhos);
  const min = Math.min(...tamanhos);

  if (max - min > 15) scoreHumano += 25;

  if (repBigram < 0.1) scoreHumano += 20;

  // ===== RESULTADO FINAL (CORRIGIDO) =====
  let totalScore = scoreIA + scoreHumano;

  // evita divisão por zero
  if (totalScore === 0) totalScore = 1;

  // proporção real de IA
  let scoreFinal = (scoreIA / totalScore) * 100;

  // ajustes leves (agora funcionam corretamente)
  if (totalPalavras < 120) scoreFinal *= 0.95;
  if (totalPalavras > 1000) scoreFinal *= 0.9;

  // clamp
  scoreFinal = Math.max(0, Math.min(95, scoreFinal));

  // ===== RETURN (INALTERADO) =====
  return {
    mediaFrase,
    diversidadeLexica,
    entropiaCaracteres,
    entropiaPalavras,
    varianciaFrases,
    probabilidadeIA: scoreFinal,
    frequencia: frequenciaLetras(texto),
    els: els(texto, Math.max(2, Math.floor(scoreIA / 2))),
    burstiness: burst,
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
