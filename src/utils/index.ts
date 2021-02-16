import { Request } from 'express'

export function getDate(): string {
  const date = new Date()

  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${date.getFullYear()}-${month}-${day}`
}

export function getOAuthRedirectURI(req: Request): string {
  return `${req.protocol}://${req.get('host')}/oauthredirect`
}

export function plexLibraryIsValid(libraryTitle: string): boolean {
  if (!process.env.PLEX_SECTION_TITLE) return true

  const libraries = process.env.PLEX_SECTION_TITLE.toLowerCase().split(', ')
  return libraries.includes(libraryTitle.toLowerCase())
}
