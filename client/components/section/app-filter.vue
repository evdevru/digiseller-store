<template>
  <div class="filter">
    <div class="filter__block">
      <div class="filter__block-title">Цена</div>
      <div class="filter__block-body">
        <div class="space-x-2 price">
          <label class="flex items-center space-x-2">
            <span class="text-sm font-semibold">от</span>
            <input
              v-model="filter.price.minimum"
              class="price__input"
              type="text"
            />
          </label>
          <label class="flex items-center space-x-2">
            <span class="text-sm font-semibold">до</span>
            <input
              v-model="filter.price.maximum"
              class="price__input"
              type="text"
            />
          </label>
        </div>
      </div>
    </div>
    <template
      v-if="
        categories.length &&
        (categories.length > 1 || categories[0].children.length)
      "
    >
      <div class="filter__block">
        <div class="filter__block-title">Категория</div>
        <div class="filter__block-body">
          <label v-if="categories.length > 1" class="flex items-center mb-1.5">
            <t-radio
              v-model="filter.category_id"
              :value="null"
              name="parent_id"
              required
            />
            <span class="ml-2 text-sm"><strong>Все</strong></span>
          </label>
          <app-nested-categories
            v-model="filter.category_id"
            :items="categories"
          />
        </div>
      </div>
    </template>
    <template v-if="parameters.length">
      <div
        v-for="parameter in parameters"
        :key="parameter.id"
        class="filter__block"
      >
        <div class="filter__block-title">
          {{ parameter.title }}
        </div>
        <div v-if="parameter.childrens && parameter.childrens.length">
          <div class="filter__block-body">
            <div v-for="child in parameter.childrens" :key="child.id">
              <label class="flex items-center mb-1.5">
                <t-checkbox v-model="filter.parameters" :value="child.id" />
                <span class="ml-2 text-sm">{{ child.title }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div v-if="tags.length" class="filter__block">
      <div class="filter__block-body">
        <t-dropdown class="w-full" :text="tagsText">
          <div class="grid grid-cols-1 gap-1 p-1 rounded-2xl">
            <button
              v-for="tag in tags"
              :key="tag.id"
              type="button"
              :class="{
                'bg-blue-300': filter.tags.find((x) => x.id === tag.id),
              }"
              class="px-3 py-1 text-sm leading-none text-left transition-all duration-300 bg-gray-100 rounded-2xl hover:bg-blue-300"
              @click="toggleTag(tag)"
            >
              {{ tag.title }}
            </button>
          </div>
        </t-dropdown>
      </div>
    </div>
    <nuxt-link
      :to="{ name: 'catalog' }"
      class="filter__reset"
      @click.native="reset"
    >
      Сбросить
    </nuxt-link>
  </div>
</template>

<script>
import appNestedCategories from '../ui/app-nested-categories.vue'

export default {
  components: { appNestedCategories },
  props: {
    value: {
      type: Object,
      required: true,
    },
    filterInitial: {
      type: Object,
      required: true,
    },
    categories: {
      type: Array,
      default: () => [],
    },
    tags: {
      type: Array,
      default: () => [],
    },
    parameters: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      filter: {},
    }
  },
  computed: {
    tagsText() {
      const tags = this.filter.tags.length
      return `Тэги${tags ? ': ' + tags : ''}`
    },
  },
  watch: {
    filter(val) {
      this.$emit('input', val)
    },
  },
  created() {
    this.filter = this.value
  },
  methods: {
    toggleTag(tag) {
      const hasTag = this.filter.tags.find((x) => x.id === tag.id)
      if (hasTag) {
        this.filter.tags = this.filter.tags.filter((x) => x.id !== tag.id)
      } else {
        this.filter.tags.push(tag)
      }
    },
    reset() {
      this.filter = JSON.parse(JSON.stringify(this.filterInitial))
      const query = Object.assign({}, this.$router.query)
      if (query.length && query.search) {
        delete query.search
        this.$router.replace({ query })
      }
    },
  },
}
</script>

<style lang="scss">
.filter {
  @apply rounded-2xl shadow bg-white overflow-hidden;
  &__block {
    @apply border-b-2 border-gray-100 p-4;
  }
  &__block-title {
    @apply mb-3 leading-none font-semibold;
  }
  &__block-body {
  }
  &__icon {
    margin-right: 0.25rem;
    width: 25px;
    height: 25px;
  }
  &__reset {
    @apply bg-gradient-to-b block from-blue-200 to-blue-100;
    text-align: center;
    padding: 0.5rem 1rem;
    width: 100%;
    color: #ffffff;
    font-weight: 600;
  }
}
.price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  &__input {
    display: block;
    font-size: 16px;
    padding: 5px;
    @apply text-blue-200 border-b-2 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50;
    font-weight: 600;
    text-align: center;
    background: #e7f1ff;
    border: none;
    width: 100%;

    & + & {
      margin-left: 1rem;
    }
  }
}
</style>
