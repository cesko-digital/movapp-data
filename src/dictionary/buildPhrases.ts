import { AirtableBase } from 'airtable/lib/airtable_base'
import {
    Phrase,
    PhraseById,
    PhraseMap,
    PhrasePipe,
    TranslationPipe,
} from '../definitions'
import { Language } from '../locales.js'
import { runTranslationPipeline } from '../translationPipes/runTranslationPipeline.js'
import { getAttachmentUrl } from '../utils/getAttachmentUrl.js'

class Phrases {
    mapByLanguage: PhraseMap = {}

    add(language: Language, phrase: Phrase): Phrases {
        if (typeof this.mapByLanguage[language] === 'undefined') {
            this.mapByLanguage[language] = {}
        }

        this.mapByLanguage[language][phrase.id] = phrase

        console.log('Phrase', language, phrase)

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
    phrase: Phrase
): Promise<Phrase> {
    for (const pipe of pipes) {
        phrase = await pipe.execute(languagePack, phrase)
    }

    return phrase
}

export async function buildPhrases(
    airtable: AirtableBase,
    languages: Language[],
    phrasePipeline: PhrasePipe[],
    translationPipeline: TranslationPipe[]
): Promise<Phrases> {
    console.log('Fetching and building phrases')
    const phrasesData = airtable('Phrases data')
    const phrases = new Phrases()

    await phrasesData
        .select({
            view: 'Grid view',
        })
        .eachPage(async function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.

            for (const record of records) {
                const id = String(record.getId())
                const inUkraine = record.get('uk')

                if (typeof inUkraine === 'undefined' || inUkraine === '') {
                    console.log('Skipping phrase for language', 'uk', 'id', id)
                    return
                }

                const imageUrl = getAttachmentUrl(record, 'image')

                for (const language of languages) {
                    const inLanguage = record.get(language)

                    if (
                        typeof inLanguage === 'undefined' ||
                        inLanguage === ''
                    ) {
                        console.log(
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
                        }
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
