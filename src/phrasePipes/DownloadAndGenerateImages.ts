import stream from 'node:stream'
import fs from 'node:fs'
import { promisify } from 'node:util'
import { resolve, extname } from 'node:path'
import got from 'got'
import sharp, { AvailableFormatInfo, FormatEnum } from 'sharp'
import { Language } from '../locales'
import { Phrase, PhrasePipe } from '../definitions'

const pipeline = promisify(stream.pipeline)

function getExtensionFromUrl(fullUrl: string) {
    // Remove any left url search params to resolving extension
    const url = new URL(fullUrl)
    url.search = ''

    return extname(url.toString())
}

export interface DownloadedImagesMap {
    [key: string]: string
}

export interface Asset {
    height: number
    format: keyof FormatEnum | AvailableFormatInfo
}

export interface PrefixToHeight {
    [key: string]: Asset
}
export class DownloadAndGenerateImages implements PhrasePipe {
    private imagesDir: string
    private processedPhrases: DownloadedImagesMap = {}
    // TODO config file?
    private assetMap: PrefixToHeight = {
        'iphone-300@1x': { height: 300, format: 'png' },
        'iphone-300@2x': { height: 600, format: 'png' },
        'iphone-300@3x': { height: 900, format: 'png' },
        'android-1000': { height: 1000, format: 'webp' },
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

        if (typeof this.processedPhrases[phrase.id] !== 'undefined') {
            return phrase
        }

        const phraseDir = resolve(this.imagesDir, phrase.id)

        if (!fs.existsSync(phraseDir)) {
            fs.mkdirSync(phraseDir)
        }

        const filePath = resolve(phraseDir, `${phrase.id}${extension}`)
        await this.download(phrase.image_url, filePath)

        for (const name of Object.keys(this.assetMap)) {
            const asset = this.assetMap[name]

            const targetFilePath = resolve(
                phraseDir,
                `${phrase.id}-${name}.${asset.format}`
            )
            await this.makeAsset(filePath, targetFilePath, asset)
        }

        this.processedPhrases[phrase.id] = phrase.id

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
