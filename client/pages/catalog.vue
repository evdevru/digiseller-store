<template>
  <section class="container">
    <app-breadcrumbs class="my-4" :breadcrumbs="breadcrumbs" />
    <div class="grid grid-cols-6 gap-4">
      <div
        class="relative order-2 col-span-6 md:order-1 md:col-span-4 xl:col-span-5"
      >
        <transition-group
          tag="div"
          class="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
          name="move-catalog"
        >
          <card-product
            v-for="product in productsByPage || filteredProducts"
            :key="product.id"
            :product="product"
          />
        </transition-group>
        <client-only>
          <transition v-if="!clientFilteredProducts.length" name="move-catalog">
            <div>
              <strong class="block text-2xl text-center"
                >Товары не найдены</strong
              >
              <t-button class="mx-auto mt-3" @click="resetFilter"
                >Сбросить фильтр</t-button
              >
            </div>
          </transition>
          <div
            v-show="
              pageTotal > pagePer && clientFilteredProducts.length > pagePer
            "
            class="w-full"
          >
            <t-pagination
              v-model="page"
              class="flex items-center justify-center my-4"
              :total-items="pageTotal"
              :per-page="pagePer"
              :limit="5"
              :hide-first-last-controls="true"
              :hide-ellipsis="true"
              variant="rounded"
            />
          </div>
        </client-only>
      </div>
      <div class="order-1 col-span-6 md:order-2 md:col-span-2 xl:col-span-1">
        <app-filter
          ref="filter"
          v-model="filter"
          :filter-initial="filterInitial"
          :categories="nestedCategories"
          :tags="tags"
          :parameters="existedParameters"
        />
      </div>
    </div>
  </section>
</template>

<script>
import CardProduct from '~/components/card/card-product.vue'
import appBreadcrumbs from '~/components/section/app-breadcrumbs.vue'
import AppFilter from '~/components/section/app-filter.vue'
export default {
  name: 'Index',
  components: { appBreadcrumbs, CardProduct, AppFilter },
  async asyncData({ route, $services }) {
    const categoryService = new $services.DataService('categories')
    const productService = new $services.DataService('products')
    const parameterService = new $services.DataService('parameters')
    const tagService = new $services.DataService('tags')
    const filter = {
      limit: 15,
      price: { minimum: 1, maximum: 14999 },
      parameters: [],
      tags: [],
      category_id: null,
    }

    await productService.getAll()
    await categoryService.getAll()
    await parameterService.getAll()
    await tagService.getAll()

    // #region  Remove unused filters
    const usedCategories = productService.list.map((x) => x.category_id)
    const findCategoryChildrens = (categories, parent) => {
      categories.forEach((category) => {
        const childrens = categoryService.list.filter(
          (x) => x.parent_id === category.id
        )
        if (childrens.length) {
          parent.childrenIds.push(...childrens.map((x) => x.id))
          findCategoryChildrens(childrens, parent)
        }
      })
    }

    const categories = categoryService.list
      .map((category) => {
        const childrens = categoryService.list.filter(
          (x) => x.parent_id === category.id
        )
        category.childrenIds = [category.id]
        if (childrens && childrens.length) {
          category.childrenIds.push(...childrens.map((x) => x.id))
          findCategoryChildrens(childrens, category)
        }
        return category
      })
      .filter((x) => usedCategories.some((y) => x.childrenIds.includes(y)))
    const usedParameterParents = productService.list.reduce((acc, product) => {
      acc.push(...product.parameters.map((x) => x.parent_id))
      return acc
    }, [])
    const usedParameterChildrens = productService.list.reduce(
      (acc, product) => {
        acc.push(...product.parameters.map((x) => x.id))
        return acc
      },
      []
    )

    let parameters = parameterService.list.filter((x) =>
      [...usedParameterParents, ...usedParameterChildrens].includes(x.id)
    )
    const usedTags = productService.list.reduce((acc, product) => {
      acc.push(...product.tags.map((x) => x.id))
      return acc
    }, [])
    const tags = tagService.list.filter((x) => usedTags.includes(x.id))
    // #endregion

    // #region Initialize filter
    const selectedParameterParents = parameterService.list
      .filter((x) => Object.keys(route.query).includes(x.slug))
      .map((x) => x.id)
    filter.parameters = selectedParameterParents.reduce((accum, item) => {
      let childrens = []
      if (route.query[item] === 'all') {
        childrens = parameterService.list
          .filter((x) => x.parent_id === item)
          .map((x) => x.id)
      } else {
        childrens = parameterService.list
          .filter((x) => x.parent_id === item)
          .map((x) => x.id)
      }
      accum.push(...childrens)
      return accum
    }, [])
    filter.tags = route.query.tags
      ? tagService.list
          .filter((x) => route.query.tags.split(',').includes(x.slug))
          .map((x) => x.id)
      : []
    let selectedCategory = {}
    if (route.params.pathMatch) {
      const slugCategories = route.params.pathMatch.split('/')
      selectedCategory = categoryService.list.find(
        (x) => x.slug === slugCategories[slugCategories.length - 1]
      )
      if (selectedCategory) {
        filter.category_id = selectedCategory.id
      }
    }
    // #endregion

    // #region Format data
    const parameterParents = parameters.filter((x) => x.parent_id === null)
    parameters = parameterParents.map((parameter) => {
      parameter.childrens = parameters.filter(
        (x) => x.parent_id === parameter.id
      )
      return parameter
    })
    const products = productService.list.filter((x) => x.in_stock)
    // #endregion

    const prices = products.map((x) => x.price)
    filter.price.minimum = route.query.min_price || Math.min(...prices)
    filter.price.maximum = route.query.max_price || Math.max(...prices)

    const filterProducts = (
      filter = this.filter,
      products = this.products,
      categories = this.categories,
      route = this.$route
    ) => {
      return products.filter((product) => {
        const byPrice =
          product.price >= filter.price.minimum &&
          product.price <= filter.price.maximum
        const byQuery = route.query.search
          ? JSON.stringify(product)
              .toLowerCase()
              .includes(route.query.search.toLowerCase())
          : true
        const byCategory = filter.category_id
          ? product.category_id === filter.category_id ||
            categories
              .find((x) => x.id === filter.category_id)
              .childrenIds.includes(product.category_id)
          : true
        const byTags = filter.tags.length
          ? product.tags
              .map((x) => x.id)
              .some((x) => filter.tags.map((x) => x.id).includes(x))
          : true
        const byParameters = filter.parameters.length
          ? product.parameters
              .map((x) => x.id)
              .some((x) => filter.parameters.includes(x))
          : true
        return byPrice && byCategory && byParameters && byTags && byQuery
      })
    }

    const filteredProducts = filterProducts(filter, products, categories, route)

    const breadcrumbs = [
      {
        title: 'Каталог',
        link: '/catalog',
      },
    ]

    if (selectedCategory && selectedCategory.length) {
      if (selectedCategory.parent_id) {
        const findParent = (category) => {
          const parent = categories.find((x) => x.id === category.parent_id)
          if (parent) {
            if (parent.parent_id) {
              findParent(parent)
            }
            breadcrumbs.push({
              title: parent.title,
              link:
                breadcrumbs[breadcrumbs.length - 1].link + '/' + parent.slug,
            })
          }
        }
        findParent(selectedCategory)
      }

      breadcrumbs.push({
        title: selectedCategory.title,
        link:
          breadcrumbs[breadcrumbs.length - 1].link +
          '/' +
          selectedCategory.slug,
      })
    }

    return {
      filter,
      filterInitial: JSON.parse(JSON.stringify(filter)),
      categories,
      parameters,
      tags,
      products,
      filteredProducts,
      selectedCategory,
      breadcrumbs,
    }
  },
  data() {
    return {
      page: 1,
      pagePer: 15,
      products: [],
      categories: [],
      tags: [],
      parameters: [],
    }
  },
  head() {
    return {
      title: 'Каталог товаров',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.metaDescription,
        },
      ],
    }
  },
  jsonld() {
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
    return {
      '@context': 'http://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items,
    }
  },
  computed: {
    pageTotal() {
      return this.products.length
    },
    productsByPage() {
      const page = this.page || 1
      const perPage = this.pagePer || 10
      const offset = (page - 1) * perPage

      const paginatedItems = this.clientFilteredProducts
        .slice(offset)
        .slice(0, perPage)
      return paginatedItems
    },
    nestedCategories() {
      const recurse = (items) => {
        if (items.length) {
          return items.map((item) => {
            item.children = this.categories.filter(
              (x) => x.parent_id === item.id
            )
            if (item.children.length) {
              recurse(item.children)
            }
            return item
          })
        }
      }
      const categories = this.categories.map((x) => ({ ...x }))
      return recurse(categories.filter((x) => x.parent_id === null))
    },
    clientFilteredProducts() {
      return this.filterProducts()
    },
    existedParameters() {
      const pIds = this.clientFilteredProducts.reduce((acc, product) => {
        acc.push(...product.parameters.map((x) => x.parent_id))
        return acc
      }, [])
      return this.parameters.filter((x) => pIds.includes(x.id))
    },
    metaDescription() {
      const parameterParents = this.existedParameters.filter(
        (x) => x.parent_id === null
      )
      const parameterString = parameterParents.reduce((acc, item) => {
        const childrens = this.existedParameters.filter(
          (x) => x.parent_id === item.id
        )
        acc +=
          item.title +
          (childrens.length
            ? ': ' + childrens.map((x) => x.title).join(',')
            : '')
        return acc
      }, '')
      return (
        'Каталог товаров из категорий ' +
        this.categories.map((x) => x.title).join(', ') +
        (parameterString.length ? ' с вариантами ' + parameterString : '')
      )
    },
  },
  watch: {
    products() {
      this.page = 1
    },
  },
  methods: {
    resetFilter() {
      this.$refs.filter.reset()
    },
    filterProducts(
      filter = this.filter,
      products = this.products,
      categories = this.categories,
      route = this.$route
    ) {
      return products.filter((product) => {
        const byPrice =
          product.price >= filter.price.minimum &&
          product.price <= filter.price.maximum
        const byQuery = route.query.search
          ? JSON.stringify(product)
              .toLowerCase()
              .includes(route.query.search.toLowerCase())
          : true
        const byCategory = filter.category_id
          ? product.category_id === filter.category_id ||
            categories
              .find((x) => x.id === filter.category_id)
              .childrenIds.includes(product.category_id)
          : true
        const byTags = filter.tags.length
          ? product.tags
              .map((x) => x.id)
              .some((x) => filter.tags.map((x) => x.id).includes(x))
          : true
        const byParameters = filter.parameters.length
          ? product.parameters
              .map((x) => x.id)
              .some((x) => filter.parameters.includes(x))
          : true
        return byPrice && byCategory && byParameters && byTags && byQuery
      })
    },
  },
}
</script>

<style lang="scss">
.move-catalog {
  /*&-move {
    transition: all 600ms ease-in-out 50ms;
  }
  &-enter-active {
    transition: all 300ms ease-out;
  }

  &-leave-active {
    transition: all 200ms ease-in;
    position: absolute;
    z-index: 0;
  }

  &-enter,
  &-leave-to {
    opacity: 0;
  }
  &-enter {
    transform: scale(0.9);
  }*/
}
</style>
