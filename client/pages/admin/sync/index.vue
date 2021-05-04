<template>
  <section class="container">
    <div class="grid grid-cols-3 p-3 bg-white shadow rounded-xl">
      <form @submit.prevent="syncCategories">
        <h1 class="mb-3 text-xl font-bold">Синхронизация</h1>
        <p class="block mt-3">Старые категории и товары будут удалены!</p>
        <p class="block mb-3">
          Если у товара нет изображения - он не будет добавлен, в таком случае
          необходимо добавить в ручном режиме.
        </p>
        <label>
          <span class="block mb-2 font-semibold">ID продавца</span>
          <t-input
            v-model="category.seller_id"
            class="mb-2"
            placeholder="ID продавца"
          />
        </label>
        <t-button class="mt-3" type="submit">Отправить</t-button>
      </form>
      <div v-if="failed.length">
        <h2 class="text-xl font-bold">Не удалось получить</h2>
        <pre>
          <code>
          {{ JSON.stringify(failed, null, 2) }}
        </code>
        </pre>
      </div>
    </div>
  </section>
</template>

<script>
// import { mapGetters, mapActions } from 'vuex'
const { v4: uuidv4 } = require('uuid')
export default {
  layout: 'admin',
  data({ $services, $config }) {
    return {
      digiseller: new $services.DigisellerService(),
      category: {
        seller_id: $config.SELLER_ID,
      },
      failed: [],
    }
  },
  methods: {
    async syncCategories() {
      this.failed = []
      const categoryService = new this.$services.DataService('categories')
      const productService = new this.$services.DataService('products')
      const { data } = await this.digiseller.getCategories(
        this.category.seller_id
      )
      if (parseInt(data.retval) === 0) {
        await productService.destroyAll()
        await categoryService.destroyAll()
        const recurse = async (items, parent_id = '') => {
          for await (const item of items) {
            const body = {
              title: item.name,
              digiseller_id: item.id,
              parent_id,
            }
            try {
              const { data } = await categoryService.create(body)
              if (item.cnt && parseInt(item.cnt) > 0)
                await this.createProduct(item, data.data.id)
              if (item.sub) {
                recurse(item.sub, data.data.id)
              }
            } catch (e) {}
          }
        }
        return recurse(data.category)
      }
    },
    async createProduct(category, dbId) {
      const productService = new this.$services.DataService('products')
      const { data: products } = await this.digiseller.getProductsByCategory(
        category.id,
        this.category.seller_id
      )
      if (
        parseInt(products.retval) === 0 &&
        products.product &&
        products.product.length
      ) {
        for await (const product of products.product) {
          const { data: response } = await this.digiseller.getProduct(
            product.id
          )
          if (parseInt(response.retval) === 0) {
            const product = response.product
            const body = {
              title: product.name,
              price: product.price,
              digiseller_id: product.id,
              description: `<p>${product.info}</p>`,
              extra: `<p>${product.add_info}</p>`,
              category_id: dbId,
              video: '',
              thumbnail: [],
              images: [],
              options: product.options,
              in_stock: product.is_available,
            }

            if (product.preview_videos && product.preview_videos.length) {
              product.preview_videos.forEach((video) => {
                if (video.type === 'youtube' && !body.video.length) {
                  body.video = video.id
                }
              })
            }
            if (product.preview_imgs && product.preview_imgs.length) {
              const image = await this.getFilefromURL(
                product.preview_imgs[0].url
              )
              body.thumbnail = [
                this.getFileObject(image.data, product.preview_imgs[0].url),
              ]

              for await (const img of product.preview_imgs.slice(1, 5)) {
                const preview = await this.getFilefromURL(img.url)
                body.images.push(this.getFileObject(preview.data, img.url))
              }
            }

            const { description, extra, ...productBody } = body
            try {
              if (body.thumbnail.length) {
                const formData = new FormData()
                this.buildFormData(formData, body)
                await productService.create(formData)
              } else {
                this.failed.push({
                  product: productBody,
                  category,
                })
              }
            } catch (e) {
              this.failed.push({
                product: productBody,
                category,
              })
            }
          }
        }
      }
    },
    async getFilefromURL(imageuri) {
      return await new Promise((resolve, reject) => {
        try {
          const instance = this.$axios.create()
          delete instance.defaults.headers.common.Authorization

          instance
            .get(encodeURI(imageuri), {
              responseType: 'blob',
            })
            .then((response) => {
              resolve(response)
            })
        } catch (err) {
          reject(err)
        }
      })
    },
    getFileObject(buffer, url) {
      const fileArr = url.split('.')
      const fileName = `${uuidv4()}.${fileArr[fileArr.length - 1]}`
      const file = new File([buffer], fileName, {
        lastModified: Date.now(),
      })
      return file
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
  },
}
</script>

<style></style>
