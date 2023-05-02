import { FieldSet } from 'airtable'
import AirtableRecord from 'airtable/lib/record'
import { Language } from './locales.js'

export interface CategoryName {
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
    name: CategoryName
    /**
     * Description in markdown
     */
    description: string | null
    /**
     * A list of translation ids
     */
    phrases: string[]
    hidden?: boolean
    metacategories?: string[]
    metaOnly?: boolean
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
    execute(
        languagePack: Language,
        phrase: Phrase,
        originalPhraseRecord: PhraseAirtableRecord
    ): Promise<Phrase>
}

export type PhraseAirtableRecord = AirtableRecord<FieldSet>

export interface Alphabet {
    id: string
    sound_url: string | null
    letters: string[]
    transcription: string
    examples: Translation[]
}

export interface AlphabetByLanguage {
    [key: string]: Alphabet[]
}
