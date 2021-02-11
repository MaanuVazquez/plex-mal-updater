import { URLSearchParams } from 'url'
import fetch from 'node-fetch'
import { generatePKCE, getCurrentPKCE } from 'utils/pkce'
import { TokenParams, TokenParamsRaw } from 'utils/token'
import { logError, logInfo } from 'utils/log'

const API_URIS = {
  TOKEN: 'https://myanimelist.net/v1/oauth2/token',
  AUTHORIZE: 'https://myanimelist.net/v1/oauth2/authorize',
  UPDATE_LIST: (malId: string): string => `https://api.myanimelist.net/v2/anime/${malId}/my_list_status`
}

export function getLoginURI(redirectURI: string): string {
  const { code_challenge } = generatePKCE(128)

  const url = new URL(API_URIS.AUTHORIZE)

  url.searchParams.append('response_type', 'code')
  url.searchParams.append('client_id', process.env.MAL_CLIENT_ID)
  url.searchParams.append('state', 'asd')
  url.searchParams.append('redirect_uri', redirectURI)
  url.searchParams.append('code_challenge', code_challenge)
  url.searchParams.append('code_challenge_method', 'plain')

  return url.href
}

export async function authenticate(code: string): Promise<TokenParamsRaw | null> {
  const pkce = getCurrentPKCE()

  if (!pkce) return null

  const { code_challenge } = pkce

  const body = new URLSearchParams()
  body.append('client_id', process.env.MAL_CLIENT_ID)
  body.append('grant_type', 'authorization_code')
  body.append('code', code)
  body.append('code_verifier', code_challenge)
  body.append('redirect_uri', process.env.OAUTH_REDIRECT_URL)

  try {
    const response = await fetch(API_URIS.TOKEN, {
      method: 'POST',
      body
    })
    logInfo('[MAL][AUTHENTICATE] Success')
    return response.json()
  } catch (error) {
    logError('[MAL][AUTHENTICATE]', error.message)
    return null
  }
}

export async function refreshToken(tokenParams: TokenParams | null): Promise<TokenParamsRaw | null> {
  if (!tokenParams) return null

  const body = new URLSearchParams()
  body.append('client_id', process.env.MAL_CLIENT_ID as string)
  body.append('grant_type', 'refresh_token')
  body.append('refresh_token', tokenParams.refreshToken)

  try {
    const response = await fetch(API_URIS.TOKEN, {
      method: 'POST',
      body
    })

    logInfo('[MAL][REFRESH] Success')

    return response.json()
  } catch (error) {
    logError('[MAL][REFRESH]', error.message)
    return null
  }
}

/* eslint-disable no-unused-vars */
export enum AnimeListStatus {
  WATCHING = 'watching',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  DROPPED = 'dropped',
  PLAN_TO_WATCH = 'plan_to_watch'
}

export interface UpdateListParams {
  malId: string
  status?: AnimeListStatus
  is_rewatching?: boolean
  score?: number // 0-10
  num_watched_episodes?: number
  priority?: number // 0-2
  num_times_rewatched?: number
  rewatch_value?: number // 0-5
  tags?: string
  comments?: string
}

export async function updateList(accessToken: string, { malId, ...rest }: UpdateListParams): Promise<void> {
  const body = new URLSearchParams()

  Object.entries(rest).forEach(([key, value]) => {
    body.append(key, value)
  })

  const response = await fetch(API_URIS.UPDATE_LIST(malId), {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    method: 'PATCH',
    body
  })

  return response.json()
}
