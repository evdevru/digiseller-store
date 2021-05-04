<template>
  <main class="flex flex-col min-h-screen pb-6">
    <app-header class="bg-white" />
    <Nuxt class="flex-1" />
    <modal-video />
  </main>
</template>

<script>
import ModalVideo from '../components/modal/modal-video.vue'
import appHeader from '~/components/section/app-header.vue'
export default {
  components: { appHeader, ModalVideo },
}
</script>
