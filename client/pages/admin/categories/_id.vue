<template>
  <section class="container">
    <form
      class="bg-white rounded-xl shadow p-3"
      @submit.prevent="service.update(form)"
    >
      <h1 class="text-xl font-bold mb-3">Изменение</h1>
      <t-input v-model="form.title" class="mb-2" placeholder="Название" />
      <h2 class="text-md font-bold mb-1">Родительская категория</h2>
      <label class="flex items-center mb-1.5">
        <t-radio v-model="form.parent_id" :value="null" name="parent_id" />
        <span class="ml-2 text-sm">Отсутствует</span>
      </label>
      <app-nested-categories
        v-model="form.parent_id"
        :disabled="form.id"
        :items="nested"
      />
      <t-button class="mt-2" type="submit">Сохранить</t-button>
    </form>
  </section>
</template>

<script>
import AppNestedCategories from '~/components/ui/app-nested-categories.vue'
export default {
  components: { AppNestedCategories },
  layout: 'admin',
  data({ $services }) {
    return {
      service: new $services.DataService('categories'),
      form: {
        title: '',
        parent_id: '',
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
    nested() {
      const recurse = (items) => {
        if (items.length) {
          return items.map((item) => {
            item.children = this.list.filter((x) => x.parent_id === item.id)
            if (item.children.length) {
              recurse(item.children)
            }
            return item
          })
        }
      }
      return recurse(this.list.filter((x) => x.parent_id === null))
    },
  },
}
</script>

<style></style>
