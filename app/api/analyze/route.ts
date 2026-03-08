import { NextResponse } from "next/server";
import { analisarTexto, els } from "@/lib/analyzer";

export async function POST(req: Request) {
  const body = await req.json();
  const { texto, saltoELS } = body;

  const analise = analisarTexto(texto);
  const resultadoELS = els(texto, saltoELS || 7);

  return NextResponse.json({
    ...analise,
    els: resultadoELS.slice(0, 300),
  });
}
