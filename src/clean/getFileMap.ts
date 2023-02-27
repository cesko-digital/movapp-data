import {join} from 'node:path'
import {readFiles} from '../utils/readFiles.js'

interface FileMap {
    json: {
        alphabets: string[]
        dictionaries: string[]
        stories: string[]
    },
    // Files are mapped by its own path
    files: { [key: string]: { [key: string]: string } }
}

export async function getFileMap() {
    const map: FileMap = {
        files: {},
        json: {
            alphabets: [],
            stories: [],
            dictionaries: []
        }
    }
    const files = await readFiles(join(process.cwd(), 'data'))


    for (const file of files) {
        if (file.includes('.json')) {
            if (file.includes('-alphabet.json')) {
                map.json.alphabets.push(file)
            } else if (file.includes('-dictionary.json')) {
                map.json.dictionaries.push(file)
            } else if (file.includes('stories/metadata.json')) {
                map.json.stories.push(file)
            }

            continue
        }

        // We want to group the files by directory - get the directory
        // Also file path returns data/subdir/file.png,
        const pathArray = file.split('/')

        // Support file in data folder.
        const directory = pathArray.length > 2 ? pathArray[1] : pathArray[0]

        if (typeof map.files[directory] === 'undefined') {
            map.files[directory] = {}
        }

        map.files[directory][file] = file
    }

    return map
}
