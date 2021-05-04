<template>
  <div v-if="cartItem" class="grid grid-cols-3 gap-4">
    <div class="col-span-1">
      <picture class="block overflow-hidden shadow rounded-2xl">
        <img :src="product.thumbnail" :alt="product.title" />
      </picture>
    </div>
    <div class="col-span-2">
      <h2 class="block mb-3">{{ product.title }}</h2>
      <div class="flex items-center mb-3">
        <div class="flex items-center space-x-2">
          <t-button
            variant="secondary"
            :disabled="cartItem.cnt_item <= 1"
            class="w-6 h-6 !p-0 ml-auto leading-none text-center"
            type="button"
            @click="count--"
          >
            -
          </t-button>
          <input
            v-model="count"
            class="w-12 px-3 py-1 leading-none text-center text-blue-200 bg-blue-300 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
            type="text"
          />
          <t-button
            variant="secondary"
            class="w-6 h-6 !p-0 ml-auto leading-none"
            type="button"
            @click="count++"
          >
            +
          </t-button>
        </div>
        <t-button
          variant="secondary"
          class="ml-auto w-6 flex justify-center items-center h-6 !p-0"
          type="button"
          @click="count = 0"
        >
          <TrashIcon class="w-3 h-3" />
        </t-button>
      </div>
      <strong>Цена: </strong><span>{{ cartItem.price }} ₽</span>
    </div>
  </div>
</template>

<script>
import TrashIcon from '@/assets/img/icon/trash.svg?inline'
import { mapActions } from 'vuex'

export default {
  components: {
    TrashIcon,
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    cartItem: {
      type: Object,
      required: true,
    },
  },
  computed: {
    count: {
      get() {
        return this.cartItem.cnt_item
      },
      set(val) {
        if (parseInt(val) <= 100)
          this.changeCartCount({
            item_id: this.cartItem.item_id,
            product_cnt: val,
          })
      },
    },
  },
  methods: {
    ...mapActions('cart', {
      getCart: 'getCart',
      changeCartCount: 'changeCartCount',
    }),
  },
}
</script>

<style></style>
