<template>
  <div id="app">
    <h1>AccuSalt Mobile</h1>

    <div v-if="isLandscape">
      <p>✅ Landscape mode detected — loading grid...</p>
      <Grid />
    </div>

    <div v-else>
      <p>🔁 Please rotate your device to landscape mode.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Grid from './Grid.vue' // Adjust path if needed

const width = ref(window.innerWidth)
const height = ref(window.innerHeight)
const isLandscape = computed(() => width.value > height.value)

function updateSize() {
  width.value = window.innerWidth
  height.value = window.innerHeight
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
