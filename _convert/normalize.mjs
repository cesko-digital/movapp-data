import crypto from 'crypto'
import path from 'path'
import fs from 'fs'
import czAlphabet from './in-cz-alphabet.mjs'
import ukAlphabet from './in-uk-alphabet.mjs'
import {categories} from "./in-dictionary/translations.mjs"

const baseDir = process.cwd()
const outDir = path.resolve(baseDir, '..')


// Build list of sections and generate id
// Build a list of words and generate id
// map words ids to section ids

function saveJSON (content, file) {
    fs.writeFileSync(path.resolve(outDir, file), JSON.stringify(content, null, '\t'), 'utf8')
}

function md5 (value) {
    const hash = crypto.createHash('md5')
    hash.update(value)
    return hash.digest('hex')
}

function buildDictionary (from, to, categories) {
    const sections = []
    const translations = {}
    const duplications = []

    for (const value of categories) {
        const hash = crypto.createHash('md5')
        hash.update(value.category_name_cz);

        const sectionId = hash.digest('hex')
        const section = {
            id: sectionId,
            name_from: value.category_name_cz,
            name_to: value.category_name_ua,
            translations: []
        }
        sections.push(section)

        for (const translation of value.translations) {
            const translationId = md5(translation.cz_translation)

            section.translations.push(translationId)

            if (typeof translations[translationId] !== 'undefined') {
                duplications.push(translation.cz_translation)
                continue;
            }

            translations[translationId] = {
                id: translationId,
                translation_from: translation.cz_translation,
                transcription_from: translation.cz_transcription,

                translation_to: translation.ua_translation,
                transcription_to: translation.ua_transcription,
            }
        }
    }

    saveJSON({
        'from': from,
        'to': to,
        'sections': sections,
        'translations': translations,
    }, `${from}-${to}-dictionary.json`)

    console.log('Duplication in ', from, 'pack: ', duplications.join(', '))
}

function buildAlphabet (from, alphabetData) {
    const alphabetBaseDir = path.resolve(outDir, `${from}-alphabet`)

    if (fs.existsSync(alphabetBaseDir) === false) {
        fs.mkdirSync(alphabetBaseDir)
    }

    const newData = []
    for (const index in alphabetData.alphabet) {
        const letter = alphabetData.alphabet[index]

		let newFileName = null
        const fileName = letter.file_name

		const id = md5(letter.letter[0])

        // There can be no file
        if (fileName !== null) {

            const filePath = path.resolve(baseDir, `in-${from}-alphabet/${fileName}`)
            if (fs.existsSync(filePath) === false) {
                console.error(`Failed to find a file (${filePath}) for `, letter)
                process.exit(1)
            }

			const fileNameParts = fileName.split('.')
			const extension = fileNameParts[fileNameParts.length - 1]
			newFileName = `${id}.${extension}`

			fs.copyFileSync(filePath, path.resolve(alphabetBaseDir, newFileName))
        }


        newData.push({
            id,
            file_name: newFileName,
            ...letter,
        })
    }

    saveJSON({
        language: from,
        data: newData,
    }, `${from}-alphabet.json`)
}

buildDictionary('cs', 'uk', categories)

buildAlphabet('cs', czAlphabet)
buildAlphabet('uk', ukAlphabet)

