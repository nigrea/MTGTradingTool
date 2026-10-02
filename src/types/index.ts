export interface ScryfallPrices {
  usd: string | null
  usd_foil: string | null
  usd_etched: string | null
}

export interface ScryfallCard {
  id: string
  name: string
  set: string
  set_name: string
  prices: ScryfallPrices
  image_uris?: { small: string }
  card_faces?: { image_uris?: { small: string } }[]
}

export interface TradeCard {
  uid: string
  cardId: string
  name: string
  setName: string
  image: string | null
  price: number | null
  quantity: number
}

export type Side = 'a' | 'b'

export interface TradeSide {
  name: string
  cards: TradeCard[]
}

export interface Trade {
  id: string
  createdAt: number
  a: TradeSide
  b: TradeSide
}
