import pino, { Logger, LevelWithSilent } from 'pino'

export const configureLogger: (logger: typeof pino, name: string, level: LevelWithSilent) => Logger = (logger, name, level) => {
    const configgedLogger = logger({
        name, level,
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true
            }
        }
    })
    return configgedLogger
}