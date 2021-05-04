<template>
  <t-modal ref="modal" name="parameters" @before-open="onBeforeOpen">
    <template #header>
      <h1 class="text-3xl font-bold leading-none">Параметры товара</h1>
    </template>
    <div v-for="(option, idx) in options" :key="`option-${idx}`">
      <label v-if="option.type === 'checkbox'">
        <span class="block mb-2 font-semibold">
          {{ option.label }}
        </span>
        <div
          v-for="(variant, idx2) in option.variants"
          :key="`variant-${idx + idx2}`"
          class="flex items-center"
        >
          <t-checkbox
            :id="option.id"
            v-model="form[option.name]"
            :required="parseInt(option.required) === 1"
            :name="option.name"
            :value="variant.value"
            :checked="variant.default === 1"
          />
          <span class="ml-2 select-none">
            {{ variant.text }}
          </span>
        </div>
      </label>
    </div>
  </t-modal>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      options: [],
      form: {},
    }
  },
  methods: {
    ...mapActions('cart', {
      addToCart: 'addToCart',
    }),
    onBeforeOpen({ params }) {
      this.options = params.product.options
      this.options.forEach((option) => {
        if (option.variants)
          option.variants.forEach((variant) => {
            if (variant.default) {
              this.form[option.name] = variant.value
            }
          })
      })
    },
    getComponent(type) {
      const reserved = ['checkbox', 'radio', 'textarea', 'select']
      if (reserved.includes(type)) {
        return `t-${type}`
      } else {
        return `t-input`
      }
    },
  },
}
</script>

<style></style>
