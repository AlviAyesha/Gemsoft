/** "/x/page/3" → 3; anything that is not a whole number above 1 is a 404. */
export const pageNum = (n: string) => (/^\d+$/.test(n) ? Number(n) : NaN)
