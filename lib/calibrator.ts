import fs from "fs";

const humanData = JSON.parse(fs.readFileSync("./data/human.json", "utf-8"));

const iaData = JSON.parse(fs.readFileSync("./data/ia.json", "utf-8"));

function stats(data: any[], key: string) {
  const valores = data.map((d) => d[key]);

  const media = valores.reduce((a, b) => a + b, 0) / valores.length;

  const variancia =
    valores.reduce((a, b) => a + Math.pow(b - media, 2), 0) / valores.length;

  return {
    media,
    desvio: Math.sqrt(variancia),
  };
}

export function classificar(metrica: any) {
  const chaves = Object.keys(metrica);

  let distHuman = 0;
  let distIA = 0;

  chaves.forEach((chave) => {
    const humanStats = stats(humanData, chave);
    const iaStats = stats(iaData, chave);

    const zHuman = Math.abs(
      (metrica[chave] - humanStats.media) / (humanStats.desvio || 1)
    );

    const zIA = Math.abs(
      (metrica[chave] - iaStats.media) / (iaStats.desvio || 1)
    );

    distHuman += zHuman;
    distIA += zIA;
  });

  const probIA = (distHuman / (distHuman + distIA)) * 100;

  return probIA;
}
