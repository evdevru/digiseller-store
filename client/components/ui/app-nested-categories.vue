<template>
  <div>
    <div v-for="category in items" :key="category.id">
      <label class="flex items-center mb-1.5">
        <t-radio
          v-model="selected"
          :disabled="disabled === category.id"
          :value="category.id"
          name="parent_id"
          required
        />
        <span class="ml-2 text-sm">{{ category.title }}</span>
      </label>
      <div v-if="category.children.length" class="block ml-3">
        <app-nested-categories
          v-model="selected"
          :disabled="disabled"
          :items="category.children"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppNestedCategories',
  props: {
    disabled: {
      type: Number,
      required: false,
      default: null,
    },
    items: { type: Array, required: false, default: () => [] },
    value: {
      type: [Number, String],
      required: false,
      default: null,
    },
  },
  data() {
    return {
      selected: this.value,
    }
  },
  watch: {
    selected(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.selected = val
    },
  },
  mounted() {
    this.selected = this.value
  },
}
</script>

<style></style>
