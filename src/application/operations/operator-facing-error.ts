export function operatorRecoveryErrorMessage(error?: unknown): string {
  void error
  return 'De recoveryactie kon niet worden uitgevoerd. Controleer de feedstatus en probeer het opnieuw.'
}
