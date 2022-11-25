import { LogBeautify } from 'log-beautify'

export function setupLog(log: LogBeautify) {
    log.useLabels = true
    log.useSymbols = false
    log.setLevel(process.env.DEBUG ? 1 : 3)
}
