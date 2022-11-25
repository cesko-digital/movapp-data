export function shouldSkipText(value: string | undefined): boolean {
    return (
        typeof value === 'undefined' || value === '' || value === '#notranslate'
    )
}
