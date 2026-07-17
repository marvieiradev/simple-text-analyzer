"use client";

import { useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { Header } from "./components/Header";
import { TabSwitcher } from "./components/TabSwitcher";
import { Button } from "./components/Button";
import { TextAreaInput } from "./components/TextAreaInput";
import { FileUpload } from "./components/FileUpload";

export default function Home() {
  const textLimit = 500000;
  const [tab, setTab] = useState("analise");
  const [texto1, setTexto1] = useState("");
  const [texto2, setTexto2] = useState("");
  const [fileName1, setFileName1] = useState("");
  const [fileName2, setFileName2] = useState("");
  const [resultado, setResultado] = useState<any>(null);
  const [similarity, setSimilarity] = useState<any>(null);
  const [elsResultados, setElsResultados] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    try {
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
    } catch (error) {
      return;
    } finally {
      setIsLoading(false);
    }
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
    setIsLoading(true);
    try {
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
      if (data) {
        window.scrollTo(0, document.body.scrollHeight);
      }
    } catch (error) {
      return;
    } finally {
      setIsLoading(false);
    }
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

  function uploadArquivo(e: any, setTexto: any, fileNameState: string) {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (fileNameState === "fileName1") setFileName1(file.name);
    else setFileName2(file.name);

    reader.onload = (event: any) => {
      const text = event.target.result;
      const limitedText = text.slice(0, textLimit);
      setTexto(limitedText);
    };

    reader.readAsText(file);
  }

  return (
    <div className="w-full max-w-225 mx-auto px-6 flex flex-col gap-6!">
      <div className="max-w-5xl mx-auto flex flex-col gap-4!">
        <Header />
        <TabSwitcher tab={tab} setTab={setTab} />
        {/* ANALISE */}
        <div className="flex flex-col w-full py-10 p-10 container">
          {tab === "analise" && (
            <div className="w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col overflow-hidden py-6">
              <div className="mt-2! p-4!">
                <p className="text-center text-base text-slate-500">
                  Verifique se seu texto foi produzido por IA.{" "}
                  <span className="font-semibold">
                    Os resultados não são garantidos,{" "}
                  </span>
                  tendo em conta que a IA consegue imitar o estilo humano e
                  textos humanos muito técnicos podem ser confundidos com textos
                  produzidos por IA.
                </p>
              </div>

              <TextAreaInput
                value={texto1}
                onChange={setTexto1}
                maxLength={textLimit}
              />

              <FileUpload
                onLoadText={setTexto1}
                fileName={fileName1}
                setFileName={setFileName1}
              />

              <div className="flex justify-center items-center">
                <Button
                  onClick={() => analisar(texto1)}
                  disabled={!texto1}
                  loading={isLoading}
                >
                  Analisar
                </Button>
              </div>

              {resultado && (
                <div className="flex flex-col gap-8 pt-4! items-center">
                  {/* PROBABILIDADE IA */}

                  <div className="space-y-2 w-[95%] justify-center">
                    <p className="text-xl font-bold text-slate-500 text-center mb-4!">
                      Resultado:{" "}
                      <span
                        className={
                          resultado.metricas.status === "ok"
                            ? ""
                            : "text-red-400"
                        }
                      >
                        {resultado.metricas.visual.phase}
                      </span>
                    </p>

                    <div className="bg-slate-200 rounded-full h-4 overflow-hidden">
                      <div
                        className={`bg-${resultado.metricas.visual.color}-500 h-4 rounded-full transition-all duration-500`}
                        style={{
                          width: `${
                            resultado.metricas.status === "ok"
                              ? resultado.metricas.probabilidadeIA
                              : 0
                          }%`,
                        }}
                      />
                    </div>

                    <p className="text-2xl font-bold text-slate-500 text-center mt-2!">
                      {resultado.metricas.status === "ok"
                        ? resultado.metricas.probabilidadeIA.toFixed(1)
                        : 0}
                      % - IA / GPT
                    </p>
                  </div>

                  {/* METRICAS */}

                  {resultado.metricas.status === "ok" && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-[95%]">
                        <div className="bg-slate-50 !p-2 rounded-xl border border-slate-100 gap-2">
                          <p className="text-base text-slate-500 font-semibold">
                            Entropia de Caracteres
                          </p>

                          <p className="text-2xl font-bold text-slate-700">
                            {Number(
                              resultado.metricas.entropiaCaracteres.toFixed(2)
                            )}
                          </p>
                          <div className="mt-2!">
                            <p className="text-sm text-slate-600 md:min-h-35">
                              Entropia de Caracteres mede o nível de variação
                              entre as letras do texto. Quanto maior, mais
                              diverso e menos repetitivo ele é.{" "}
                              <span className="font-semibold">
                                Um valor acima de 4.5, geralmente é alcançado
                                por textos IA.
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="bg-slate-50 !p-2 rounded-xl border border-slate-100 gap-2">
                          <p className="text-base text-slate-500 font-semibold">
                            Entropia de Palavras
                          </p>

                          <p className="text-2xl font-bold text-slate-700">
                            {Number(
                              resultado.metricas.entropiaPalavras.toFixed(2)
                            )}
                          </p>
                          <div className="mt-2!">
                            <p className="text-sm text-slate-600 md:min-h-35">
                              Entropia de Palavras Avalia a variedade das
                              palavras usadas. Textos com maior entropia tendem
                              a ser mais ricos e menos previsíveis.{" "}
                              <span className="font-semibold">
                                Textos humanos geralmente mostram resultados
                                abaixo de 3.5.
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="bg-slate-50 !p-2 rounded-xl border border-slate-100 gap-2">
                          <p className="text-base text-slate-500 font-semibold">
                            Diversidade Lexical
                          </p>

                          <p className="text-2xl font-bold text-slate-700">
                            {Number(
                              resultado.metricas.diversidadeLexica.toFixed(2)
                            )}
                          </p>
                          <div className="mt-2! md:min-h-35">
                            <p className="text-sm text-slate-600">
                              Diversidade Lexical indica quantas palavras
                              diferentes existem em relação ao total. Quanto
                              maior, mais variado é o vocabulário.{" "}
                              <span className="font-semibold">
                                IA constuma ter um vocabulário mais variado,
                                costumam pontuar acima de 0.7.
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4!">
                        <p className="text-base font-semibold text-slate-600 text-center">
                          Esses valores são estimativas e podem variar
                          dependendo do tipo e tamanho do texto.
                        </p>
                      </div>

                      {/* GRAFICO */}

                      <div className="bg-white border border-slate-100 p-6 rounded-xl w-[95%]">
                        <h4 className="font-semibold text-slate-500 mb-4">
                          Frequência de Palavras
                        </h4>

                        <div className="mt-4! py-2!">
                          <p className="text-sm text-slate-600">
                            Mostra quais palavras aparecem com mais frequência
                            no texto, ajudando a identificar repetições e
                            padrões.
                          </p>
                        </div>

                        <div className="w-full h-75 overflow-hidden">
                          <Bar
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                            }}
                            data={{
                              labels: Object.keys(
                                resultado.metricas.frequencia
                              ),
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

                      {/* ELS */}

                      <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 w-[95%] gap-2 mb-6!">
                        <p className="text-base text-slate-500 mb-4 font-semibold">
                          ELS Detectados
                        </p>
                        <div className="mt-4! py-2!">
                          <p className="text-sm text-slate-600">
                            Identifica padrões escondidos no texto, como
                            sequências de letras que podem indicar estruturas
                            repetitivas ou artificiais.
                          </p>
                        </div>

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
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* COMPARAÇÃO */}

          {tab === "comparacao" && (
            <div className="w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col overflow-hidden">
              <div className=" p-2! mt-2!">
                <p className="text-center text-base text-slate-500">
                  Compare dois textos para verificar a similaridade entre eles.{" "}
                  <span className="font-semibold">
                    Útil para detectar plágios e cópias.
                  </span>
                </p>
              </div>

              <div>
                <div>
                  <TextAreaInput
                    value={texto1}
                    onChange={setTexto1}
                    maxLength={textLimit}
                  />

                  <FileUpload
                    id="file1"
                    onLoadText={setTexto1}
                    fileName={fileName1}
                    setFileName={setFileName1}
                  />
                </div>
                <div className="mt-6!">
                  <TextAreaInput
                    value={texto2}
                    onChange={setTexto2}
                    maxLength={textLimit}
                  />

                  <FileUpload
                    id="file2"
                    onLoadText={setTexto2}
                    fileName={fileName2}
                    setFileName={setFileName2}
                  />
                </div>
              </div>

              <div className="w-full flex justify-center items-center mb-4!">
                <Button
                  onClick={() => compararTextos(texto1, texto2)}
                  disabled={!texto1 || !texto2}
                  loading={isLoading}
                >
                  Comparar
                </Button>
              </div>

              <div className="w-full mb-4! flex justify-center items-center">
                {similarity && (
                  <div
                    className={`p-4! rounded-xl text-slate-700 bg-slate-100 w-[95%]`}
                  >
                    <p className="font-semibold text-2xl text-center mb-2!">
                      Similaridade dos textos:{" "}
                      {`${
                        similarity.status === "ok"
                          ? similarity.score.toFixed(0) + "%"
                          : "Erro ao comparar os textos"
                      }`}
                    </p>
                    <div
                      className={`bg-slate-300 rounded-full h-4 overflow-hidden mb-2!`}
                    >
                      <div
                        className={`${color.bar} h-4 rounded-full transition-all duration-500`}
                        style={{
                          width: `${
                            similarity.status === "ok" ? similarity.score : 0
                          }%`,
                        }}
                      />
                    </div>
                    <p
                      className={`${color.text} font-semibold text-2xl text-center`}
                    >
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
