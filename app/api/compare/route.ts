import { NextResponse } from "next/server";
import { compararTextos } from "@/lib/similarity";

export async function POST(req: Request) {
  const { texto1, texto2 } = await req.json();

  if (!texto1 || !texto2) {
    return NextResponse.json({
      erro: "Envie dois textos",
    });
  }

  const resultado = compararTextos(texto1, texto2);

  return NextResponse.json(resultado);
}
