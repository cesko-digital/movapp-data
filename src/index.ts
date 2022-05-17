import Airtable from 'airtable'
import { resolve } from 'node:path'
import fs from 'node:fs'
import { buildCategories } from './buildCategories.js'
import { buildPhrases } from './buildPhrases.js'
import { saveJSON } from './saveToJSON.js'
import { GenerateTranscription } from './translationPipes/GenerateTranscription.js'
import { Language } from './locales.js'
import { PhrasePipe, TranslationPipe } from './definitions.js'
import { DownloadAndGenerateImages } from './phrasePipes/DownloadAndGenerateImages.js'
import { NormalizeImageUrl } from './phrasePipes/NormalizeImageUrl.js'
import { GenerateSound } from './translationPipes/GenerateSound.js'

const subscriptionKey = process.env.AZURE_SUBSCRIPTION_KEY
const region = process.env.AZURE_REGION

const baseDir = resolve(process.cwd(), 'data')
const imageDir = resolve(baseDir, 'images')

if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir)
}

const airtable = new Airtable().base('appLciQqZNGDR3J6W')

const languages = [Language.Cs, Language.En, Language.Pl, Language.Sk]

const translationPipeline: TranslationPipe[] = [
    new GenerateTranscription(),
    new GenerateSound(baseDir, subscriptionKey, region),
]
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
        source: Language.Uk,
        main: language,
        categories: categoriesInLanguage,
        phrases: phrasesInLanguage,
    }

    saveJSON(data, `uk-${language}-dictionary.json`, baseDir)
}

// TODO clean up

// TODO: delete non existing images - loop all images and check if the phrase id exists

// TODO: compile packs?
