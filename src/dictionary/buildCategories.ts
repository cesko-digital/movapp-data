import log from 'log-beautify'
import { AirtableBase } from 'airtable/lib/airtable_base'
import {
    CategoriesIdMap,
    CategoriesPerLanguage,
    Category,
} from '../definitions'
import { Language } from '../locales.js'
import {shouldSkipText} from "../utils/shouldSkipText.js";

class Categories {
    mapById: CategoriesIdMap = {}
    mapPerLanguage: CategoriesPerLanguage = {}

    add(language: Language, category: Category): Categories {
        if (typeof this.mapById[category.id] === 'undefined') {
            this.mapById[category.id] = {}
        }

        if (typeof this.mapPerLanguage[language] === 'undefined') {
            this.mapPerLanguage[language] = []
        }

        this.mapById[category.id][language] = category
        this.mapPerLanguage[language].push(category)

        log.debug('Category', language, category)

        return this
    }

    get(language: Language): Category[] | null {
        const categories = this.mapPerLanguage[language]
        if (typeof categories === 'undefined' || categories.length === 0) {
            return null
        }

        return categories
    }
}

export async function buildCategories(
    airtable: AirtableBase,
    languages: Language[]
): Promise<Categories> {
    const categories = new Categories()

    log.debug('Fetching and building categories')

    const categoriesTable = airtable('Categories data')

    await categoriesTable
        .select({
            view: 'Export view',
        })
        .eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.

            // We can get empty row
            records.forEach(function (record) {
                const id = String(record.getId())
                const inUkraine = record.get(Language.Uk)

                if (typeof inUkraine === 'undefined' || inUkraine === '') {
                    log.debug(
                        'Skipping category for language',
                        Language.Uk,
                        'id',
                        id
                    )
                    return
                }

                const phrasesData = record.get('Phrases data') as
                    | string[]
                    | null

                let phrases = []
                if (phrasesData !== null && phrasesData.length > 0) {
                    phrases = phrasesData
                } else {
                    log.debug(
                        'Skipping category because is missing phrases for language',
                        Language.Uk,
                        'id',
                        id
                    )
                    return
                }

                for (const language of languages) {
                    const inLanguage = record.get(language) as string|undefined

                    if (shouldSkipText(inLanguage)) {
                        log.debug(
                            'Skipping category for language',
                            language,
                            'id',
                            id
                        )
                        continue
                    }

                    categories.add(language, {
                        id: id,
                        name: {
                            source: String(inUkraine),
                            main: String(inLanguage),
                        },
                        description: '',
                        phrases: phrases,
                    })
                }
            })

            fetchNextPage()
        })

    return categories
}
