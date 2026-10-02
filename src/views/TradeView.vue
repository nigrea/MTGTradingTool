<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import TradeColumn from '@/components/TradeColumn.vue'
import { formatUsd, loadTrades, saveTrades, sideTotal } from '@/utils/trade'
import type { Trade } from '@/types'

const route = useRoute()
const trade = ref<Trade | null>(loadTrades().find((t) => t.id === route.params.id) ?? null)

watch(
  trade,
  (t) => {
    if (!t) return
    const all = loadTrades()
    const i = all.findIndex((x) => x.id === t.id)
    if (i >= 0) all[i] = t
    else all.unshift(t)
    saveTrades(all)
  },
  { deep: true },
)

const diff = computed(() => (trade.value ? sideTotal(trade.value.a) - sideTotal(trade.value.b) : 0))
const summary = computed(() => {
  if (!trade.value) return ''
  if (Math.abs(diff.value) < 0.005) return 'The trade is even.'
  const [more, less] = diff.value > 0 ? [trade.value.a, trade.value.b] : [trade.value.b, trade.value.a]
  return `${more.name} is giving ${formatUsd(Math.abs(diff.value))} more than ${less.name}.`
})
</script>

<template>
  <main v-if="trade">
    <RouterLink to="/">← Back</RouterLink>
    <h1>Trade</h1>
    <div class="columns">
      <TradeColumn v-model="trade.a" />
      <TradeColumn v-model="trade.b" />
    </div>
    <p class="summary" data-test="summary">{{ summary }}</p>
  </main>
  <main v-else>
    <p>Trade not found.</p>
    <RouterLink to="/">← Back</RouterLink>
  </main>
</template>
