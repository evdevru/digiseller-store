<template>
  <section class="container">
    <div class="grid grid-cols-3 gap-4">
      <div class="col-span-1">
        <form
          class="bg-white rounded-xl shadow p-3"
          @submit.prevent="service.create(form)"
        >
          <h1 class="text-xl font-bold mb-3">Создание</h1>
          <t-input v-model="form.title" class="mb-2" placeholder="Название" />
          <t-button class="mt-3" type="submit">Создать</t-button>
        </form>
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded-xl shadow p-3">
          <t-table :headers="['Название', 'Действие']" :data="list">
            <template slot="row" slot-scope="props">
              <tr
                :class="[
                  props.trClass,
                  props.rowIndex % 2 === 0 ? 'bg-gray-100' : '',
                ]"
              >
                <td :class="props.tdClass">
                  {{ props.row.title }}
                </td>
                <td class="flex flex-wrap" :class="props.tdClass">
                  <t-button
                    :to="{
                      name: 'admin-tabs-id',
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
// import { mapGetters, mapActions } from 'vuex'
export default {
  layout: 'admin',
  data({ $services }) {
    return {
      service: new $services.DataService('tabs'),
      form: {
        title: '',
      },
    }
  },
  async fetch() {
    await this.service.getAll()
  },
  computed: {
    list() {
      return this.service.list
    },
  },
}
</script>

<style></style>
