import { Translation, TranslationPipe } from '../definitions.js'
import { Language } from '../locales.js'

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
