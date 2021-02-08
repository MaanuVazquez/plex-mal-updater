import fetch from 'node-fetch'
import { getAuthParams, getRefreshParams, setStoredCredentials } from 'utils/token'
import constants from 'constants/urls'

export async function authenticateUser(code: string): Promise<void> {
  const body = getAuthParams(code)

  if (!body) return

  const response = await fetch(constants.OAUTH_URL, {
    method: 'POST',
    body
  })

  const data = await response.json()

  setStoredCredentials(data)
}

export async function refreshUserToken(): Promise<void> {
  const body = getRefreshParams()

  if (!body) return

  const response = await fetch(constants.OAUTH_URL, {
    method: 'POST',
    body
  })

  const data = await response.json()

  setStoredCredentials(data)
}
