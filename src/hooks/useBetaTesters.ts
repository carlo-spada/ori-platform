import { useMutation } from '@tanstack/react-query'
import { submitBetaTester, type BetaTesterData } from '@/integrations/api/betaTesters'

/**
 * Hook to submit email for beta testing waitlist
 */
export function useSubmitBetaTester() {
  return useMutation({
    mutationFn: (data: BetaTesterData) => submitBetaTester(data),
  })
}
