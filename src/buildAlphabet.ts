import { resolve } from 'node:path'
import fs from 'node:fs'
import { saveJSON } from './utils/saveToJSON.js'
import { GenerateTranscription } from './translationPipes/GenerateTranscription.js'
import { Language } from './locales.js'
import { TranslationPipe } from './definitions.js'
import { GenerateSound } from './translationPipes/GenerateSound.js'
import { region, subscriptionKey } from './utils/env.js'
import { airtable } from './utils/airtable.js'
import { buildAlphabet } from './alphabet/buildAlphabet.js'
import { DownloadUrlToForCDN } from './utils/DownloadUrlToForCDN.js'

const baseDir = resolve(process.cwd(), 'data')
const imageDir = resolve(baseDir, 'images')

if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir)
}

interface AlphabetLanguageMap {
    [key: string]: Language[]
}

const languagesMap: AlphabetLanguageMap = {}

languagesMap[Language.Cs] = [Language.Uk]
languagesMap[Language.Uk] = [Language.Cs, Language.Sk, Language.Pl]

const translationPipeline: TranslationPipe[] = [
    new GenerateTranscription(),
    new GenerateSound(baseDir, 'alphabet', subscriptionKey, region, false),
]
const downloadUrlToForCDN = new DownloadUrlToForCDN(baseDir)

for (const mainLanguage in languagesMap) {
    const languages = languagesMap[mainLanguage]

    console.log('Building alphabet', mainLanguage)

    const alphabet = await buildAlphabet(
        mainLanguage as Language,
        languages,
        downloadUrlToForCDN,
        airtable,
        translationPipeline
    )

    for (const language of languages) {
        console.log('Saving alphabet', language)

        const data = {
            source: mainLanguage,
            main: language,
            data: alphabet[language],
        }

        saveJSON(data, `${mainLanguage}-${language}-alphabet.json`, baseDir)
    }
}

// TODO clean up
