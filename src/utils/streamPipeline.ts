import { promisify } from 'node:util'
import stream from 'node:stream'

export const pipeline = promisify(stream.pipeline)
