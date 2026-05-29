export function formatMemberCount(count: number): string {
    if (count < 50) return 'Meno di 50 membri'
    if (count < 100) return '50+ membri'
    if (count < 250) return '100+ membri'
    if (count < 500) return '250+ membri'
    if (count < 750) return '500+ membri'
    if (count < 1000) return '750+ membri'
    return '1000+ membri'
  }