<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { formatEur, loadTrades, newTrade, saveTrades, sideTotal } from '@/utils/trade'

const router = useRouter()
const trades = ref(loadTrades().sort((x, y) => y.createdAt - x.createdAt))

function start() {
  const t = newTrade()
  saveTrades([t, ...loadTrades()])
  router.push({ name: 'trade', params: { id: t.id } })
}

function remove(id: string) {
  trades.value = trades.value.filter((t) => t.id !== id)
  saveTrades(trades.value)
}
</script>

<template>
  <main>
    <h1>MTG Trading Tool</h1>
    <button type="button" class="primary" @click="start">New trade</button>
    <h2>Previous trades</h2>
    <p v-if="!trades.length" class="hint">No previous trades.</p>
    <ul class="trades">
      <li v-for="t in trades" :key="t.id">
        <RouterLink :to="{ name: 'trade', params: { id: t.id } }">
          {{ new Date(t.createdAt).toLocaleString() }} — {{ t.a.name }}
          {{ formatEur(sideTotal(t.a)) }} vs {{ t.b.name }} {{ formatEur(sideTotal(t.b)) }}
        </RouterLink>
        <button type="button" aria-label="Delete trade" @click="remove(t.id)">Delete</button>
      </li>
    </ul>
  </main>
</template>
