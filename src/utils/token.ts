import { URLSearchParams } from 'url'
import { generatePKCE, getCurrentPKCE } from 'utils/pkce'

export interface TokenParams {
  tokenType: string
  expiresIn: number
  accessToken: string
  refreshToken: string
}

export interface TokenParamsRaw {
  token_type: string
  expires_in: number
  access_token: string
  refresh_token: string
}

let storedCredentials: TokenParams | null = null

export function setStoredCredentials({ access_token, token_type, expires_in, refresh_token }: TokenParamsRaw): void {
  storedCredentials = {
    accessToken: access_token,
    tokenType: token_type,
    refreshToken: refresh_token,
    expiresIn: new Date(Date.now() + expires_in).getTime()
  }
}

export function getStoredCredentials(): TokenParams | null {
  return storedCredentials
}

const MAL_LINK = 'https://myanimelist.net/v1/oauth2/authorize'
const SERVER_REDIRECT = 'http://localhost:3000/oauthredirect'

export function getLoginURI(): string {
  const { code_challenge } = generatePKCE(128)

  const url = new URL(MAL_LINK)

  url.searchParams.append('response_type', 'code')
  url.searchParams.append('client_id', process.env.MAL_CLIENT_ID as string)
  url.searchParams.append('state', 'asd')
  url.searchParams.append('redirect_uri', SERVER_REDIRECT)
  url.searchParams.append('code_challenge', code_challenge)
  url.searchParams.append('code_challenge_method', 'plain')

  return url.href
}

export function getAuthParams(code: string): URLSearchParams | null {
  const pkce = getCurrentPKCE()

  if (!pkce) return null

  const { code_challenge } = pkce

  const body = new URLSearchParams()
  body.append('client_id', process.env.MAL_CLIENT_ID as string)
  body.append('grant_type', 'authorization_code')
  body.append('code', code)
  body.append('code_verifier', code_challenge)
  body.append('redirect_uri', SERVER_REDIRECT)

  return body
}

export function getRefreshParams(): URLSearchParams | null {
  const credentials = getStoredCredentials()

  if (!credentials) return null

  const body = new URLSearchParams()
  body.append('client_id', process.env.MAL_CLIENT_ID as string)
  body.append('grant_type', 'refresh_token')
  body.append('refresh_token', credentials.refreshToken)

  return body
}
