import { randomBytes } from 'node:crypto'

export const generateCode = (): string => {
    const genCode = randomBytes(32).toString('hex')
    return genCode
}