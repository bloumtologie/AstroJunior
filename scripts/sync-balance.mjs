import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const source = resolve(root, "src/data/balance.json");
const target = resolve(root, "public/data/balance.json");

mkdirSync(dirname(target), { recursive: true });
copyFileSync(source, target);
console.log("Synchronized game balance JSON to public/data/balance.json.");
