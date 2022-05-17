import sdk from 'microsoft-cognitiveservices-speech-sdk'
import { Translation, TranslationPipe } from '../definitions.js'
import { LanguageBCP47Code, Language, languageToBCP47Code } from '../locales.js'
import { resolve } from 'node:path'
import fs from 'node:fs'
import { md5 } from '../utils/crypto.js'

export interface GeneratedMap {
    [key: string]: string
}

/**
 * TODO config?
 * @see https://docs.microsoft.com/cs-cz/azure/cognitive-services/speech-service/language-support?tabs=speechtotext#text-to-speech
 */
function getVoiceForLanguage(language: LanguageBCP47Code): string {
    switch (language) {
        case LanguageBCP47Code.Cs:
            return 'VlastaNeural'
        case LanguageBCP47Code.En:
            return 'SoniaNeural'
        case LanguageBCP47Code.Pl:
            return 'AgnieszkaNeural'
        case LanguageBCP47Code.Sk:
            return 'LukasNeural'
        case LanguageBCP47Code.Uk:
            return 'PolinaNeural'
    }
}

export class GenerateSound implements TranslationPipe {
    // This prevents build
    private generatedMap: GeneratedMap = {}
    private readonly subscriptionKey: string | undefined
    private useLanguagePackInsteadOfLanguage = false
    private targetDirName: string
    private baseDir: string
    private readonly region: string | undefined

    constructor(
        baseDir: string,
        targetDirName: string,
        subscriptionKey: string | undefined,
        region: string | undefined,
        useLanguagePackInsteadOfLanguage = false
    ) {
        this.useLanguagePackInsteadOfLanguage = useLanguagePackInsteadOfLanguage
        this.targetDirName = targetDirName
        this.baseDir = baseDir
        this.subscriptionKey = subscriptionKey
        this.region = region
    }

    async execute(
        languagePack: Language,
        language: Language,
        translation: Translation
    ): Promise<Translation> {
        const useLanguage = this.useLanguagePackInsteadOfLanguage
            ? languagePack
            : language
        const fileName = `${md5(translation.translation)}.mp3`
        const folderPrefix = fileName.substring(0, 1)
        const directoryName = `${useLanguage}-${this.targetDirName}/${folderPrefix}`
        const soundDir = resolve(this.baseDir, directoryName)

        if (!fs.existsSync(soundDir)) {
            fs.mkdirSync(soundDir)
        }

        const bcp47Code = languageToBCP47Code(useLanguage)
        const filePath = resolve(soundDir, fileName)

        if (!(await this.tts(bcp47Code, filePath, translation.translation))) {
            return translation
        }

        translation.sound_url = `https://data.movapp.eu/data/${directoryName}/${fileName}`

        return translation
    }

    /**
     * Returns false if the sound can't be generated.
     */
    tts(
        languageBCP47Code: LanguageBCP47Code,
        fileName: string,
        text: string
    ): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (typeof this.generatedMap[fileName] === 'string') {
                console.log(
                    'Sound already generated for given translation',
                    text
                )
                resolve(true)
                return
            }

            // TODO add option to force refresh
            if (fs.existsSync(fileName)) {
                console.log('Sound already exists for given translation', text)
                resolve(true)
                return
            }

            if (
                this.subscriptionKey === undefined ||
                this.region === undefined
            ) {
                console.warn(
                    'Skipping sound generation - missing AZURE_SUBSCRIPTION_KEY / AZURE_REGION'
                )
                return false
            }

            console.log('Generating sound', languageBCP47Code, text)

            // now create the audio-config pointing to our stream and
            // the speech config specifying the language.
            const audioConfig = sdk.AudioConfig.fromAudioFileOutput(fileName)

            const speechConfig = sdk.SpeechConfig.fromSubscription(
                <string>this.subscriptionKey,
                <string>this.region
            )
            speechConfig.speechSynthesisOutputFormat =
                sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3
            speechConfig.speechSynthesisLanguage = languageBCP47Code
            speechConfig.speechSynthesisVoiceName =
                languageBCP47Code + '-' + getVoiceForLanguage(languageBCP47Code)

            // create the speech synthesizer.
            const synthesizer = new sdk.SpeechSynthesizer(
                speechConfig,
                audioConfig
            )

            // start the synthesizer and wait for a result.
            synthesizer.speakTextAsync(
                text,
                result => {
                    synthesizer.close()

                    this.generatedMap[fileName] = fileName

                    if (
                        result.reason ===
                        sdk.ResultReason.SynthesizingAudioCompleted
                    ) {
                        console.log(
                            'Finished generating sound',
                            languageBCP47Code,
                            text
                        )

                        resolve(true)
                    } else {
                        reject(result.errorDetails)
                    }
                },
                err => {
                    this.generatedMap[fileName] = fileName

                    synthesizer.close()
                    reject(err)
                }
            )
        })
    }
}
