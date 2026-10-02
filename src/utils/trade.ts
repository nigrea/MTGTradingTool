import type { Trade, TradeSide } from '@/types'

export const STORAGE_KEY = 'mtg-trades'

export function sideTotal(side: TradeSide): number {
  return side.cards.reduce((sum, c) => sum + (c.price ?? 0) * c.quantity, 0)
}

export function formatEur(n: number): string {
  return `€${n.toFixed(2)}`
}

export function newTrade(): Trade {
  return {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    a: { name: 'Person A', cards: [] },
    b: { name: 'Person B', cards: [] },
  }
}

export function loadTrades(): Trade[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveTrades(trades: Trade[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trades))
}
