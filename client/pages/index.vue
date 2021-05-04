<script>
export default {
  asyncData({ redirect }) {
    return redirect('/catalog')
  },
  head() {
    return {
      title: 'Интернет-магазин цифровых товаров',
    }
  },
}
</script>

<style></style>
