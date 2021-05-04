<template>
  <div v-if="reviews.length" class="reviews">
    <header class="flex flex-wrap items-center p-4">
      <h2 class="text-xl font-semibold">Отзывы</h2>
      <t-pagination
        v-model="reviewsPage"
        class="ml-auto"
        :total-items="reviewsTotal"
        :per-page="reviewsRows"
        :limit="3"
        :hide-first-last-controls="true"
        :hide-ellipsis="true"
        variant="rounded"
      />
    </header>
    <div>
      <div
        v-for="(review, idx) in reviews"
        :key="`review-${idx}`"
        class="border-t-2 border-gray-100 reviews__item"
        :class="{
          'border-green-100 border-opacity-30':
            $config.REVIEWS_TYPE === 'all' && review.type === 'good',
          'border-red-500 border-opacity-30':
            $config.REVIEWS_TYPE === 'all' && review.type === 'bad',
        }"
      >
        <p>{{ review.info }}</p>
        <div v-if="review.comment" class="mt-2">
          <CommentIcon class="inline-block float-left w-6 h-6 mr-2" />
          <p class="inline-block">
            {{ review.comment }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommentIcon from '@/assets/img/icon/conversation.svg?inline'
// import { EmojiConvertor } from 'emoji-js'
// const emoji = new EmojiConvertor()
export default {
  components: { CommentIcon },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      reviews: [],
      reviewsTotal: 0,
      reviewsRows: 5,
      reviewsPage: 1,
    }
  },
  async fetch() {
    await this.getReviews()
  },
  watch: {
    reviewsPage(val) {
      this.getReviews(val)
    },
  },
  methods: {
    async getReviews() {
      const { data } = await this.$axios.get(
        `https://api.digiseller.ru/api/reviews?seller_id=${this.$config.SELLER_ID}&product_id=${this.id}&type=${this.$config.REVIEWS_TYPE}&page=${this.reviewsPage}&rows=${this.reviewsRows}`
      )
      const retval = parseInt(data.retval)
      this.$emit('fetch', {
        good: parseInt(data.totalGood),
        bad: parseInt(data.totalBad),
      })
      if (retval === 0 && data.review && data.review.length) {
        this.reviewsTotal = parseInt(data.totalItems)
        this.reviews = data.review.filter((x) => x.info.length > 2)
        this.reviews.map((review) => {
          review.info = review.info.trim()
          const numberCloseBrackets = (review.info.match(/\)/g) || []).length
          const numberOpenBrackets = (review.info.match(/\(/g) || []).length
          review.info = review.info
            .replaceAll(':)', ' 😀 ')
            .replaceAll(':(', ' 🙁 ')
          if (numberCloseBrackets !== numberOpenBrackets) {
            review.info = review.info
              .replaceAll(')', ' 😀 ')
              .replaceAll('(', ' 🙁 ')
          }
          return review
        })
      }
    },
  },
}
</script>

<style lang="scss">
.reviews {
  @apply bg-white shadow rounded-2xl;

  &__item {
    @apply px-4 py-2;

    & > p::first-letter {
      @apply uppercase;
    }
  }
}
</style>
