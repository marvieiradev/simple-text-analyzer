"use client";

import { useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { ArrowBigUp } from "lucide-react";

export default function Home() {
  const [tab, setTab] = useState("analise");
  const [texto1, setTexto1] = useState("");
  const [texto2, setTexto2] = useState("");
  const [resultado, setResultado] = useState<any>(null);
  const [similarity, setSimilarity] = useState<any>(null);
  const [elsResultados, setElsResultados] = useState<any[]>([]);
  const [color, setColor] = useState({
    bg: "bg-gray-100",
    text: "text-gray-700",
    bar: "bg-gray-700",
  });

  const colorMap: any = {
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      bar: "bg-blue-500",
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
      bar: "bg-green-500",
    },
    yellow: {
      bg: "bg-yellow-100",
      text: "text-yellow-600",
      bar: "bg-yellow-500",
    },
    orange: {
      bg: "bg-orange-100",
      text: "text-orange-600",
      bar: "bg-orange-500",
    },
    red: {
      bg: "bg-red-100",
      text: "text-red-600",
      bar: "bg-red-500",
    },
  };

  async function analisar(texto: string) {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ texto }),
    });

    escanearELS(texto);
    const data = await res.json();
    setResultado(data);
  }

  async function calibrar(texto: string, tipo: "human" | "ia") {
    await fetch("/api/calibrate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        texto,
        tipo,
      }),
    });

    alert("Texto usado para calibrar o modelo");
  }

  async function compararTextos(texto1: string, texto2: string) {
    const res = await fetch("/api/compare", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        texto1,
        texto2,
      }),
    });
    const data = await res.json();
    setSimilarity(data);
    setColor(
      colorMap[data?.cor] || {
        bg: "bg-gray-100",
        text: "text-gray-700",
        bar: "bg-gray-700",
      }
    );
    window.scrollTo(0, document.body.scrollHeight);
  }

  async function escanearELS(texto: string) {
    const res = await fetch("/api/els-scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ texto }),
    });

    const data = await res.json();

    setElsResultados(data);
  }

  function uploadArquivo(e: any, setTexto: any) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event: any) => {
      setTexto(event.target.result);
    };

    reader.readAsText(file);
  }

  return (
    <div className="w-full max-w-225 mx-auto px-6 flex flex-col gap-10">
      {/* CONTAINER */}

      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        {/* HEADER */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-800">
            Laboratório de Análise Textual
          </h1>

          <p className="text-slate-500">
            Detector experimental de padrões e probabilidade de IA
          </p>
        </header>
        {/* TABS */}
        <div className="flex justify-center">
          <div className="bg-white shadow-sm rounded-xl p-1 flex gap-1">
            <button
              onClick={() => setTab("analise")}
              className={`px-6 py-2 rounded-lg transition font-medium ${
                tab === "analise"
                  ? "bg-indigo-500 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Análise
            </button>

            <button
              onClick={() => setTab("comparacao")}
              className={`px-6 py-2 rounded-lg transition font-medium ${
                tab === "comparacao"
                  ? "bg-indigo-500 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Comparação
            </button>
          </div>
        </div>
        {/* ANALISE */}
        <div className="flex flex-col w-full py-10 p-10 container">
          {tab === "analise" && (
            <div className="w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col overflow-hidden py-6">
              <textarea
                className="border-2 border-slate-300 rounded-xl min-h-40 focus:ring-2 focus:ring-indigo-400 outline-none p-4"
                placeholder="Cole ou escreva um texto para análise..."
                value={texto1}
                onChange={(e) => setTexto1(e.target.value)}
              />

              <div className="flex flex-wrap gap-4 items-center">
                <label
                  htmlFor="text"
                  className="text-base rounded-full text-white bg-emerald-400"
                >
                  <ArrowBigUp />
                  Selecionar Arquivo
                </label>

                <input
                  type="file"
                  id="text"
                  onChange={(e) => uploadArquivo(e, setTexto1)}
                  className="text-sm"
                />

                <button
                  onClick={() => analisar(texto1)}
                  className="ml-auto px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition shadow-sm"
                >
                  Analisar Texto
                </button>
              </div>

              {resultado && (
                <div className="flex flex-col gap-8 pt-4 items-center">
                  {/* PROBABILIDADE IA */}

                  <div className="space-y-2 w-[95%] justify-center">
                    <p className="font-semibold text-slate-700">
                      Probabilidade de IA
                    </p>

                    <div className="bg-slate-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-4 rounded-full transition-all duration-500"
                        style={{
                          width: `${resultado.metricas.probabilidadeIA}%`,
                        }}
                      />
                    </div>

                    <p className="text-2xl font-bold text-slate-500">
                      {resultado.metricas.probabilidadeIA}%
                    </p>
                  </div>

                  {/* METRICAS */}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-[95%]">
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 gap-2">
                      <p className="text-base text-slate-500">
                        Entropia de Caracteres
                      </p>

                      <p className="text-2xl font-semibold text-slate-700">
                        {resultado.metricas.entropiaCaracteres.toFixed(2)}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 gap-2">
                      <p className="text-base text-slate-500">
                        Entropia de Palavras
                      </p>

                      <p className="text-2xl font-semibold text-slate-700">
                        {resultado.metricas.entropiaPalavras.toFixed(2)}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 gap-2">
                      <p className="text-base text-slate-500">
                        Diversidade Lexical
                      </p>

                      <p className="text-2xl font-semibold text-slate-700">
                        {resultado.metricas.diversidadeLexica.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* ELS */}

                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 w-[95%] gap-2">
                    <p className="text-base text-slate-500 mb-4">
                      ELS Detectados
                    </p>

                    {elsResultados.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {elsResultados.map((r, i) => (
                          <div
                            key={i}
                            style={{ marginTop: "10px" }}
                            className="p-4 mt-4"
                          >
                            <div className="flex gap-2 pb-2 text-slate-700">
                              <span>
                                <b>Salto:</b> {r.salto}
                              </span>
                              <span>
                                <b>Tamanho:</b> {r.tamanho}
                              </span>
                            </div>

                            <div
                              className="bg-gray-200 text-slate-900 overflow-x-auto whitespace-pre-wrap min-h-25"
                              style={{
                                padding: "10px",
                                marginTop: "10px",
                                fontFamily: "monospace",
                              }}
                            >
                              {r.texto}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/*<p className="text-slate-700 break-all text-sm bg-slate-100">
                      {elsResultados}
                    </p> */}
                  </div>

                  {/* GRAFICO */}

                  <div className="bg-white border border-slate-100 p-6 rounded-xl w-[95%]">
                    <h4 className="font-semibold text-slate-700 mb-4">
                      Frequência de Letras
                    </h4>

                    <div className="w-full h-75 overflow-hidden">
                      <Bar
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                        data={{
                          labels: Object.keys(resultado.metricas.frequencia),
                          datasets: [
                            {
                              label: "Frequência",
                              data: Object.values(
                                resultado.metricas.frequencia
                              ),
                              backgroundColor: "#6366f1",
                            },
                          ],
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* COMPARAÇÃO */}

          {tab === "comparacao" && (
            <div className="w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col overflow-hidden">
              <textarea
                className="border-2 border-slate-300 rounded-xl p-4 min-h-40"
                placeholder="Texto 1"
                value={texto1}
                onChange={(e) => setTexto1(e.target.value)}
              />

              <label
                htmlFor="text1"
                className="text-base rounded-full text-white bg-emerald-400"
              >
                <ArrowBigUp />
                Selecionar Arquivo
              </label>
              <input
                type="file"
                id="text1"
                onChange={(e) => uploadArquivo(e, setTexto1)}
              />

              <textarea
                className="border-2 border-slate-300 rounded-xl p-4 min-h-40"
                placeholder="Texto 2"
                value={texto2}
                onChange={(e) => setTexto2(e.target.value)}
              />

              <label
                htmlFor="text2"
                className="text-base rounded-full text-white bg-emerald-400"
              >
                <ArrowBigUp />
                Selecionar Arquivo
              </label>
              <input
                type="file"
                id="text2"
                onChange={(e) => uploadArquivo(e, setTexto2)}
              />

              <div className="w-full flex justify-center items-center mb-4!">
                <button
                  onClick={() => {
                    if (!texto1 || !texto2) return;
                    compararTextos(texto1, texto2);

                    //const similaridade =
                    // new Set(texto1.split(/\s+/)).size /
                    // new Set(texto2.split(/\s+/)).size;

                    // setSimilarity(similaridade.toFixed(2));
                  }}
                  className="w-50 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition shadow-sm"
                >
                  Comparar Textos
                </button>
              </div>

              <div className="w-full mb-4! flex justify-center items-center">
                {similarity && (
                  <div
                    className={`p-4! rounded-xl ${color.text} ${color.bg} w-[95%]`}
                  >
                    <p className="font-semibold text-2xl text-center mb-2!">
                      Similaridade dos textos:{" "}
                      {`${similarity.score.toFixed(0)}%`}
                    </p>
                    <div
                      className={`bg-slate-300 rounded-full h-4 overflow-hidden mb-2!`}
                    >
                      <div
                        className={`${color.bar} h-4 rounded-full transition-all duration-500`}
                        style={{
                          width: `${similarity.score}%`,
                        }}
                      />
                    </div>
                    <p className="font-semibold text-2xl text-center">
                      {similarity.nivel}
                    </p>
                    <p className="font-semibold text-xl text-center">
                      {similarity.descricao}
                    </p>
                    {similarity.palavrasComuns.length > 0 && (
                      <span className="text-sm block mt-3! text-center">
                        Palavras em comum:{" "}
                        <span className="font-semibold">
                          {similarity.palavrasComuns.join(", ")}
                        </span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className="h-10"></footer>
    </div>
  );
}
