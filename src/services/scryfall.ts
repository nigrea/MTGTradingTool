import type { ScryfallCard, TradeCard } from '@/types'

const API = 'https://api.scryfall.com'

export async function searchCards(query: string, signal?: AbortSignal): Promise<ScryfallCard[]> {
  const q = query.trim()
  if (!q) return []
  const url = `${API}/cards/search?q=${encodeURIComponent(q)}&unique=prints&order=name`
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  if (res.status === 404) return []
  if (!res.ok) throw new Error(`Scryfall request failed (${res.status})`)
  const body = (await res.json()) as { data: ScryfallCard[] }
  return body.data
}

export function cardPrice(card: ScryfallCard): number | null {
  const raw = card.prices.eur ?? card.prices.eur_foil ?? card.prices.eur_etched
  if (raw == null) return null
  const n = parseFloat(raw)
  return Number.isNaN(n) ? null : n
}

export function cardImage(card: ScryfallCard): string | null {
  return card.image_uris?.small ?? card.card_faces?.[0]?.image_uris?.small ?? null
}

export function toTradeCard(card: ScryfallCard): Omit<TradeCard, 'uid' | 'quantity'> {
  return {
    cardId: card.id,
    name: card.name,
    setName: card.set_name,
    image: cardImage(card),
    largeImage: cardLargeImage(card),
    price: cardPrice(card),
  }
}

export function cardLargeImage(card: ScryfallCard): string | null {
  return card.image_uris?.normal ?? card.card_faces?.[0]?.image_uris?.normal ?? null
}
