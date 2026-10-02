import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TradeColumn from '../TradeColumn.vue'
import type { TradeSide } from '@/types'

describe('TradeColumn', () => {
  it('shows card prices and the column total', () => {
    const side: TradeSide = {
      name: 'Alice',
      cards: [
        { uid: '1', cardId: 'a', name: 'Bolt', setName: 'Alpha', image: null, price: 2.5, quantity: 2 },
        { uid: '2', cardId: 'b', name: 'Fork', setName: 'Beta', image: null, price: 1, quantity: 1 },
      ],
    }
    const w = mount(TradeColumn, { props: { modelValue: side } })
    expect(w.text()).toContain('€2.50 each')
    expect(w.get('[data-test="total"]').text()).toBe('€6.00')
  })
})
