import fs from "fs";
import path from "path";

export function saveJSON (content: any, file: string, outDir: string) {
    fs.writeFileSync(path.resolve(outDir, file), JSON.stringify(content, null, '\t'), 'utf8')
}
