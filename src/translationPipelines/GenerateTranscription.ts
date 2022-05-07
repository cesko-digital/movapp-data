import {Translation, TranslationPipe} from "../definitions";

export class GenerateTranscription implements TranslationPipe {
    execute(translation: Translation): Translation {
        return translation
    }
}
