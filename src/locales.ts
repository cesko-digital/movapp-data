export enum Language {
    Cs = 'cs',
    Uk = 'uk',
    Pl = 'pl',
    Sk = 'sk',
    En = 'en',
}

/**
 * @see https://www.techonthenet.com/js/language_tags.php
 */
export enum LanguageBCP47Code {
    Cs = 'cs-CZ',
    Uk = 'uk-UA',
    Pl = 'pl-PL',
    Sk = 'sk-SK',
    En = 'en-US',
}

export function languageToBCP47Code(language: Language): LanguageBCP47Code {
    switch (language) {
        case Language.Cs:
            return LanguageBCP47Code.Cs
        case Language.Uk:
            return LanguageBCP47Code.Uk
        case Language.Pl:
            return LanguageBCP47Code.Pl
        case Language.Sk:
            return LanguageBCP47Code.Sk
        case Language.En:
            return LanguageBCP47Code.En
    }
}
