<template>
  <section class="container">
    <div class="grid grid-cols-3 gap-4">
      <div class="col-span-1">
        <form
          class="p-3 bg-white shadow rounded-xl"
          @submit.prevent="service.create(form)"
        >
          <h1 class="mb-3 text-xl font-bold">Создание</h1>
          <t-input v-model="form.title" class="mb-2" placeholder="Название" />
          <h2 class="mb-1 font-bold text-md">Родительская категория</h2>
          <label class="flex items-center mb-1.5">
            <t-radio v-model="form.parent_id" :value="null" name="parent_id" />
            <span class="ml-2 text-sm">Отсутствует</span>
          </label>
          <app-nested-categories v-model="form.parent_id" :items="nested" />
          <t-button class="mt-2" type="submit">Создать</t-button>
        </form>
      </div>
      <div class="col-span-2">
        <div class="p-3 bg-white shadow rounded-xl">
          <t-table :headers="['Название', 'Действие']" :data="list">
            <template slot="row" slot-scope="props">
              <tr
                :class="[
                  props.trClass,
                  props.rowIndex % 2 === 0 ? 'bg-gray-100' : '',
                ]"
              >
                <td :class="props.tdClass">
                  <span :class="{ 'ml-4': props.row.parent_id }">{{
                    props.row.title
                  }}</span>
                </td>
                <td class="flex flex-wrap" :class="props.tdClass">
                  <t-button
                    :to="{
                      name: 'admin-categories-id',
                      params: { id: props.row.id },
                    }"
                    class="mr-2"
                    variant="secondary"
                    ><img class="w-4" src="@/assets/img/icon/edit.svg" alt=""
                  /></t-button>
                  <t-button
                    variant="secondary"
                    @click="service.destroy(props.row.id)"
                    ><img class="w-4" src="@/assets/img/icon/trash.svg" alt=""
                  /></t-button>
                </td>
              </tr> </template
          ></t-table>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AppNestedCategories from '~/components/ui/app-nested-categories.vue'
// import { mapGetters, mapActions } from 'vuex'
export default {
  components: { AppNestedCategories },
  layout: 'admin',
  data({ $services }) {
    return {
      service: new $services.DataService('categories'),
      form: {
        title: '',
        parent_id: null,
      },
    }
  },
  async fetch() {
    await this.service.getAll()
  },
  computed: {
    list() {
      const list = this.service.list
      const parents = list.filter((x) => x.parent_id === null)
      const result = []
      const recurse = (items) => {
        if (items.length) {
          items.forEach((item) => {
            result.push(item)
            const childrens = list.filter((x) => x.parent_id === item.id)
            if (childrens.length) {
              recurse(childrens)
            }
          })
        }
      }
      recurse(parents)
      return result
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
