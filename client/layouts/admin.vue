<template>
  <main class="flex flex-col min-h-screen my-4">
    <admin-header />
    <Nuxt class="flex-1 my-4" />
    <app-toast />
  </main>
</template>

<script>
import AdminHeader from '~/components/section/admin/admin-header.vue'
import appToast from '~/components/ui/app-toast.vue'
export default {
  components: { appToast, AdminHeader },
  middleware: 'auth',
}
</script>
