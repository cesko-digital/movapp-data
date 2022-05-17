import { extname } from 'node:path'

export function getExtensionFromUrl(fullUrl: string) {
    // Remove any left url search params to resolving extension
    const url = new URL(fullUrl)
    url.search = ''

    return extname(url.toString())
}
