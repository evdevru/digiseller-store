<template>
  <section class="container">
    <form class="p-3 bg-white shadow rounded-xl" @submit.prevent="sendForm">
      <h1 class="text-xl font-bold">Редактирование</h1>
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
            <strong class="block mb-0.5">{{ parameter.title }}</strong>
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
            v-model="form.thumbnail"
            :init-files="[form.thumbnail]"
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
            v-model="form.images"
            :init-files="form.images"
            :max-files="4"
            placeholder="Выберите скриншоты или перетащите"
          />
        </div>
      </div>
      <t-button class="block mt-3" type="submit">Сохранить</t-button>
    </form>
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
    const { data } = await new $services.DataService('products').get(
      route.params.id
    )
    const form = data
    form.parameters = form.parameters.map((x) => x.id)
    form.tags = form.tags.map((x) => x.id)

    const categories = new $services.DataService('categories')
    const parameters = new $services.DataService('parameters')
    let tags = new $services.DataService('tags')
    let tabs = new $services.DataService('tabs')
    await categories.getAll()
    await parameters.getAll()
    await tags.getAll()
    await tabs.getAll()

    tabs = tabs.list
    tags = tags.list

    form.tabs.forEach((tab) => {
      const parent = tabs.find((x) => x.id === tab.id)
      parent.text = tab.pivot.text
    })

    form.tabs = form.tabs.map((x) => x.id)

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
    const nestedCategories = recurse(
      [...categories.list].filter((x) => x.parent_id === null),
      categories.list
    )
    const nestedParameters = recurse(
      [...parameters.list].filter((x) => x.parent_id === null),
      parameters.list
    )

    return { form, nestedCategories, nestedParameters, tags, tabs }
  },
  data({ $services }) {
    return {
      service: new $services.DataService('products'),
      filledTabs: [],
    }
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
      this.service.update(formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
