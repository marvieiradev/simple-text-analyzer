import { NextResponse } from "next/server";
import { extrairMetricas } from "@/lib/analyzer";
import { classificar } from "@/lib/calibrator";

export async function POST(req: Request) {
  const { texto } = await req.json();

  const metricas = extrairMetricas(texto);
  const probIA = classificar(metricas);

  return NextResponse.json({
    metricas,
    probabilidadeIA: probIA,
  });
}
