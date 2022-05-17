import { Language } from './locales.js'

export interface Value {
    source: string
    main: string
}

export interface CategoryPerLanguage {
    [key: string]: Category
}

export interface CategoriesIdMap {
    [key: string]: CategoryPerLanguage
}

export interface CategoriesPerLanguage {
    [key: string]: Category[]
}

export interface Category {
    id: string
    name: Value
    /**
     * Description in markdown
     */
    description: string | null
    /**
     * A list of translation ids
     */
    phrases: string[]
}

export interface PhraseById {
    [key: string]: Phrase
}

export interface PhraseMap {
    [key: string]: PhraseById
}

export interface Translation {
    translation: string
    transcription: string | null
    sound_url: string | null
}

export interface Phrase {
    id: string
    image_url: string | null
    main: Translation
    source: Translation
}

export interface TranslationPipe {
    execute(
        languagePack: Language,
        language: Language,
        translation: Translation
    ): Promise<Translation>
}

export interface PhrasePipe {
    execute(languagePack: Language, phrase: Phrase): Promise<Phrase>
}
