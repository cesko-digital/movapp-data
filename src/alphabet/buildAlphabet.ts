import log from 'log-beautify'
import {
    AlphabetByLanguage,
    Translation,
    TranslationPipe,
} from '../definitions.js'
import { AirtableBase } from 'airtable/lib/airtable_base'
import { Language } from '../locales.js'
import { runTranslationPipeline } from '../translationPipes/runTranslationPipeline.js'
import { DownloadUrlToForCDN } from '../utils/DownloadUrlToForCDN.js'
import {
    getAttachmentExtension,
    getAttachmentUrl,
} from '../utils/getAttachmentUtils.js'

/**
 * Ensure that all strings are not empty and valid (no spaces, etc)
 */
function separatorStringToArray(string: string): string[] {
    const strings: string[] = []

    for (const value of string.split(',')) {
        const clean = value.trim()
        if (clean === '') {
            continue
        }

        strings.push(clean)
    }

    return strings
}

export async function buildAlphabet(
    language: Language,
    transcriptionLanguages: Language[],
    downloadUrlToForCDN: DownloadUrlToForCDN,
    airtable: AirtableBase,
    translationPipeline: TranslationPipe[]
): Promise<AlphabetByLanguage> {
    const table = airtable(`alphabet_${language}`)
    const alphabet: AlphabetByLanguage = {}

    for (const transcriptionLanguage of transcriptionLanguages) {
        alphabet[transcriptionLanguage] = []
    }

    await table
        .select({
            view: 'Export view',
        })
        .eachPage(async function page(records, fetchNextPage) {
            for (const record of records) {
                const id = String(record.getId())

                const letters = String(record.get('letters'))
                const examplesString = String(record.get('examples'))

                if (letters === '') {
                    log.warning('Letters are not set', id, language)
                    return
                }

                log.debug('Building letter', id, letters, language)
                const lettersArray = separatorStringToArray(letters)
                const examplesArray = separatorStringToArray(examplesString)

                const soundUrl = await downloadUrlToForCDN.execute(
                    getAttachmentUrl(record, 'sound'),
                    `${language}-alphabet`.toLowerCase(),
                    `${id}${getAttachmentExtension(record, 'sound')}`
                )

                for (const transcriptionLanguage of transcriptionLanguages) {
                    const translationExamples: Translation[] = []
                    for (const example of examplesArray) {
                        const translation = await runTranslationPipeline(
                            translationPipeline,
                            // This is little tricky to simulate dictionary
                            // We need to send language for sound (in uk alphabet we are using uk text)
                            // and want transcriptions. In non uk alphabet we want uk transcription.
                            transcriptionLanguage === Language.Uk
                                ? language
                                : transcriptionLanguage,
                            transcriptionLanguage === Language.Uk
                                ? language
                                : language,
                            {
                                sound_url: null,
                                translation: example,
                                transcription: null,
                            }
                        )

                        translationExamples.push(translation)
                    }

                    const transcription = String(
                        record.get(`transcription_${transcriptionLanguage}`)
                    )
                    alphabet[transcriptionLanguage].push({
                        id: id,
                        letters: lettersArray,
                        examples: translationExamples,
                        sound_url: soundUrl, // TODO download and CDN
                        transcription: transcription,
                    })
                }
            }

            fetchNextPage()
        })

    return alphabet
}
