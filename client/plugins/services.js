/* eslint-disable camelcase */
export default (ctx, inject) => {
  class DataService {
    constructor(resource) {
      this.resource = resource
      this.list = []
    }

    async getAll() {
      const { data } = await ctx.$axios.get(`/api/${this.resource}`)
      this.list = data
    }

    get(id) {
      return ctx.$axios.get(`/api/${this.resource}/${id}`)
    }

    async create(data, options = {}) {
      const respose = await ctx.$axios.post(
        `/api/${this.resource}`,
        data,
        options
      )
      this.getAll()
      return respose
    }

    async update(data, options = {}) {
      const id = data.id || data.get('id')
      await ctx.$axios.put(`/api/${this.resource}/${id}`, data, options)
      this.getAll()
    }

    async destroy(id) {
      await ctx.$axios.delete(`/api/${this.resource}/${id}`)
      this.list = this.list.filter((x) => x.id !== id)
    }

    async destroyAll() {
      await ctx.$axios.delete(`/api/${this.resource}`)
      this.list = []
    }
  }

  class DigisellerService {
    constructor(sellerId) {
      this.seller_id = sellerId
      this.lang = 'ru-RU'
      this.currency = 'RUR'
    }

    async getProduct(id) {
      return await ctx.$axios.get(
        `https://api.digiseller.ru/api/products/${id}/info?lang=${this.lang}&currency=${this.currency}`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      )
    }

    async getCategories(
      seller_id = ctx.$config.SELLER_ID,
      category_id = 0,
      lang = 'ru-RU'
    ) {
      return await ctx.$axios.get(
        `https://api.digiseller.ru/api/categories?seller_id=${seller_id}&lang=${lang}&category_id=${category_id}`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      )
    }

    async getProductsByCategory(
      category_id = 0,
      seller_id = ctx.$config.SELLER_ID,
      lang = 'ru-RU',
      currency = 'RUR'
    ) {
      return await ctx.$axios.get(
        `https://api.digiseller.ru/api/shop/products?seller_id=${seller_id}&lang=${lang}&category_id=${category_id}&currency=${currency}`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      )
    }
  }

  const services = {
    DataService,
    DigisellerService,
  }

  ctx.$services = services

  inject('services', services)
}
