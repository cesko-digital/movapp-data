import {Phrase, PhrasePipe} from "../definitions";
import {Language} from "../locales";

export class NormalizeImageUrl implements PhrasePipe {
    execute(languagePack: Language, phrase: Phrase): Phrase {

        if (phrase.image_url === null) {
            return phrase
        }

        // First remove normalize url from "bad" query params

        // Remove url params
        const url = new URL(phrase.image_url);
        url.searchParams.delete('userId')

        phrase.image_url = url.toString()


        return phrase;
    }
}
