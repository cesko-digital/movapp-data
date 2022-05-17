import { Translation, TranslationPipe } from '../definitions'
import { Language } from '../locales'

export async function runTranslationPipeline(
    pipes: TranslationPipe[],
    languagePack: Language,
    language: Language,
    translation: Translation
): Promise<Translation> {
    for (const pipe of pipes) {
        translation = await pipe.execute(languagePack, language, translation)
    }

    return translation
}
