import { NextResponse } from "next/server";
import { scannerELS } from "@/lib/elsScanner";

export async function POST(req: Request) {
  const { texto } = await req.json();

  const resultado = scannerELS(texto);

  return NextResponse.json(resultado);
}
