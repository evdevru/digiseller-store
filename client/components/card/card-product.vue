<template>
  <transition name="fade">
    <div class="card-product">
      <nuxt-link
        class="card-product__link"
        :to="{
          name: 'product-slug',
          params: {
            slug: product.slug,
          },
        }"
      >
        <picture class="card-product__image">
          <img :src="product.thumbnail" alt="Обложка товара" />
        </picture>
        <div class="card-product__body">
          <div class="card-product__title">
            {{ product.title }}
          </div>
          <div class="card-product__price">{{ product.price }} ₽</div>
        </div>
      </nuxt-link>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'CardProduct',
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  computed: {
    webpPath() {
      const paths = this.product.thumbnail.split('.').splice(-1, 1)
      return paths.join('.') + '.webp'
    },
  },
}
</script>

<style lang="scss" scoped>
.card-product {
  --border-radius: 20px;
  --gutter-width: 1rem;
  --vs-dark: 52, 55, 60;
  --vs-warn: 255, 132, 0;

  position: relative;
  @apply rounded-2xl shadow-lg bg-black;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  &:before {
    z-index: 1;
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    box-shadow: inset 0 11rem 3rem -6rem rgba(52, 55, 60, 0.85);
    transform: scaleY(-1);
    opacity: 0.85;
  }
  &:after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    border: 3px solid transparent;
    background: rgba(0, 0, 0, 0.35);
    z-index: 1;
    opacity: 0;
    @apply border-blue-200 rounded-2xl;
  }
  &:hover {
    &:after {
      opacity: 1;
      transition: all 0.3s;
    }
    .card-product__image {
      filter: blur(5px);
    }
  }
  &__link {
    width: 100%;
  }
  &__body {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 100%;
    @apply p-4;
  }
  &__image {
    width: 100%;
    height: auto;
    display: block;
    transition: all 0.3s;
  }
  &__type {
    color: rgba(var(--vs-warn), 1);
    font-weight: 400;
    font-size: 12px;
  }
  &__title {
    @apply text-white leading-5 font-semibold;
  }
  &__footer {
    position: absolute;
    left: 50%;
    bottom: var(--gutter-width);
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-bottom: var(--gutter-width);
    z-index: 5;
  }
  &__price {
    display: inline-block;
    position: absolute;
    top: 1rem;
    right: 1rem;
    box-shadow: 0 1px 10px rgba(var(--vs-warn), 0.65);
    color: black;
    padding: 3px 6px;
    font-size: 14px;
    font-weight: 600;
    @apply rounded-2xl bg-gradient-to-b from-orange-200 to-orange-100;
  }
}
</style>
