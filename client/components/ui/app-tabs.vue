<template>
  <div class="tabs-component">
    <ul role="tablist" class="tabs-component-tabs">
      <li
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{ 'is-active': tab.isActive }"
        class="tabs-component-tab"
        role="presentation"
      >
        <button
          :aria-selected="tab.isActive"
          href="javascript:void(0);"
          class="tabs-component-tab-a"
          role="tab"
          :tabindex="!tab.isActive ? -1 : ''"
          @click="selectTab(tab.hash)"
          v-html="tab.header"
        ></button>
      </li>
    </ul>
    <div class="tabs-component-panels">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabs: [],
      activeTabHash: '',
    }
  },

  created() {
    this.tabs = this.$children
  },

  beforeMount() {},

  mounted() {
    this.tabs = this.tabs.reduce((acc, tab) => {
      const els = this.tabs.map((x) => x.$el)
      if (!els.includes(tab.$el.id)) {
        acc.push(tab)
      }
      return acc
    }, [])

    if (this.tabs.length) {
      this.selectTab(this.tabs[0].hash)
    }
  },

  methods: {
    findTab(hash) {
      return this.tabs.find((tab) => tab.hash === hash)
    },

    selectTab(selectedTabHash) {
      const selectedTab = this.findTab(selectedTabHash)

      if (!selectedTab) {
        return
      }

      this.tabs.forEach((tab) => {
        tab.isActive = tab.hash === selectedTab.hash
      })

      this.$emit('changed', { tab: selectedTab })

      this.activeTabHash = selectedTab.hash
    },
  },
}
</script>
