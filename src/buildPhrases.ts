import {AirtableBase} from "airtable/lib/airtable_base";
import {Phrase, PhraseById, PhraseMap, Translation, TranslationPipe} from "./definitions";
import {Language} from "./locales.js";

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
        const phrases = this.mapByLanguage[language];

        if (typeof phrases === 'undefined') {
            return null
        }

        return phrases
    }
}

function runPipelines(
    pipelines: TranslationPipe[],
    languagePack: Language,
    language: Language,
    translation: Translation
): Translation {
    for (const pipe of pipelines) {
        translation = pipe.execute(languagePack, language, translation)
    }

    return translation
}

export async function buildPhrases(
    airtable: AirtableBase,
    languages: Language[],
    pipelines: TranslationPipe[]
): Promise<Phrases> {

    console.log('Fetching and building phrases')
    const phrasesData = airtable('Phrases data');
    const phrases = new Phrases()

    await phrasesData.select({
        // Selecting the first 3 records in Grid view:
        maxRecords: 20,
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        // We can get empty row
        records.forEach(function (record) {
            const id = String(record.getId())
            const inUkraine = record.get('uk')

            if (typeof inUkraine === 'undefined' || inUkraine === '') {
                console.log('Skipping phrase for language', 'uk', 'id', id)
                return
            }

            const imageUrl = null

            // TODO
            //const image = record.get('image')

            for (const language of languages) {
                const inLanguage = record.get(language)

                if (typeof inLanguage === 'undefined' || inLanguage === '') {
                    console.log('Skipping phrase for language', language, 'id', id)
                    continue
                }

                phrases.add(language, {
                    id: id,
                    main: runPipelines(pipelines, language, language, {
                        sound_url: null,
                        translation: String(inLanguage),
                        transcription: null
                    }),
                    uk: runPipelines(pipelines, language, Language.Uk, {
                        sound_url: null,
                        translation: String(inUkraine),
                        transcription: null
                    }),
                    image_url: imageUrl
                })
            }
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();

    });

    return phrases
}
