/**
 * Game difficulty presets: grid size and mine count.
 * @type {{ easy: { rows: number, cols: number, mines: number }, medium: { rows: number, cols: number, mines: number }, hard: { rows: number, cols: number, mines: number } }}
 */
export const CONFIG = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
}
