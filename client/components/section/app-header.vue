<template>
  <header class="header">
    <div class="container flex flex-wrap items-center">
      <nav class="header__nav m">
        <nuxt-link :to="{ name: 'catalog' }" class="header__link"
          >Каталог</nuxt-link
        >
      </nav>
      <form
        action="/catalog"
        method="GET"
        class="relative inline-block ml-auto header__actions"
      >
        <t-input name="search" placeholder="Поиск ..." />
        <t-button
          class="absolute w-8 h-7 flex items-center justify-center !p-0 block transform -translate-y-1/2 top-1/2 right-2"
          type="submit"
          title="Найти"
        >
          <SearchIcon class="w-4 h-4 fill-white"></SearchIcon>
        </t-button>
        <!-- <t-button class="relative header__find" @click="$modal.show('cart')"
          >Корзина
          <div
            v-show="cart.cart_cnt"
            class="absolute top-0 right-0 w-5 h-5 text-sm text-black transform bg-white rounded-full shadow translate-x-1/4 -translate-y-1/4"
          >
            {{ cart.cart_cnt }}
          </div>
        </t-button> -->
      </form>
    </div>
  </header>
</template>

<script>
import SearchIcon from '@/assets/img/icon/loupe.svg?inline'

export default {
  components: { SearchIcon },
  computed: {
    cart() {
      return this.$store.state.cart.cart
    },
  },
}
</script>

<style lang="scss">
.header {
  padding: 0 0;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);

  &__nav {
    display: inline-flex;
    height: 100%;
  }

  &__actions {
    display: inline-flex;
    align-items: center;
    margin-left: auto;
  }

  &__link {
    display: inline-block;
    line-height: 1;
    padding: 1rem 0;
    border-bottom: 2px solid transparent;
    transition: all 0.3s;
    height: 100%;

    &:hover {
      @apply border-blue-200;
    }

    & + & {
      margin-left: 2rem;
    }
  }

  &__find {
    margin-left: 1rem;
    white-space: nowrap;
  }
}
</style>
