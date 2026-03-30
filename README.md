# 🧠 AI Text Analyzer

Um analisador avançado de texto capaz de estimar a probabilidade de um conteúdo ter sido gerado por Inteligência Artificial, utilizando métricas linguísticas, estatísticas e heurísticas.

---

## 🚀 Visão Geral

O **AI Text Analyzer** é um motor de análise textual que avalia padrões presentes em um texto para classificá-lo como:

- 🟢 Humano
- 🟡 Híbrido
- 🔴 Provavelmente IA

Diferente de soluções simples, este projeto não depende de APIs externas ou modelos pesados. Toda a análise é feita localmente com base em métricas linguísticas e estatísticas.

---

## 🧩 Como Funciona

O sistema utiliza um conjunto de métricas para extrair características do texto e calcular dois scores principais:

- **Score IA**
- **Score Humano**

A partir desses valores, é gerada uma probabilidade final.

Além disso, o sistema classifica o tipo de texto para evitar falsos positivos (ex: textos religiosos ou técnicos).

---

## 📊 Métricas Analisadas

### 🧠 Entropia de Caracteres

Mede a variação entre letras no texto.
Textos com alta entropia tendem a ser mais uniformes — característica comum em IA.

---

### 🧠 Entropia de Palavras

Avalia a distribuição das palavras.
Valores muito altos indicam distribuição homogênea (comum em IA ou textos longos formais).

---

### 🧠 Diversidade Lexical

Proporção de palavras únicas em relação ao total.

- Alta → vocabulário variado (IA ou textos ricos)
- Baixa → repetição (humano simples ou textos religiosos)

---

### 🧠 Frequência de Palavras

Identifica as palavras mais utilizadas no texto.
Ajuda a detectar padrões repetitivos e redundância.

---

### 🧠 ELS Detectados

Detecta padrões estruturais recorrentes (sequências de letras/palavras).
Pode indicar comportamento artificial ou geração automatizada.

---

## 🧠 Heurísticas Utilizadas

O algoritmo combina múltiplos fatores:

- Previsibilidade do texto
- Repetição estrutural (bigramas / trigramas)
- Uso de conectivos formais (IA)
- Presença de subjetividade (humano)
- Variação de tamanho de frases
- Distribuição lexical

---

## 🧪 Classificação de Tipo de Texto

Para evitar falsos positivos, o sistema identifica o contexto do texto:

- 📜 Religioso / Formal (ex: Bíblia, Alcorão)
- 🧪 Técnico / Acadêmico
- 💭 Opinativo / Subjetivo
- 📖 Narrativo
- ⚪ Neutro

Essa classificação ajusta o score final de forma inteligente.

---

## 📈 Interpretação dos Resultados

| Probabilidade IA | Classificação       |
| ---------------- | ------------------- |
| 0% – 40%         | 🟢 Humano           |
| 40% – 70%        | 🟡 Híbrido          |
| 70% – 100%       | 🔴 Provavelmente IA |

---

## ⚖️ Precisão e Limitações

### ✅ Pontos Fortes

- Funciona offline
- Rápido e leve
- Resistente a textos repetitivos
- Reduz falsos positivos em textos técnicos/religiosos

### ⚠️ Limitações

- Não garante 100% de precisão
- Textos altamente revisados podem parecer IA
- IA moderna pode simular escrita humana

---

## 🛠️ Estrutura do Projeto

- `extrairMetricas()` → coleta todas as métricas do texto
- `classificarTipoTexto()` → identifica o contexto
- `calcularScore()` → gera score IA vs humano
- `frequenciaPalavras()` → top palavras mais usadas

---

## 💡 Diferenciais

- Não depende de Machine Learning externo
- Totalmente customizável
- Explicabilidade dos resultados
- Fácil integração em aplicações web

---

## 🔌 Possíveis Aplicações

- Verificação de conteúdo acadêmico
- Moderação de plataformas
- Ferramentas de escrita
- Análise de qualidade textual
- SaaS de detecção de IA

---

## 📌 Exemplo de Saída

```json
{
  "probabilidadeIA": 82.3,
  "classificacao": "Provavelmente IA",
  "tipoTexto": "tecnico",
  "metricas": {
    "entropiaCaracteres": 4.9,
    "entropiaPalavras": 3.8,
    "diversidadeLexica": 0.62
  },
  "frequenciaPalavras": {
    "sistema": 5,
    "dados": 4,
    "processo": 3
  }
}
```

---

## 🔍 Comparação entre Textos

O sistema permite comparar dois textos com base na similaridade de vocabulário, utilizando o algoritmo de Jaccard.

### 🧠 Como funciona

1. Os textos são normalizados:

   - Convertidos para minúsculas
   - Remoção de pontuação
   - Remoção de palavras irrelevantes (stopwords)
   - Filtragem de palavras muito curtas

2. Em seguida, são comparados os conjuntos de palavras únicas de cada texto.

3. O índice de similaridade é calculado com base na interseção e união desses conjuntos.

---

### 📊 Resultado da Similaridade

O resultado é um percentual de 0% a 100%:

| Similaridade | Interpretação       |
| ------------ | ------------------- |
| 0% – 20%     | Muito diferente     |
| 20% – 40%    | Pouca semelhança    |
| 40% – 60%    | Semelhança moderada |
| 60% – 80%    | Alta semelhança     |
| 80% – 100%   | Muito semelhante    |

---

### 📌 O que o sistema considera

- Palavras em comum entre os textos
- Presença de vocabulário compartilhado
- Repetição de termos relevantes

Além disso, o sistema também retorna uma lista com as principais palavras em comum entre os textos analisados.

---

### ⚠️ Limitações

- Não considera ordem das palavras
- Não analisa significado (semântica)
- Textos curtos podem gerar resultados imprecisos

---

### 💡 Interpretação prática

Alta similaridade pode indicar:

- Textos derivados de uma mesma fonte
- Reescritas do mesmo conteúdo
- Forte sobreposição de ideias

Baixa similaridade indica maior independência entre os textos.

---

## 🚀 Futuro do Projeto

- Interface visual (dashboard)
- Explicação detalhada do score
- Análise semântica
- Detecção de estilo (humano vs IA)
- API pública

---

## 👨‍💻 Autor

Desenvolvido por **Marcos Vieira**
Focado em soluções inteligentes com análise textual e IA.

---

## 📄 Licença

Este projeto pode ser utilizado para fins educacionais e comerciais, com as devidas adaptações.
