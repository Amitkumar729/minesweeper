import { describe, it, expect } from 'vitest'
import { CONFIG } from './config'

describe('CONFIG', () => {
  it('has easy, medium, hard difficulties', () => {
    expect(CONFIG).toHaveProperty('easy')
    expect(CONFIG).toHaveProperty('medium')
    expect(CONFIG).toHaveProperty('hard')
  })

  it('each difficulty has rows, cols, mines', () => {
    for (const level of Object.values(CONFIG)) {
      expect(level).toHaveProperty('rows')
      expect(level).toHaveProperty('cols')
      expect(level).toHaveProperty('mines')
      expect(typeof level.rows).toBe('number')
      expect(typeof level.cols).toBe('number')
      expect(typeof level.mines).toBe('number')
    }
  })

  it('easy has 9x9 grid and 10 mines', () => {
    expect(CONFIG.easy.rows).toBe(9)
    expect(CONFIG.easy.cols).toBe(9)
    expect(CONFIG.easy.mines).toBe(10)
  })

  it('mines count is less than total cells', () => {
    for (const { rows, cols, mines } of Object.values(CONFIG)) {
      expect(mines).toBeLessThan(rows * cols)
    }
  })
})
