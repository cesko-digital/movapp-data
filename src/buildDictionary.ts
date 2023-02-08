import { resolve } from 'node:path'
import fs from 'node:fs'
import log from 'log-beautify'
import { buildCategories } from './dictionary/buildCategories.js'
import { buildPhrases } from './dictionary/buildPhrases.js'
import { saveJSON } from './utils/saveToJSON.js'
import { GenerateTranscription } from './translationPipes/GenerateTranscription.js'
import { Language } from './locales.js'
import { PhrasePipe, TranslationPipe } from './definitions.js'
import { DownloadAndGenerateImages } from './phrasePipes/DownloadAndGenerateImages.js'
import { NormalizeImageUrl } from './phrasePipes/NormalizeImageUrl.js'
import { GenerateSound } from './translationPipes/GenerateSound.js'
import { subscriptionKey, region } from './utils/env.js'
import { airtable } from './utils/airtable.js'
import { setupLog } from './utils/setupLog.js'
import { StripXMLTagsFromTranslation } from './translationPipes/StripXMLTagsFromTranslation.js'

setupLog(log)

const baseDir = resolve(process.cwd(), 'data')
const imageDir = resolve(baseDir, 'images')

if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir)
}

const languages = [Language.Cs, Language.En, Language.Pl, Language.Sk]

const translationPipeline: TranslationPipe[] = [
    new GenerateSound(baseDir, subscriptionKey, region),
    // must be after GenerateSound, GenerateSound needs the XML tags
    new StripXMLTagsFromTranslation(),
    // must be after XML tags are already stripped away
    new GenerateTranscription(),
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

    log.info('Building dictionary', language)

    if (categoriesInLanguage === null) {
        log.warning('Skipping language pack - no categories', language)
        continue
    }

    const phrasesInLanguage = phrases.get(language)

    if (phrasesInLanguage === null) {
        log.warning('Skipping language pack - no phrases', language)
        continue
    }

    // In some languages phrases can be skipped, so we need to remove them from categories by id (airtable will
    // return all phrases in the category).
    for (const category of categoriesInLanguage) {
        const translatedPhrases = []
        for (const phrase of category.phrases) {
            if (typeof phrasesInLanguage[phrase] !== 'undefined') {
                translatedPhrases.push(phrase)
            }
        }

        category.phrases = translatedPhrases
    }

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
