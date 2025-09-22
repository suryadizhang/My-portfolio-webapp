/**
 * Utility functions tests
 */

describe('Math utilities', () => {
  test('adds numbers correctly', () => {
    expect(1 + 1).toBe(2)
    expect(2 + 3).toBe(5)
  })

  test('multiplies numbers correctly', () => {
    expect(2 * 3).toBe(6)
    expect(4 * 5).toBe(20)
  })
})

describe('String utilities', () => {
  test('concatenates strings', () => {
    expect('hello' + ' world').toBe('hello world')
  })

  test('converts to uppercase', () => {
    expect('test'.toUpperCase()).toBe('TEST')
  })
})

describe('Array utilities', () => {
  test('filters array correctly', () => {
    const numbers = [1, 2, 3, 4, 5]
    const evenNumbers = numbers.filter(n => n % 2 === 0)
    expect(evenNumbers).toEqual([2, 4])
  })

  test('maps array correctly', () => {
    const numbers = [1, 2, 3]
    const doubled = numbers.map(n => n * 2)
    expect(doubled).toEqual([2, 4, 6])
  })
})