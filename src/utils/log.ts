export function logInfo(...info: unknown[]): void {
  console.info(info.join(' '))
}

export function logError(...errors: unknown[]): void {
  console.error(errors.join(' '))
}

export function logWarning(...warnings: unknown[]): void {
  console.warn(warnings.join(' '))
}
