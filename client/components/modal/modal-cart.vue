<template>
  <t-modal ref="modal" name="cart" @before-open="onBeforeOpen">
    <template #header>
      <h1 class="text-3xl font-bold leading-none">Корзина товаров</h1>
    </template>
    <div
      v-if="cart.products && cart.products.length"
      class="grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      <card-product-cart
        v-for="product in cart.database"
        :key="`product-${product.id}`"
        :product="product"
        :cart-item="getProductInCart(product.digiseller_id)"
      />
    </div>
    <div v-else>
      <b class="block mb-3">Ваша корзина пуста</b>
      <t-button @click="redirectToCatalog">Перейти к покупкам</t-button>
    </div>
    <template v-if="cart.products && cart.products.length" #footer>
      <div class="flex flex-wrap items-center">
        <p>
          <strong>Итого: </strong>
          {{ cart.amount }} ₽
        </p>
        <form
          id="digiselller_form"
          action="https://oplata.info/asp2/pay.asp"
          method="post"
          class="ml-auto"
          target="_blank"
        >
          <input type="hidden" name="cart_uid" :value="cart.cart_uid" />
          <input type="hidden" name="typecurr" :value="cart.typecurr" />
          <input type="hidden" name="lang" :value="cart.lang" />
          <input type="hidden" name="failpage" :value="failpage" />
          <input type="hidden" name="agent" :value="$config.agent_id" />
          <t-button type="submit">Перейти к оплате</t-button>
        </form>
      </div>
    </template>
  </t-modal>
</template>

<script>
import { mapActions } from 'vuex'
import CardProductCart from '../card/card-product-cart.vue'
export default {
  components: {
    CardProductCart,
  },
  computed: {
    cart() {
      return this.$store.state.cart.cart
    },
    failpage() {
      return window.location.href
    },
  },
  methods: {
    ...mapActions('cart', {
      getCart: 'getCart',
    }),
    async onBeforeOpen() {
      if (this.$store.state.cart.cart_uid) await this.getCart()
    },
    getProductInCart(id) {
      return this.cart.products.find((x) => parseInt(x.id) === id)
    },
    redirectToCatalog() {
      this.$router.push({ name: 'catalog' })
      this.$refs.modal.hide()
    },
  },
}
</script>

<style></style>
