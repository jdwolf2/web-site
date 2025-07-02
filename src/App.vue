<template>
  <div id="app">
    <h1>AccuSalt Mobile</h1>
    <p>Window width: {{ width }}</p>
    <p>Window height: {{ height }}</p>
    <p>Is landscape? {{ isLandscape }}</p>

    <div v-if="isLandscape">
      <p>✅ Landscape Mode Detected — Grid would load here.</p>
    </div>
    <div v-else>
      <p>🔁 Please rotate your device to landscape mode.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
  computed: {
    isLandscape() {
      return this.width > this.height;
    }
  },
  mounted() {
    window.addEventListener("resize", this.updateWindowSize);
    this.updateWindowSize(); // initial check
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateWindowSize);
  },
  methods: {
    updateWindowSize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    }
  }
};
</script>

<style>
body {
  font-family: sans-serif;
  background: white;
  text-align: center;
  padding: 2rem;
}
</style>
