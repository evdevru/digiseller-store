<template>
  <section class="container">
    <form class="bg-white rounded-xl shadow p-3" @submit.prevent="service.update(form)">
      <h1 class="text-xl font-bold mb-3">Изменение</h1>
      <t-input v-model="form.title" class="mb-2" placeholder="Название" />
      <t-button class="mt-3" type="submit">Сохранить</t-button>
    </form>
  </section>
</template>

<script>
export default {
  layout: 'admin',
  data({ $services }) {
    return {
      service: new $services.DataService('tags'),
      form: {
        title: '',
      },
    }
  },
  async fetch() {
    await this.service.getAll()
    const { data } = await this.service.get(this.$route.params.id)
    this.form = data
  },
  computed: {
    list() {
      return this.service.list
    },
  },
}
</script>

<style></style>
