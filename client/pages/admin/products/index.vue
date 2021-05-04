<template>
  <section class="container">
    <div class="grid grid-cols-1 gap-4">
      <div class="col-span-1">
        <form class="p-3 bg-white shadow rounded-xl" @submit.prevent="sendForm">
          <h1 class="text-xl font-bold">Создание</h1>
          <p>* - необязательные поля</p>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-2">
              <label>
                <strong class="block mb-2"
                  ><span>ID товара</span>
                  <t-button
                    type="button"
                    class="inline-block float-right px-2 py-1 text-xs"
                    @click="getDigisellerProduct"
                    >Получить</t-button
                  >
                </strong>
                <t-input
                  v-model="form.digiseller_id"
                  required
                  type="number"
                  placeholder="Digiseller ID"
                />
              </label>
            </div>
            <div class="col-span-4">
              <label>
                <strong class="block mb-2">Название</strong>
                <t-input
                  v-model="form.title"
                  required
                  type="text"
                  placeholder="Название"
                />
              </label>
            </div>
            <div class="col-span-2">
              <label>
                <strong class="block mb-2">Стоимость</strong>
                <t-input
                  v-model="form.price"
                  step="0.01"
                  required
                  type="number"
                  placeholder="Стоимость"
                />
              </label>
            </div>
            <div class="col-span-2">
              <label>
                <strong class="block mb-2">Розничная цена *</strong>
                <t-input
                  v-model="form.price_official"
                  step="0.01"
                  type="number"
                  placeholder="Розничная цена"
                />
              </label>
            </div>
            <div class="col-span-2">
              <label>
                <strong class="block mb-2">YouTube ID *</strong>
                <t-input
                  v-model="form.video"
                  type="text"
                  placeholder="YouTube ID"
                />
              </label>
            </div>
            <div class="col-span-2">
              <strong class="block mb-2">Категория</strong>
              <app-nested-categories
                v-model="form.category_id"
                :items="nestedCategories"
              />
            </div>
            <div class="col-span-2">
              <strong class="block mb-2">Параметры *</strong>
              <div v-for="parameter in nestedParameters" :key="parameter.id">
                <strong class="block mb-2 leading-none">{{
                  parameter.title
                }}</strong>
                <label
                  v-for="children in parameter.children"
                  :key="children.id"
                  class="flex items-center mb-1"
                >
                  <t-checkbox v-model="form.parameters" :value="children.id" />
                  <span class="ml-2 text-sm">{{ children.title }}</span>
                </label>
              </div>
            </div>
            <div class="col-span-2">
              <strong class="block mb-2">Теги *</strong>
              <label
                v-for="tag in tags"
                :key="tag.id"
                class="flex items-center mb-1"
              >
                <t-checkbox v-model="form.tags" :value="tag.id" />
                <span class="ml-2 text-sm">{{ tag.title }}</span>
              </label>
            </div>
            <div class="col-span-2">
              <strong class="block mb-2">Вкладки *</strong>
              <label
                v-for="tab in tabs"
                :key="tab.id"
                class="flex items-center mb-1"
              >
                <t-checkbox v-model="form.tabs" :value="tab.id" />
                <span class="ml-2 text-sm">{{ tab.title }}</span>
              </label>
            </div>
            <div class="col-span-4 row-span-2">
              <strong class="block mb-2">Изображение</strong>
              <admin-filepond
                ref="thumbnail"
                v-model="form.thumbnail"
                placeholder="Выберите обложку или перетащите"
              />
            </div>
            <div class="col-span-4">
              <strong class="block mb-2">Описание</strong>
              <admin-editor v-model="form.description" />
            </div>
            <div class="col-span-4">
              <strong class="block mb-2">Дополнительно *</strong>
              <admin-editor v-model="form.extra" placeholder="Доп. описание" />
            </div>
            <div v-for="tab in tabEditors" :key="tab.id" class="col-span-4">
              <strong class="block mb-2"
                >Вкладка <u>"{{ tab.title }}"</u></strong
              >
              <admin-editor
                v-model="tab.text"
                :placeholder="`Содержимое ${tab.title}`"
              />
            </div>

            <div class="col-span-12 row-span-2">
              <strong class="block mb-2">Скриншоты *</strong>
              <admin-filepond
                ref="images"
                v-model="form.images"
                :max-files="4"
                placeholder="Выберите скриншоты или перетащите"
              />
            </div>
          </div>
          <t-button class="block mt-3" type="submit">Создать</t-button>
        </form>
      </div>
      <div class="col-span-1">
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
                  {{ props.row.title }}
                </td>
                <td class="flex flex-wrap" :class="props.tdClass">
                  <t-button
                    :to="{
                      name: 'admin-products-id',
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
import AdminEditor from '~/components/ui/admin-editor.vue'
import AdminFilepond from '~/components/ui/admin-filepond.vue'
import AppNestedCategories from '~/components/ui/app-nested-categories.vue'

export default {
  components: { AppNestedCategories, AdminEditor, AdminFilepond },
  layout: 'admin',
  async asyncData({ $services, route }) {
    const categories = new $services.DataService('categories')
    const parameters = new $services.DataService('parameters')
    let tags = new $services.DataService('tags')
    let tabs = new $services.DataService('tabs')
    await categories.getAll()
    await parameters.getAll()
    await tags.getAll()
    await tabs.getAll()

    tags = tags.list
    tabs = tabs.list

    const recurse = (items, source) => {
      if (items.length) {
        return items.map((item) => {
          item.children = source.filter((x) => x.parent_id === item.id)
          if (item.children.length) {
            recurse(item.children, source)
          }
          return item
        })
      }
    }
    const nestedCategories = categories.list.length
      ? recurse(
          [...categories.list].filter((x) => x.parent_id === null),
          categories.list
        )
      : []
    const nestedParameters = recurse(
      [...parameters.list].filter((x) => x.parent_id === null),
      parameters.list
    )
    const form = {
      category_id: nestedCategories.length ? nestedCategories[0].id : null,
      title: '',
      digiseller_id: '',
      price: '',
      price_official: '',
      description: '',
      extra: '',
      video: null,
      thumbnail: [],
      images: [],
      parameters: [],
      tabs: [],
      tags: [],
      options: [],
    }
    return {
      form,
      initialForm: { ...form },
      nestedCategories,
      nestedParameters,
      tags,
      tabs,
      categories: categories.list,
    }
  },
  data({ $services }) {
    return {
      service: new $services.DataService('products'),
      filledTabs: [],
    }
  },
  async fetch() {
    await this.service.getAll()
  },
  computed: {
    list() {
      return this.service.list
    },
    tabEditors() {
      return this.tabs.filter((x) => this.form.tabs.includes(x.id))
    },
  },
  methods: {
    sendForm() {
      const formData = new FormData()
      const data = Object.assign({}, this.form)
      data.tabs = this.tabEditors
      this.buildFormData(formData, data)
      this.service
        .create(formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(() => {
          this.$refs.images.reset()
          this.$refs.thumbnail.reset()
          Object.assign(this.form, this.initialForm)
        })
    },
    buildFormData(formData, data, parentKey) {
      if (
        data &&
        typeof data === 'object' &&
        !(data instanceof Date) &&
        !(data instanceof File)
      ) {
        Object.keys(data).forEach((key) => {
          this.buildFormData(
            formData,
            data[key],
            parentKey ? `${parentKey}[${key}]` : key
          )
        })
      } else {
        const value = data == null ? '' : data

        formData.append(parentKey, value)
      }
    },
    async getDigisellerProduct() {
      this.$refs.thumbnail.reset()
      this.$refs.images.reset()
      this.form.images = []
      const digi = new this.$services.DigisellerService()
      const { data } = await digi.getProduct(this.form.digiseller_id)
      if (data.retval === 0) {
        const product = data.product
        Object.assign(this.form, {
          title: product.name,
          price: product.price,
          description: product.info,
          extra: product.add_info,
          options: product.options,
          in_stock: product.is_available,
        })
        if (product.preview_videos && product.preview_videos.length) {
          product.preview_videos.forEach((video) => {
            if (video.type === 'youtube') {
              this.form.video = video.id
            }
          })
        }
        if (product.preview_imgs && product.preview_imgs.length) {
          this.$refs.thumbnail.addFile(product.preview_imgs[0].url)
          product.preview_imgs.slice(1, 5).forEach((image) => {
            this.$refs.images.addFile(image.url)
          })
        }
        if (product.category_id) {
          const category = this.categories.find(
            // eslint-disable-next-line eqeqeq
            (category) => category.digiseller_id == product.category_id
          )
          if (category) {
            this.$set(this.form, 'category_id', category.id)
          }
        }
      } else {
        this.$notify(
          {
            text: data.retdesc,
            type: 'error',
            group: 'default',
          },
          4000
        )
      }
    },
  },
}
</script>

<style></style>
