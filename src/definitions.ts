import {Language} from "./locales.js";

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
    name_uk: string
    name_main: string
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
    uk: Translation
}

export interface TranslationPipe {
    execute(languagePack: Language, language: Language, translation: Translation): Translation
}
