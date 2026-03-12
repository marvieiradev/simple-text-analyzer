import { NextResponse } from "next/server";
import fs from "fs";
import { extrairMetricas } from "@/lib/analyzer";

export async function POST(req: Request) {
  const { texto, tipo } = await req.json();

  const metricas = extrairMetricas(texto);

  const file = tipo === "ia" ? "./data/ia.json" : "./data/human.json";

  const data = JSON.parse(fs.readFileSync(file, "utf-8"));

  data.push(metricas);

  fs.writeFileSync(file, JSON.stringify(data, null, 2));

  return NextResponse.json({
    status: "ok",
    message: "Texto usado para calibração",
  });
}
