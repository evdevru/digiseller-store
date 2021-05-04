<template>
  <header>
    <div class="container">
      <nav
        class="flex flex-wrap items-center p-3 space-x-3 bg-white shadow rounded-xl"
      >
        <t-button variant="secondary" :to="{ name: 'index' }">Главная</t-button>
        <t-button :to="{ name: 'admin-products' }">Товары</t-button>
        <t-button :to="{ name: 'admin-categories' }">Категории</t-button>
        <t-button :to="{ name: 'admin-tags' }">Теги</t-button>
        <t-button :to="{ name: 'admin-parameters' }">Параметры</t-button>
        <t-button :to="{ name: 'admin-tabs' }">Вкладки</t-button>
        <t-button :to="{ name: 'admin-sync' }">Синхронизация</t-button>
      </nav>
    </div>
  </header>
</template>

<script>
export default {}
</script>

<style></style>
