<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import CardThumb from './CardThumb.vue'
import { cardImage, cardLargeImage, searchCards } from '@/services/scryfall'
import { debounce } from '@/utils/debounce'
import type { ScryfallCard } from '@/types'

const props = defineProps<{ label: string }>()
const emit = defineEmits<{ add: [card: ScryfallCard] }>()

const query = ref('')
const results = ref<ScryfallCard[]>([])
const loading = ref(false)
const error = ref('')
const searched = ref(false)
let controller: AbortController | undefined

const run = debounce(async (q: string) => {
  controller?.abort()
  if (!q.trim()) {
    results.value = []
    loading.value = false
    searched.value = false
    return
  }
  const current = (controller = new AbortController())
  loading.value = true
  error.value = ''
  try {
    const found = await searchCards(q, current.signal)
    if (current.signal.aborted) return
    results.value = found
    searched.value = true
  } catch (e) {
    if (current.signal.aborted) return
    error.value = e instanceof Error ? e.message : 'Search failed'
    results.value = []
  } finally {
    if (!current.signal.aborted) loading.value = false
  }
}, 400)

watch(query, (q) => {
  if (!q.trim()) controller?.abort()
  run(q)
})
onBeforeUnmount(() => {
  run.cancel()
  controller?.abort()
})

function select(c: ScryfallCard) {
  emit('add', c)
  query.value = ''
  results.value = []
  searched.value = false
}

function price(c: ScryfallCard) {
  const p = c.prices.eur ?? c.prices.eur_foil ?? c.prices.eur_etched
  return p ? `€${p}` : 'N/A'
}
</script>

<template>
  <div class="search">
    <input v-model="query" type="search" :placeholder="`Search cards to add to ${props.label}…`" />
    <p v-if="loading" class="hint">Searching…</p>
    <p v-else-if="error" class="hint error">{{ error }}</p>
    <p v-else-if="searched && !results.length" class="hint">No cards found.</p>
    <ul v-if="results.length" class="results">
      <li
        v-for="c in results"
        :key="c.id"
        tabindex="0"
        @click="select(c)"
        @keydown.enter.self="select(c)"
      >
        <CardThumb
          v-if="cardImage(c)"
          :src="cardImage(c)!"
          :large-src="cardLargeImage(c)"
          :alt="c.name"
        />
        <span v-else class="thumb-placeholder" />
        <span class="name">{{ c.name }} <small>({{ c.set_name }})</small></span>
        <span class="price">{{ price(c) }}</span>
        <button type="button">Add</button>
      </li>
    </ul>
  </div>
</template>
