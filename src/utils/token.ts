import { Token } from 'db/models'

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

export async function setStoredCredentials({
  access_token,
  token_type,
  expires_in,
  refresh_token
}: TokenParamsRaw): Promise<void> {
  storedCredentials = {
    accessToken: access_token,
    tokenType: token_type,
    refreshToken: refresh_token,
    expiresIn: new Date(Date.now() + expires_in).getTime()
  }

  const tokens = await Token.find()

  const token = tokens.length ? tokens[0] : new Token()

  Object.entries(storedCredentials).forEach(([key, value]) => {
    // eslint-disable-next-line
    // @ts-ignore
    token[key] = value
  })

  token.save()
}

export async function getStoredCredentials(): Promise<TokenParams | null> {
  if (storedCredentials) return storedCredentials

  const token = await Token.find()

  if (token.length) {
    const { accessToken, tokenType, refreshToken, expiresIn } = token[0]
    storedCredentials = {
      accessToken: accessToken,
      tokenType: tokenType,
      refreshToken: refreshToken,
      expiresIn: expiresIn
    }
  }

  return storedCredentials
}
