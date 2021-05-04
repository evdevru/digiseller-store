<template>
  <section class="container">
    <div class="grid grid-cols-3 gap-4">
      <div class="col-span-1">
        <form
          class="p-3 bg-white shadow rounded-xl"
          @submit.prevent="service.create(form)"
        >
          <h1 class="text-xl font-bold">Создание</h1>
          <p class="mb-2">
            Для создания подпараметра необходимо выбрать родительский.<br />
            <strong>Пример:</strong> Цвет (родительский) имеет значения
            (подпараметры) красный, зелёный и синий.
          </p>
          <t-input v-model="form.title" class="mb-2" placeholder="Название" />
          <label class="flex items-center mb-2">
            <t-checkbox v-model="form.visible"></t-checkbox>
            <span class="block ml-2 font-semibold"
              >Виден в фильтре каталога?</span
            >
          </label>
          <p>
            Вы можете скрыть некоторые параметры из фильтра, но они будут
            отображаться в карточке товара.<br />Подходит для параметров с
            нестандартными данными, например: "дата релиза" - "4 мая 2021".
          </p>
          <h2 class="mb-1 font-bold text-md">Родительский параметр</h2>
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
              name="parent_id"
            />
            <span class="ml-2 text-sm">{{ parameter.title }}</span>
          </label>
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
                      name: 'admin-parameters-id',
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
