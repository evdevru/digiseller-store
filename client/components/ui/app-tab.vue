<template>
  <section
    v-if="isActive"
    :id="hash"
    :aria-labelledby="name"
    class="tabs-component-panel"
    role="tabpanel"
    tabindex="0"
  >
    <slot />
  </section>
</template>

<script>
export default {
  props: {
    id: { default: null },
    name: { type: String, required: true },
    prefix: { default: '' },
    suffix: { default: '' },
  },

  data() {
    return {
      isActive: false,
    }
  },

  computed: {
    header() {
      return this.prefix + this.name + this.suffix
    },

    hash() {
      return this.id
        ? '#' + this.id
        : '#' + this.name.toLowerCase().replace(/ /g, '-')
    },
  },
}
</script>
