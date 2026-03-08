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
  const [similarity, setSimilarity] = useState("");

  async function analisar(texto: string) {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto, saltoELS: 7 }),
    });

    const data = await res.json();
    setResultado(data);
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
            <div className="w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col gap-6 overflow-hidden py-6">
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
                          width: `${resultado.probabilidadeIA}%`,
                        }}
                      />
                    </div>

                    <p className="text-2xl font-bold text-slate-500">
                      {resultado.probabilidadeIA}%
                    </p>
                  </div>

                  {/* METRICAS */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-[95%]">
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 gap-2">
                      <p className="text-base text-slate-500">Entropia</p>

                      <p className="text-2xl font-semibold text-slate-700">
                        {resultado.entropia.toFixed(4)}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 gap-2">
                      <p className="text-base text-slate-500">
                        Diversidade Lexical
                      </p>

                      <p className="text-2xl font-semibold text-slate-700">
                        {resultado.diversidadeLexica.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* ELS */}

                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 w-[95%] gap-2">
                    <p className="text-base text-slate-500 mb-1">Padrão ELS</p>

                    <p className="text-slate-700 break-all text-sm bg-slate-100">
                      {resultado.els}
                    </p>
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
                          labels: Object.keys(resultado.frequencia),
                          datasets: [
                            {
                              label: "Frequência",
                              data: Object.values(resultado.frequencia),
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
            <div className="w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col gap-6 overflow-hidden">
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

              <div className="w-full flex justify-center items-center">
                <button
                  onClick={() => {
                    if (!texto1 || !texto2) return;

                    const similaridade =
                      new Set(texto1.split(/\s+/)).size /
                      new Set(texto2.split(/\s+/)).size;

                    setSimilarity(similaridade.toFixed(2));
                  }}
                  className="w-50 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition shadow-sm"
                >
                  Comparar Textos
                </button>
              </div>

              <div className="h-15 w-full mt-4 mb-4 flex justify-center items-center">
                {similarity && (
                  <div className="bg-emerald-100 h-10 p-4 rounded-xl w-[95%]">
                    <p className="font-semibold text-2xl text-emerald-500 text-center">
                      Similaridade dos textos: {similarity}
                    </p>
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
