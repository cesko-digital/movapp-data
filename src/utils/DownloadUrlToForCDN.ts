import fs from 'node:fs'
import { resolve } from 'node:path'
import got from 'got'
import { pipeline } from './streamPipeline.js'
import { getExtensionFromUrl } from './getExtensionFromUrl.js'

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

        const extension = getExtensionFromUrl(soundUrl)
        const fullFileName = `${fileName}${extension}`
        const filePath = resolve(this.baseDir, dirName, fullFileName)

        await pipeline(got.stream(soundUrl), fs.createWriteStream(filePath))

        return `https://data.movapp.eu/data/${dirName}/${fullFileName}`
    }
}
