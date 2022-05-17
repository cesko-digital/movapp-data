import fs from 'fs'
import path from 'path'

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function saveJSON(content: any, file: string, outDir: string) {
    fs.writeFileSync(
        path.resolve(outDir, file),
        JSON.stringify(content, null, '\t'),
        'utf8'
    )
}
