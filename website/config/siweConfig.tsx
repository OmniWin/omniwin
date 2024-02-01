import { SiweMessage } from 'siwe'
import { createSIWEConfig } from '@web3modal/siwe'
import type { SIWECreateMessageArgs, SIWESession, SIWEVerifyMessageArgs } from '@web3modal/core'
import { getNonce, getSession, signOut, validateMessage } from '@/app/services/authService'
export const siweConfig = createSIWEConfig({
  createMessage: ({ nonce, address, chainId }: SIWECreateMessageArgs) =>
    new SiweMessage({
      version: '1',
      domain: window.location.host,
      uri: window.location.origin,
      address,
      chainId,
      nonce,
      // Human-readable ASCII assertion that the user will sign, and it must not contain `\n`.
      statement: 'Sign in to Omniwin.'
    }).prepareMessage(),
  getNonce: async () => {
    // Fetch nonce from your SIWE server
    const nonce = await getNonce()
    if (!nonce) {
      throw new Error('Failed to get nonce!')
    }

    return nonce
  },
  getSession: async () => {
    // Fetch currently authenticated user
    const session = await getSession()
    if (!session) {
      throw new Error('Failed to get session!')
    }

    const { address, chainId } = session

    return { address, chainId }
  },
  verifyMessage: async ({ message, signature }: SIWEVerifyMessageArgs) => {
    try {
      // Use your SIWE server to verify if the message and the signature are valid
      // Your back-end will tipically rely on SiweMessage(message).validate(signature)
      const isValid = await validateMessage({ message, signature })

      return isValid
    } catch (error) {
      return false
    }
  },
  signOut: async () => {
    try {
      // Sign out by calling the relevant endpoint on your back-end
      await signOut()

      return true
    } catch (error) {
      return false
    }
  }
})