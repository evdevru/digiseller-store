<template>
  <section class="container">
    <form
      class="p-3 bg-white shadow rounded-xl"
      @submit.prevent="service.update(form)"
    >
      <h1 class="mb-3 text-xl font-bold">Изменение</h1>
      <t-input v-model="form.title" class="mb-2" placeholder="Название" />
      <label class="flex items-center mb-2">
        <t-checkbox v-model="form.visible"></t-checkbox>
        <span class="block ml-2 font-semibold">Виден в фильтре каталога?</span>
      </label>
      <p>
        Вы можете скрыть некоторые параметры из фильтра, но они будут
        отображаться в карточке товара.<br />Подходит для параметров с
        нестандартными данными, например: "дата релиза" - "4 мая 2021".
      </p>
      <h2 class="mb-1 font-bold text-md">Родительская категория</h2>
      <label class="flex items-center mb-1.5">
        <t-radio v-model="form.parent_id" :value="null" name="parent_id" />
        <span class="ml-2 text-sm">Отсутствует</span>
      </label>
      <label
        v-for="parameter in parents"
        :key="parameter.id"
        class="flex items-center mb-1"
      >
        <t-radio
          v-model="form.parent_id"
          :value="parameter.id"
          :disabled="parameter.id === form.id"
          name="parent_id"
        />
        <span class="ml-2 text-sm">{{ parameter.title }}</span>
      </label>
      <t-button class="mt-2" type="submit">Сохранить</t-button>
    </form>
  </section>
</template>

<script>
export default {
  layout: 'admin',
  data({ $services }) {
    return {
      service: new $services.DataService('parameters'),
      form: {
        title: '',
        visible: true,
        parent_id: null,
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
    parents() {
      return this.list.filter((x) => x.parent_id === null)
    },
  },
}
</script>

<style></style>
