import crypto from 'crypto'

export function md5(value: string) {
    const hash = crypto.createHash('md5')
    hash.update(value)
    return hash.digest('hex')
}
