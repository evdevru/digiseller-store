/* eslint-disable camelcase */
export const state = () => ({
  cart_uid: '',
  lang: 'ru-RU',
  typecurr: 'WMR',
  cart: {},
})

export const mutations = {
  setCart(state, payload) {
    if (payload.cart_uid) state.cart_uid = payload.cart_uid
    Object.assign(state.cart, payload)
  },
  setCartUid(state, uid) {
    state.cart_uid = uid
  },
}

export const actions = {
  async getCart({ state, commit }) {
    const body = {
      cart_uid: state.cart_uid,
      cart_curr: state.typecurr,
      lang: state.lang,
    }
    const rawData = new URLSearchParams(
      Object.keys(body).map((key) => [key, body[key]])
    )
    const data = await this.$http.$post(
      'http://shop.digiseller.ru/xml/shop_cart_lst.asp?transp=CORS&format=json',
      rawData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )
    if (data.products) {
      const cartIds = data.products.map((x) => parseInt(x.id))
      const productService = new this.$services.DataService('products')
      await productService.getAll()
      data.database = productService.list.filter((x) =>
        cartIds.includes(x.digiseller_id)
      )
    }
    commit('setCart', data)
  },

  async addToCart({ state, commit }, product_id) {
    const cart_uid = state.cart_uid
    const body = {
      product_id,
      product_cnt: 1,
      typecurr: state.typecurr,
      cart_uid,
      lang: state.lang,
    }
    const rawData = new URLSearchParams(
      Object.keys(body).map((key) => [key, body[key]])
    )
    const data = await this.$http.$post(
      'https://shop.digiseller.ru/xml/shop_cart_add.asp?transp=CORS&format=json',
      rawData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )
    if (data.cart_err_num === '0') {
      commit('setCartUid', data.cart_uid)
      commit('setCart', data)
    }
    return data
  },

  async changeCartCount({ commit, state }, payload) {
    const body = {
      ...payload,
      lang: state.lang,
      cart_uid: state.cart_uid,
      typecurr: state.typecurr,
    }
    const rawData = new URLSearchParams(
      Object.keys(body).map((key) => [key, body[key]])
    )
    const data = await this.$http.$post(
      'http://shop.digiseller.ru/xml/shop_cart_lst.asp?transp=CORS&format=json',
      rawData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )
    if (!data.products) data.products = []
    commit('setCart', data)
  },
}

export const getters = {}
