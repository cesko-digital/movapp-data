import { Translation, TranslationPipe } from '../definitions.js'
import { Language } from '../locales.js'

/**
 * Translations in Airtable can contain SSML tags that tell the Text-to-Speech engine
 * how exactly to pronounce the phrase.
 * https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/speech-synthesis-markup
 * We need to strip them away when displaying the phrases on the web/apps.
 * Example: `<sub alias="психіат‿р">психіатр</sub>` becomes just `психіатр`.
 */
export class StripXMLTagsFromTranslation implements TranslationPipe {
    async execute(
        _languagePack: Language,
        _language: Language,
        translation: Translation
    ): Promise<Translation> {
        return {
            ...translation,
            translation: translation.translation.replace(/<[^>]*>/g, ''),
        }
    }
}
