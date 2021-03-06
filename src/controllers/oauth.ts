import { authenticate, refreshToken } from 'api/mal'
import { getStoredCredentials, setStoredCredentials } from 'utils/token'

export async function authenticateUser(code: string, redirectURI: string): Promise<void> {
  const tokens = await authenticate(code, redirectURI)

  if (!tokens) return
  setStoredCredentials(tokens)
}

export async function refreshUserToken(): Promise<void> {
  const tokenParams = await getStoredCredentials()

  const refreshedParams = await refreshToken(tokenParams)

  if (!refreshedParams) return

  setStoredCredentials(refreshedParams)
}
