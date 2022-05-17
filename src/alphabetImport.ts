/**
 * DO NOT USE THIS. THIS WAS MADE FOR ONE TIME USAGE (OLD ALPHABET STRUCTURE TO AIRTABLE)
 */
import fs from 'node:fs'
import { resolve } from 'node:path'
import { airtable } from './utils/airtable.js'

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AlphabetExample {
    example: string
}

export interface AlphabetData {
    id: string
    letter: string[]
    examples: AlphabetExample[]
    transcription: string
}

export interface Alphabet {
    data: AlphabetData[]
}

const sources = [
    {
        airtable: 'UK alphabet',
        name: 'uk-alphabet',
    },
    {
        airtable: 'CS alphabet',
        name: 'cs-alphabet',
    },
]

async function sendDataIfNeeded(
    table: string,
    newData: any[],
    forceSend: boolean
): Promise<any[]> {
    if (newData.length === 0) {
        return newData
    }

    if (newData.length === 10 || forceSend) {
        await airtable(table).create(newData)

        newData = []
    }

    return newData
}

for (const source of sources) {
    const dataArray: Alphabet = JSON.parse(
        fs.readFileSync(resolve('data', source.name + '.json'), 'utf-8')
    )

    let alphabetData: any[] = []

    for (const data of dataArray.data) {
        alphabetData.push({
            fields: {
                letters: data.letter.join(','),
                examples: data.examples
                    .map(example => example.example)
                    .join(', '),
                transcription: data.transcription,
                sound: [
                    {
                        url: `https://github.com/cesko-digital/movapp-data/blob/main/data/${source.name}/${data.id}.mp3?raw=true`,
                    },
                ],
            },
        })

        alphabetData = await sendDataIfNeeded(
            source.airtable,
            alphabetData,
            false
        )
    }

    await sendDataIfNeeded(source.airtable, alphabetData, false)
}
