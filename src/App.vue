<template>
  <div id="app">
    <h1>AccuSalt Mobile</h1>
    <p>Width: {{ width }}</p>
    <p>Height: {{ height }}</p>
    <p>Landscape? {{ isLandscape }}</p>

    <div v-if="isLandscape">
      <p>✅ Landscape mode detected — this is where your grid will load.</p>
    </div>
    <div v-else>
      <p>🔁 Please rotate your device to landscape mode.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const width = ref(window.innerWidth)
const height = ref(window.innerHeight)

const isLandscape = computed(() => width.value > height.value)

function updateSize() {
  width.value = window.innerWidth
  height.value = window.innerHeight
  console.log('Updated:', width.value, height.value)
}

onMounted(() => {
  updateSize()
  window.addEventListener('resize', updateSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSize)
})
</script>

<style>
body {
  font-family: sans-serif;
  background: white;
  text-align: center;
  padding: 2rem;
}
</style>
