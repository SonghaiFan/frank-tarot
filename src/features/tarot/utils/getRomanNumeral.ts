export function getRomanNumeral(id: number): string | null {
  // Major Arcana (0-21)
  if (id <= 21) {
    if (id === 0) return "0";
    const lookup: { [key: string]: number } = {
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1,
    };
    let roman = "";
    let num = id;
    for (const i in lookup) {
      while (num >= lookup[i]) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
  }

  // Minor Arcana
  // Calculate rank in suit (1-14)
  // 22-35: Wands
  // 36-49: Cups
  // 50-63: Swords
  // 64-77: Pentacles
  const rank = ((id - 22) % 14) + 1;

  // Only show numerals for Ace (1) through 10
  if (rank <= 10) {
    const lookup: { [key: string]: number } = {
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1,
    };
    let roman = "";
    let num = rank;
    for (const i in lookup) {
      while (num >= lookup[i]) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
  }

  return null; // Court cards (Page, Knight, Queen, King) don't get numerals
}
