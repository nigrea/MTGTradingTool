import { describe, expect, it, beforeEach } from 'vitest'
import { loadTrades, newTrade, saveTrades, sideTotal } from '../trade'
import { debounce } from '../debounce'
import { cardPrice } from '@/services/scryfall'
import type { ScryfallCard, TradeSide } from '@/types'
import { vi } from 'vitest'

describe('trade utils', () => {
  beforeEach(() => localStorage.clear())

  it('totals quantity * price, ignoring unpriced cards', () => {
    const side: TradeSide = {
      name: 'A',
      cards: [
        { uid: '1', cardId: 'x', name: 'X', setName: 's', image: null, price: 1.5, quantity: 2 },
        { uid: '2', cardId: 'y', name: 'Y', setName: 's', image: null, price: null, quantity: 3 },
      ],
    }
    expect(sideTotal(side)).toBe(3)
  })

  it('round-trips trades through localStorage', () => {
    const t = newTrade()
    saveTrades([t])
    expect(loadTrades()).toEqual([t])
  })

  it('falls back to foil price', () => {
    const card = { prices: { eur: null, eur_foil: '2.50', eur_etched: null } } as ScryfallCard
    expect(cardPrice(card)).toBe(2.5)
  })

  it('debounces calls', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const d = debounce(fn, 300)
    d(1)
    d(2)
    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(2)
    vi.useRealTimers()
  })
})
