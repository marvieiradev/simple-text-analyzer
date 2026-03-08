export function analisarTexto(texto: string) {
  const palavras = texto.trim().split(/\s+/);
  const frases = texto.split(/[.!?]+/).filter((f) => f.trim().length > 0);

  const totalPalavras = palavras.length;
  const totalFrases = frases.length;

  const mediaFrase = totalPalavras / (totalFrases || 1);

  const diversidadeLexica =
    new Set(palavras.map((p) => p.toLowerCase())).size / totalPalavras;

  const entropiaCaracteres = entropia(texto);
  const entropiaPalavras = entropiaPalavrasCalc(palavras);
  const entropiaValor = entropia(texto);

  const varianciaFrases = variancia(
    frases.map((f) => f.trim().split(/\s+/).length)
  );

  const mediaTamanhoPalavra =
    palavras.reduce((a, b) => a + b.length, 0) / totalPalavras;

  const taxaPalavrasLongas =
    palavras.filter((p) => p.length > 10).length / totalPalavras;

  // ===== SCORE =====

  let scoreIA = 0;

  // Entropia típica GPT ~ 4.2 - 4.8
  if (entropiaCaracteres > 4.2 && entropiaCaracteres < 4.9) scoreIA += 15;

  if (entropiaPalavras > 7.5) scoreIA += 15;

  // Baixa variação estrutural
  if (varianciaFrases < 20) scoreIA += 20;

  // Diversidade muito estável
  if (diversidadeLexica > 0.45 && diversidadeLexica < 0.65) scoreIA += 15;

  // Frases médias típicas IA
  if (mediaFrase > 18 && mediaFrase < 28) scoreIA += 15;

  // Uso controlado de palavras longas
  if (taxaPalavrasLongas < 0.1) scoreIA += 10;

  if (scoreIA > 100) scoreIA = 100;

  return {
    totalPalavras,
    totalFrases,
    mediaFrase,
    diversidadeLexica,
    entropiaCaracteres,
    entropiaPalavras,
    varianciaFrases,
    mediaTamanhoPalavra,
    taxaPalavrasLongas,
    entropia: entropiaValor,
    probabilidadeIA: scoreIA,
    frequencia: frequenciaLetras(texto),
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
