export function logInfo(...info: string[]): void {
  console.info(info.join(' '))
}

export function logError(...errors: string[]): void {
  console.error(errors.join(' '))
}

export function logWarning(...warnings: string[]): void {
  console.warn(warnings.join(' '))
}
