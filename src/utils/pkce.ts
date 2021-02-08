import pkceChallenge from 'pkce-challenge'

interface PkceChallenge {
  code_challenge: string
  code_verifier: string
}

let pkce: PkceChallenge | null = null

export function generatePKCE(length?: number): PkceChallenge {
  pkce = pkceChallenge(length)
  return pkce
}

export function getCurrentPKCE(): PkceChallenge | null {
  return pkce
}
