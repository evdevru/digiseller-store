<template>
  <nav class="breadcrumbs">
    <nuxt-link
      v-for="(crumb, idx) in breadcrumbs"
      :key="`crumb-${idx}`"
      class="breadcrumbs__link"
      :to="crumb.link"
      >{{ crumb.title }}</nuxt-link
    >
  </nav>
</template>

<script>
export default {
  props: {
    breadcrumbs: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="scss">
.breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  &__link {
    display: inline-flex;
    align-items: center;
    font-weight: 600;
    @apply text-gray-200;
    &:not(:last-child):after {
      display: inline-flex;
      content: '';
      width: 8px;
      height: 1px;
      border-radius: 99px;
      margin: 0 0.25rem;
      @apply bg-gray-200;
    }
  }
}
</style>
