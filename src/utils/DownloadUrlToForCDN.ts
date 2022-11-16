import fs from 'node:fs'
import { resolve } from 'node:path'
import got from 'got'
import { pipeline } from './streamPipeline.js'
export class DownloadUrlToForCDN {
    private baseDir: string

    constructor(baseDir: string) {
        this.baseDir = baseDir
    }

    async execute(
        soundUrl: string | null,
        dirName: string,
        fileName: string
    ): Promise<string | null> {
        if (soundUrl === null) {
            return null
        }

        const dirPath = resolve(this.baseDir, dirName)
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath)
        }

        const filePath = resolve(dirPath, fileName)

        await pipeline(got.stream(soundUrl), fs.createWriteStream(filePath))

        return `https://data.movapp.eu/${dirName}/${fileName}`
    }
}
