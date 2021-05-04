<template>
  <section class="container flex items-center justify-center">
    <form class="p-4 shadow rounded-2xl bg-white" @submit.prevent="login">
      <t-input v-model="password" class="mb-3" placeholder="Password" />
      <t-button type="submit">Отправить</t-button>
    </form>
  </section>
</template>

<script>
export default {
  layout: 'admin',
  data() {
    return {
      password: null,
    }
  },
  auth: false,
  methods: {
    async login() {
      await this.$auth.loginWith('local', {
        data: { password: this.password },
      })
      this.$router.push({ name: 'admin-products' })
    },
  },
}
</script>

<style></style>
