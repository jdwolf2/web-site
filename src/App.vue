<template>
  <div id="app">
    <h1>AccuSalt Mobile</h1>
    <p>Orientation: {{ orientation }}</p>
    <p>Is Landscape? {{ isLandscape }}</p>
    <p>Signed In: {{ isSignedIn }}</p>

    <div v-if="isLandscape && isSignedIn">
      <p>✅ Ready to load Grid.vue here</p>
    </div>

    <div v-else-if="!isLandscape">
      <p>🔁 Please rotate your device to landscape mode</p>
    </div>

    <div v-else>
      <p>🔒 Not signed in</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isSignedIn: false,
      isLandscape: false,
      orientation: '',
    }
  },
  mounted() {
    // Detect orientation
    const o = screen.orientation?.type || 'unknown'
    this.orientation = o
    this.isLandscape = o.includes('landscape')

    // Simulate signed-in user for now (adjust later for Cognito)
    this.isSignedIn = true
  },
}
</script>

<style>
body {
  background: white;
  color: black;
  font-family: sans-serif;
  padding: 2rem;
  text-align: center;
}
</style>
