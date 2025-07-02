<template>
  <form @submit.prevent="submit">
    <label>
      Name
      <input
        type="text"
        v-model="name"
        :class="mobile ? 'mobile-input' : ''"
      /> </label
    ><br />
    <label>
      Email
      <input
        type="email"
        v-model="email"
        :class="mobile ? 'mobile-input' : ''"
      /> </label
    ><br />
    <button type="submit" :class="mobile ? 'mobile-button' : ''">Submit</button>
  </form>
</template>

<script>
export default {
  props: ['mobile'],
  data() {
    return { name: '', email: '' }
  },
  methods: {
    submit() {
      alert(`Submitted: ${this.name}, ${this.email}`)
    },
  },
}
</script>

<style scoped>
.mobile-input {
  font-size: 1.1rem;
  padding: 10px;
  width: 100%;
  margin: 10px 0;
}
.mobile-button {
  font-size: 1.1rem;
  padding: 12px;
  width: 100%;
}
</style>
