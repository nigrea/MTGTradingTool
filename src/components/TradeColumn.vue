<script setup lang="ts">
import { computed } from 'vue'
import CardSearch from './CardSearch.vue'
import CardThumb from './CardThumb.vue'
import { toTradeCard } from '@/services/scryfall'
import { formatEur, sideTotal } from '@/utils/trade'
import type { ScryfallCard, TradeSide } from '@/types'

const side = defineModel<TradeSide>({ required: true })

const total = computed(() => sideTotal(side.value))

function add(card: ScryfallCard) {
  const existing = side.value.cards.find((c) => c.cardId === card.id)
  if (existing) {
    existing.quantity++
    return
  }
  side.value.cards.push({ uid: crypto.randomUUID(), quantity: 1, ...toTradeCard(card) })
}

function change(uid: string, delta: number) {
  const card = side.value.cards.find((c) => c.uid === uid)
  if (!card) return
  card.quantity += delta
  if (card.quantity <= 0) remove(uid)
}

function remove(uid: string) {
  side.value.cards = side.value.cards.filter((c) => c.uid !== uid)
}
</script>

<template>
  <section class="column">
    <input v-model="side.name" class="person" aria-label="Person name" />
    <CardSearch :label="side.name" @add="add" />
    <ul class="cards">
      <li v-for="c in side.cards" :key="c.uid">
        <CardThumb v-if="c.image" :src="c.image" :large-src="c.largeImage" :alt="c.name" />
        <div class="info">
          <strong>{{ c.name }}</strong>
          <small>{{ c.setName }}</small>
          <span>{{ c.price == null ? 'No price' : formatEur(c.price) }} each</span>
        </div>
        <div class="qty">
          <button type="button" aria-label="Decrease quantity" @click="change(c.uid, -1)">−</button>
          <span>{{ c.quantity }}</span>
          <button type="button" aria-label="Increase quantity" @click="change(c.uid, 1)">+</button>
        </div>
        <span class="line">{{ formatEur((c.price ?? 0) * c.quantity) }}</span>
        <button type="button" aria-label="Remove card" @click="remove(c.uid)">✕</button>
      </li>
    </ul>
    <p v-if="!side.cards.length" class="hint">No cards added yet.</p>
    <footer class="total">
      Total: <strong data-test="total">{{ formatEur(total) }}</strong>
    </footer>
  </section>
</template>
