<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ src: string; largeSrc?: string | null; alt: string }>()

const PREVIEW_W = 250
const PREVIEW_H = 350
const pos = ref<{ x: number; y: number } | null>(null)

function move(e: MouseEvent) {
  const x = e.clientX + 16 + PREVIEW_W > window.innerWidth ? e.clientX - 16 - PREVIEW_W : e.clientX + 16
  const y = Math.max(8, Math.min(e.clientY - PREVIEW_H / 2, window.innerHeight - PREVIEW_H - 8))
  pos.value = { x, y }
}
</script>

<template>
  <img
    class="thumb"
    :src="props.src"
    :alt="props.alt"
    loading="lazy"
    @mouseenter="move"
    @mousemove="move"
    @mouseleave="pos = null"
  />
  <Teleport to="body">
    <img
      v-if="pos"
      class="card-preview"
      :src="props.largeSrc || props.src"
      alt=""
      :style="{ left: `${pos.x}px`, top: `${pos.y}px` }"
    />
  </Teleport>
</template>
