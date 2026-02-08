import { CopilotClient } from "@github/copilot-sdk";
import fs from "fs";
import path from "path";

async function main() {
  const parola = process.argv[2];

  if (!parola) {
    console.error("Devi passare una parola o un verbo da tradurre.");
    process.exit(1);
  }

  const client = new CopilotClient();
  await client.start();

  const session = await client.createSession({ model: "gpt-5-mini" });

  const prompt = `
La parola da tradurre è: "${parola}"

ISTRUZIONI OBBLIGATORIE:
1. Se la parola è in ITALIANO: TRADUCI SUBITO IN FRANCESE
2. Se la parola è in FRANCESE: TRADUCI SUBITO IN ITALIANO
3. Identifica se è un sostantivo o un verbo

Se è un SOSTANTIVO:
- Mostra la parola originale
- Mostra la traduzione in francese (obbligatorio)
- Aggiungi pronuncia IPA della traduzione francese
- Indica il genere (maschile/femminile)

Se è un VERBO:
- Mostra la parola originale
- Mostra la traduzione in francese (obbligatorio)
- Aggiungi pronuncia IPA della traduzione francese
- Genera la coniugazione completa per TUTTE le persone (io, tu, lui/lei, noi, voi, loro) nei seguenti tempi:
  * infinito
  * indicativo presente
  * participio passato
  * passato prossimo
  * imperfetto
  * futuro semplice
  * condizionale presente
  * congiuntivo presente

4. Rispondi SOLO in formato HTML pronto da salvare in un file, senza testo aggiuntivo.
`;

  const response = await session.sendAndWait({ prompt });

  const contenuto = response?.data?.content;

  if (!contenuto) {
    console.error("Nessuna risposta dal modello.");
    await session.destroy();
    await client.stop();
    process.exit(1);
  }

  // CREA CARTELLA OUTPUT
  const outDir = "./output";
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  // CREA FILE HTML DELLA PAROLA
  const filePath = path.join(outDir, `${parola}.html`);
  fs.writeFileSync(filePath, contenuto!, "utf8");

  // AGGIORNA INDICE
  const indexPath = path.join(outDir, "index.html");

  let indexContent = "";
  if (fs.existsSync(indexPath)) {
    indexContent = fs.readFileSync(indexPath, "utf8");
  } else {
    indexContent = "<h1>Indice Traduzioni</h1><ul>";
  }

  // aggiungi link e ordina alfabeticamente
  const linkRegex = /<li><a href="\.\/([^"]+)">([^<]+)<\/a><\/li>/g;
  const links: Array<{ file: string; name: string }> = [];
  let match;

  while ((match = linkRegex.exec(indexContent)) !== null) {
    links.push({ file: match[1], name: match[2] });
  }

  // aggiungi il nuovo link se non esiste già
  if (!links.some(link => link.file === `${parola}.html`)) {
    links.push({ file: `${parola}.html`, name: parola });
  }

  // ordina alfabeticamente per nome
  links.sort((a, b) => a.name.localeCompare(b.name));

  // ricostruisci l'indice
  const indexHeader = "<h1>Indice Traduzioni</h1><ul>";
  const indexItems = links.map(link => `<li><a href="./${link.file}">${link.name}</a></li>`).join("");
  indexContent = indexHeader + indexItems + "</ul>";

  fs.writeFileSync(indexPath, indexContent, "utf8");

  console.log(`Creato: ${filePath}`);
  console.log(`Aggiornato indice: ${indexPath}`);

  await session.destroy();
  await client.stop();
}

main();