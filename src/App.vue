<template>
  <div id="app">
    <h1>AccuSalt Mobile</h1>
    <p>Orientation: {{ orientation }}</p>
    <p>Signed in? {{ isSignedIn }}</p>
    <Grid v-if="isSignedIn" />
  </div>
</template>

<script>
import Grid from './components/Grid.vue' // Adjust if needed

export default {
  name: 'App',
  components: { Grid },
  data() {
    return {
      orientation: screen.orientation?.type || 'unknown',
      isSignedIn: false, // start with false, then auto-detect
    }
  },
  mounted() {
    // example: if using Amplify Auth
    import('./useAuth')
      .then(({ useAuth }) => {
        const { user } = useAuth()
        this.isSignedIn = !!user
      })
      .catch((err) => {
        console.error('Auth check failed', err)
      })
  },
}
</script>
