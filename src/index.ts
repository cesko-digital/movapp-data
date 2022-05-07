import Airtable from 'airtable'
import {buildCategories} from "./buildCategories.js"
import {buildPhrases} from "./buildPhrases.js"
import {saveJSON} from "./saveToJSON.js"
import {GenerateTranscription} from "./translationPipelines/GenerateTranscription.js";

const baseDir = process.cwd()

const airtable = new Airtable().base('appLciQqZNGDR3J6W')

const languages = ['cs', 'pl', 'sk', 'en']

const phrases = await buildPhrases(airtable, languages, [
    new GenerateTranscription(),
])
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
        'language': language,
        'categories': categoriesInLanguage,
        'phrases': phrasesInLanguage,
    }

    saveJSON(data, `uk-${language}-dictionary.json`, baseDir)
}
