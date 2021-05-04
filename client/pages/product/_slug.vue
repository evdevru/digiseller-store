<template>
  <section class="container">
    <app-breadcrumbs class="mt-4" :breadcrumbs="breadcrumbs" />
    <h1 class="product__title">
      {{ pageTitle }}
    </h1>
    <div class="grid grid-cols-10 gap-4 xl:gap-6">
      <div class="col-span-10 xl:col-span-2">
        <div class="grid gap-4 xl:gap-6">
          <picture class="product__thumbnail">
            <img :src="product.thumbnail" :alt="product.title" />
          </picture>
          <div class="grid gap-4 xl:gap-6">
            <div
              v-if="product.video"
              class="product__video"
              @click="$modal.show('video', { video: product.video })"
            >
              <img
                class="w-full h-auto"
                :src="`https://i.ytimg.com/vi/${product.video}/hq720.jpg`"
                :alt="product.title + ' trailer'"
              />
              <PlayIcon class="product__play" />
            </div>
            <div
              v-if="productParameters.length || product.tags.length"
              class="p-4 bg-white shadow rounded-2xl"
            >
              <div class="grid grid-cols-2 gap-0.5">
                <template v-for="parameter in productParameters">
                  <div
                    :key="`parameter-title-${parameter.id}`"
                    class="font-semibold text-gray-200"
                  >
                    {{ parameter.title }}
                  </div>
                  <div
                    :key="`parameter-body-${parameter.id}`"
                    class="text-black"
                  >
                    <nuxt-link
                      v-for="children in parameter.childrens"
                      :key="`parameter-children-${children.id}`"
                      :to="{
                        name: 'catalog',
                        query: {
                          [parameter.slug]: children.slug,
                        },
                      }"
                    >
                      {{ children.title }}
                    </nuxt-link>
                  </div>
                </template>
                <div class="col-span-2">
                  <div class="mt-2 -mb-2">
                    <a
                      v-for="tag in product.tags"
                      :key="`tag-${tag.id}`"
                      class="product__tag"
                      href="#"
                      >{{ tag.title }}</a
                    >
                  </div>
                </div>
              </div>
            </div>
            <div v-if="product.images.length" class="product__images">
              <div
                v-for="(image, idx) in product.images.slice(0, 4)"
                :key="`product-image-${idx}`"
                class="col-span-1"
              >
                <picture
                  class="product__thumbnail"
                  @click="selectedImage = idx"
                >
                  <img :src="image" :alt="product.title + ' preview'" />
                </picture>
              </div>
              <client-only>
                <vue-gallery-slideshow
                  :images="product.images"
                  :index="selectedImage"
                  @close="selectedImage = null"
                ></vue-gallery-slideshow>
              </client-only>
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-10 xl:col-span-8">
        <div class="grid grid-cols-3 gap-4 xl:gap-6">
          <div class="col-span-3 xl:col-span-1">
            <div class="grid gap-4 xl:gap-6">
              <form
                action="https://oplata.info/asp2/pay.asp"
                method="post"
                target="_blank"
                class="bg-white shadow rounded-2xl"
              >
                <input
                  type="hidden"
                  name="id_d"
                  :value="product.digiseller_id"
                />
                <input type="hidden" name="typecurr" value="WMR" />
                <input type="hidden" name="lang" value="ru-RU" />
                <input type="hidden" name="failpage" :value="$route.fullPath" />
                <input type="hidden" name="agent" :value="$config.AGENT_ID" />
                <div class="px-6 py-4 font-semibold">
                  {{ product.in_stock ? 'Товар в наличии' : 'Нет в наличии' }}
                </div>
                <ul class="px-6 py-4 border-t-2 border-b-2 border-gray-100">
                  <li>Гарантия качества</li>
                  <li>Моментальная доставка</li>
                  <li>Отзывы о магазине</li>
                </ul>
                <div class="grid grid-cols-2 gap-3 px-6 py-4">
                  <t-button class="col-span-2" type="submit"
                    >Оформить заказ</t-button
                  >
                  <div class="inline-flex items-center col-span-2">
                    <div class="mr-3 text-xl font-semibold text-gray-200">
                      Цена:
                    </div>
                    <div class="text-2xl font-semibold">
                      {{ product.price }} ₽
                    </div>
                  </div>
                  <!-- <label
                    class="inline-flex items-center col-span-2 md:ml-auto md:col-span-1"
                  >
                    <span class="mr-2 font-semibold">Количество</span>
                    <t-input
                      v-model="count"
                      :value="count"
                      class="!w-12 !py-1 text-center"
                      name="product_cnt"
                      placeholder="X"
                    ></t-input>
                  </label> -->
                </div>
              </form>
              <card-reviews
                :id="product.digiseller_id"
                @fetch="setReviewsStat($event)"
              />
            </div>
          </div>
          <div class="col-span-3 xl:col-span-2">
            <app-tabs>
              <app-tab name="Описание" v-html="product.description" />
              <app-tab
                v-if="product.extra && product.extra.length > 8"
                name="Дополнительно"
                v-html="product.extra"
              />
              <app-tab
                v-for="tab in product.tabs"
                :key="`tab-${tab.id}`"
                :name="tab.title"
                v-html="tab.pivot.text"
              />
            </app-tabs>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import VueGallerySlideshow from 'vue-gallery-slideshow'
import AppTabs from '../../components/ui/app-tabs.vue'
import AppTab from '../../components/ui/app-tab.vue'
import PlayIcon from '~/assets/img/icon/play.svg?inline'
import CardReviews from '~/components/card/card-reviews.vue'
import AppBreadcrumbs from '~/components/section/app-breadcrumbs.vue'

export default {
  components: {
    PlayIcon,
    AppBreadcrumbs,
    CardReviews,
    VueGallerySlideshow,
    AppTabs,
    AppTab,
  },
  async asyncData({ $services, route, error }) {
    const productServie = new $services.DataService('products')
    const categoryService = new $services.DataService('categories')
    const { data } = await productServie.get(route.params.slug)
    const product = data
    if (!product) {
      return error({ statusCode: 404, message: 'Product was not found' })
    }
    await categoryService.getAll()
    const categories = categoryService.list

    const breadcrumbs = [
      {
        title: 'Каталог',
        link: '/catalog',
      },
    ]

    let childrens = []

    childrens.push({
      title: product.category.title,
      link: product.category.slug,
    })

    const findChildrens = (parent) => {
      const children = categories.find((x) => x.id === parent.parent_id)
      if (children) {
        childrens.push({
          title: children.title,
          link: children.slug,
        })
        findChildrens(children)
      }
    }

    findChildrens(product.category)

    childrens = childrens.reverse().map((children, idx, arr) => {
      if (idx) {
        children.link = arr[idx - 1].link + '/' + children.link
      } else {
        children.link = '/catalog/' + children.link
      }
      return children
    })

    breadcrumbs.push(...childrens)

    return {
      product,
      breadcrumbs,
    }
  },
  data() {
    return {
      selectedImage: null,
      reviews: {
        bad: 0,
        good: 1,
      },
    }
  },
  jsonld() {
    const product = this.product
    const items = this.breadcrumbs.map((item, idx) => {
      return {
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@id': (process.env.BASE_URL + item.link)
            .replaceAll('//', '/')
            .replace(':/', '://'),
          name: item.title,
        },
      }
    }, [])
    const ratingValue = (
      5 -
      (5 * this.reviews.bad) / this.reviews.good
    ).toFixed(1)
    return [
      {
        '@context': 'http://schema.org',
        '@type': 'Product',
        name: product.title,
        image: product.thumbnail,
        category: product.category.title,
        description: this.clearDescription,
        aggregateRating: {
          '@type': 'aggregateRating',
          ratingValue,
          reviewCount: this.reviews.good + this.reviews.bad,
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'RUB',
          price: product.price,
          availability: `http://schema.org/${
            product.in_stock ? 'InStock' : 'OutOfStock'
          }`,
        },
      },
      {
        '@context': 'http://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items,
      },
    ]
  },
  head() {
    return {
      title: this.pageTitle,
      meta: [
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.pageTitleWithPrice,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.clearDescription,
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: this.product.image,
        },
        {
          hid: 'twitter:image:alt',
          name: 'twitter:image:alt',
          content: this.product.title,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.pageTitleWithPrice,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.clearDescription,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.product.thumbnail,
        },
        {
          hid: 'og:image:secure_url',
          property: 'og:image:secure_url',
          content: this.product.thumbnail,
        },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content: this.product.title,
        },
        {
          hid: 'description',
          name: 'description',
          content: this.clearDescription,
        },
      ],
    }
  },
  computed: {
    pageTitle() {
      return `Купить ${this.product.title}`
    },
    pageTitleWithPrice() {
      return this.pageTitle + ` за ${this.product.price} ₽`
    },
    clearDescription() {
      return (
        this.product.description
          .replace(/(<([^>]+)>)/gi, '')
          .split('')
          .slice(0, 155)
          .join('') + '...'
      )
    },
    productParameters() {
      const parents = this.product.parameters
        .map((item) => item.parent)
        .map((parent) => {
          let childs = this.product.parameters.filter(
            (x) => parent.id === x.parent_id
          )
          childs = childs.map((child) => {
            const clear = Object.assign(
              {},
              {
                title: child.title,
                slug: child.slug,
                id: child.id,
              }
            )
            return clear
          })
          parent.childrens = childs
          return parent
        })
      const result = []
      parents.forEach((parent) => {
        const hasResult = result.find((x) => x.id === parent.id)
        if (!hasResult) {
          result.push(parent)
        }
      })
      return result
    },
  },
  methods: {
    setReviewsStat(data) {
      this.reviews.good = data.good
      this.reviews.bad = data.bad
    },
  },
}
</script>

<style lang="scss">
.product {
  &__title {
    @apply font-bold leading-none mb-4;
  }

  &__images {
    columns: 2 auto;
    column-gap: 1rem;
    & > * {
      margin-bottom: 1rem;
      cursor: pointer;
    }
  }

  &__thumbnail {
    @apply overflow-hidden block shadow rounded-2xl;
  }

  &__video {
    z-index: 1;

    @apply overflow-hidden cursor-pointer relative shadow rounded-2xl;

    &:after {
      content: '';
      width: 60px;
      height: 60px;
      z-index: 2;

      @apply absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-blue-200 to-blue-100 shadow;
    }
  }

  &__play {
    width: 30px;
    height: 30px;
    z-index: 3;

    @apply fill-white absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2;
  }

  &__tag {
    @apply inline-block leading-none py-1 px-4 mb-2 bg-gray-100 rounded-2xl;
  }
}
</style>
