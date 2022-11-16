import log from 'log-beautify'
import { AirtableBase } from 'airtable/lib/airtable_base'
import {
    Phrase,
    PhraseAirtableRecord,
    PhraseById,
    PhraseMap,
    PhrasePipe,
    TranslationPipe,
} from '../definitions'
import { Language } from '../locales.js'
import { runTranslationPipeline } from '../translationPipes/runTranslationPipeline.js'
import { shouldSkipText } from '../utils/shouldSkipText.js'
import { getAttachmentUrl } from '../utils/getAttachmentUtils.js'

class Phrases {
    mapByLanguage: PhraseMap = {}

    add(language: Language, phrase: Phrase): Phrases {
        if (typeof this.mapByLanguage[language] === 'undefined') {
            this.mapByLanguage[language] = {}
        }

        this.mapByLanguage[language][phrase.id] = phrase

        log.debug('Phrase', language, phrase)

        return this
    }

    get(language: string): PhraseById | null {
        const phrases = this.mapByLanguage[language]

        if (typeof phrases === 'undefined') {
            return null
        }

        return phrases
    }
}

async function runPhrasePipeline(
    pipes: PhrasePipe[],
    languagePack: Language,
    phrase: Phrase,
    originalPhraseRecord: PhraseAirtableRecord
): Promise<Phrase> {
    for (const pipe of pipes) {
        phrase = await pipe.execute(languagePack, phrase, originalPhraseRecord)
    }

    return phrase
}

export async function buildPhrases(
    airtable: AirtableBase,
    languages: Language[],
    phrasePipeline: PhrasePipe[],
    translationPipeline: TranslationPipe[]
): Promise<Phrases> {
    log.debug('Fetching and building phrases')
    const phrasesData = airtable('Phrases data')
    const phrases = new Phrases()

    await phrasesData
        .select({
            view: 'Export view',
        })
        .eachPage(async function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.

            for (const record of records) {
                const id = String(record.getId())
                const inUkraine = record.get('uk')

                if (typeof inUkraine === 'undefined' || inUkraine === '') {
                    log.debug('Skipping phrase for language', 'uk', 'id', id)
                    return
                }

                const imageUrl = getAttachmentUrl(record, 'image')

                for (const language of languages) {
                    const inLanguage = record.get(language) as
                        | string
                        | undefined

                    if (shouldSkipText(inLanguage)) {
                        log.debug(
                            'Skipping phrase for language',
                            language,
                            'id',
                            id
                        )
                        continue
                    }

                    const main = await runTranslationPipeline(
                        translationPipeline,
                        language,
                        language,
                        {
                            sound_url: null,
                            translation: String(inLanguage),
                            transcription: null,
                        }
                    )
                    const uk = await runTranslationPipeline(
                        translationPipeline,
                        language,
                        Language.Uk,
                        {
                            sound_url: null,
                            translation: String(inUkraine),
                            transcription: null,
                        }
                    )

                    const phrase = await runPhrasePipeline(
                        phrasePipeline,
                        language,
                        {
                            id: id,
                            main: main,
                            source: uk,
                            image_url: imageUrl,
                        },
                        record
                    )
                    phrases.add(language, phrase)
                }
            }

            // To fetch the next page of records, call `fetchNextPage`.
            // If there are more records, `page` will get called again.
            // If there are no more records, `done` will get called.
            fetchNextPage()
        })

    return phrases
}
