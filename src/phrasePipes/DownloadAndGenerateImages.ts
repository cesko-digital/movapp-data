import fs from 'node:fs'
import got from 'got'
import sharp, { AvailableFormatInfo, FormatEnum } from 'sharp'
import { Language } from '../locales'
import { Phrase, PhrasePipe } from '../definitions'
import { getExtensionFromUrl } from '../utils/getExtensionFromUrl.js'
import { pipeline } from '../utils/streamPipeline.js'
import { resolve } from 'node:path'

export interface DownloadedImagesMap {
    [key: string]: string
}

export interface Asset {
    height: number
    format: keyof FormatEnum | AvailableFormatInfo
    folder: string
}

export interface PrefixToHeight {
    [key: string]: Asset
}

export class DownloadAndGenerateImages implements PhrasePipe {
    private readonly imagesDir: string
    private processedPhrases: DownloadedImagesMap = {}
    // TODO config file?
    private assetMap: PrefixToHeight = {
        '@1x': { height: 300, format: 'png', folder: 'apple' },
        '@2x': { height: 600, format: 'png', folder: 'apple' },
        '@3x': { height: 900, format: 'png', folder: 'apple' },
        '': { height: 1000, format: 'webp', folder: 'android' },
    }

    constructor(baseDir: string) {
        this.imagesDir = baseDir
    }

    async execute(languagePack: Language, phrase: Phrase): Promise<Phrase> {
        if (phrase.image_url === null) {
            return phrase
        }
        const extension = getExtensionFromUrl(phrase.image_url)

        // TODO only if image has been updated
        // TODO parallel processing?
        console.log('Downloading', phrase.image_url)

        const fileName = `${phrase.id}${extension}`
        const newImageUrl = `https://data.movapp.eu/data/images/${phrase.id}/${fileName}`

        if (typeof this.processedPhrases[phrase.id] !== 'undefined') {
            phrase.image_url = newImageUrl
            return phrase
        }

        const sourceDir = resolve(this.imagesDir, 'source', phrase.id)

        if (!fs.existsSync(sourceDir)) {
            fs.mkdirSync(sourceDir, { recursive: true })
        }

        const filePath = resolve(sourceDir, fileName)
        await this.download(phrase.image_url, filePath)

        for (const name of Object.keys(this.assetMap)) {
            const asset = this.assetMap[name]
            const assetDir = resolve(this.imagesDir, asset.folder, phrase.id)

            if (!fs.existsSync(assetDir)) {
                fs.mkdirSync(assetDir, { recursive: true })
            }

            const targetFilePath = resolve(
                assetDir,
                `${phrase.id}${name}.${asset.format}`
            )
            await this.makeAsset(filePath, targetFilePath, asset)
        }

        this.processedPhrases[phrase.id] = phrase.id

        phrase.image_url = newImageUrl

        return phrase
    }

    /**
     * @see https://github.com/lovell/sharp
     */
    async makeAsset(
        sourceFilePath: string,
        targetFilePath: string,
        asset: Asset
    ) {
        console.log('Making asset', asset, targetFilePath)
        await sharp(sourceFilePath)
            .resize({ height: asset.height, fit: 'outside' })
            .withMetadata({
                exif: {
                    IFD0: {
                        Copyright: 'movapp.eu',
                    },
                },
            })
            .toFormat(asset.format)
            .toFile(targetFilePath)
    }

    async download(url: string, filePath: string) {
        await pipeline(got.stream(url), fs.createWriteStream(filePath))
    }
}
