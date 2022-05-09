import Airtable from 'airtable'
import { buildCategories } from './buildCategories.js'
import { buildPhrases } from './buildPhrases.js'
import { saveJSON } from './saveToJSON.js'
import { GenerateTranscription } from './translationPipes/GenerateTranscription.js'
import { Language } from './locales.js'
import { PhrasePipe, TranslationPipe } from './definitions'
import { DownloadAndGenerateImages } from './phrasePipes/DownloadAndGenerateImages.js'
import { NormalizeImageUrl } from './phrasePipes/NormalizeImageUrl.js'
import { resolve } from 'node:path'
import fs from 'node:fs'

const baseDir = process.cwd()
const imageDir = resolve(baseDir, 'images')

if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir)
}

const airtable = new Airtable().base('appLciQqZNGDR3J6W')

const languages = [Language.Cs, Language.En, Language.Pl, Language.Sk]

const translationPipeline: TranslationPipe[] = [new GenerateTranscription()]
const phrasePipeline: PhrasePipe[] = [
    new NormalizeImageUrl(),
    new DownloadAndGenerateImages(imageDir),
]

const phrases = await buildPhrases(
    airtable,
    languages,
    phrasePipeline,
    translationPipeline
)
const categories = await buildCategories(airtable, languages)

for (const language of languages) {
    const categoriesInLanguage = categories.get(language)

    if (categoriesInLanguage === null) {
        console.log('Skipping language pack - no categories', language)
        continue
    }

    const phrasesInLanguage = phrases.get(language)

    if (phrasesInLanguage === null) {
        console.log('Skipping language pack - no phrases', language)
        continue
    }

    console.log('Saving language', language)

    const data = {
        language: language,
        categories: categoriesInLanguage,
        phrases: phrasesInLanguage,
    }

    saveJSON(data, `uk-${language}-dictionary.json`, baseDir)
}

// TODO clean up

// TODO: delete non existing images - loop all images and check if the phrase id exists
