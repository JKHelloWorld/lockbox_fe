/**
 * Rounds a number to `n` decimal places using **round half down**.
 * - If the digit after the cutoff is exactly `.5`, it rounds down (toward zero).
 * - Otherwise, it behaves like normal rounding.
 *
 * @param {number} num - The number to round.
 * @param {number} n - Number of decimal places to round to.
 * @returns {number} - Rounded number.
 *
 * @example
 * roundHalfDown(1.115, 2); // 1.11
 * roundHalfDown(1.116, 2); // 1.12
 * roundHalfDown(1.125, 2); // 1.12
 * roundHalfDown(-1.115, 2); // -1.11
 * roundHalfDown(-1.125, 2); // -1.12
 */
export function roundHalfDown(num: number, n: number): number {
  const factor = 10 ** n;
  const scaled = num * factor;
  return (scaled % 1 === 0.5)
    ? Math.floor(scaled) / factor
    : Math.round(scaled) / factor;
}
