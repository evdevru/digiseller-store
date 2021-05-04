import tailwindConfig from './tailwind.config'

export default {
  ssr: true,

  publicRuntimeConfig: {
    baseURL: process.env.BASE_URL || 'http://localhost:3333/',
    AGENT_ID: process.env.AGENT_ID || 716634,
    SELLER_ID: process.env.SELLER_ID || 716634,
    REVIEWS_TYPE: process.env.REVIEWS_TYPE || 'all',
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'digital-store',
    htmlAttrs: {
      lang: 'ru',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap',
      },
    ],
  },

  loading: {
    color: tailwindConfig.theme.extend.colors.blue['200'],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/scss/root.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vue-tailwind.build.js' },
    { src: '~/plugins/vt-notification.client.js', mode: 'client' },
    { src: '~/plugins/axios-handler.client.js', mode: 'client' },
    { src: '~/plugins/services.js' },
    { src: '~/plugins/jsonld.js' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxt/http',
    '@nuxtjs/svg',
    [
      'nuxt-vuex-localstorage',
      {
        localStorage: 'cart',
      },
    ],
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.BASE_URL || 'http://localhost:3333/',
  },

  auth: {
    redirect: {
      login: '/admin',
      home: '/admin/products',
      callback: '/admin/products',
    },
    localStorage: false,
    cookie: {
      prefix: 'auth.',
      options: {
        path: '/',
        expires: 365,
      },
    },
    strategies: {
      local: {
        user: {
          property: 'data.user',
          // autoFetch: true
        },
        token: {
          property: 'data.token',
          maxAge: 60 * 60 * 24 * 365,
        },
        refreshToken: false,
        autoLogout: true,
        endpoints: {
          login: {
            url: '/api/auth/login',
            method: 'post',
          },
          user: { url: '/api/auth/profile', method: 'get' },
          logout: false,
        },
      },
    },
  },

  // Tailwind UI https://tailwindcss.nuxtjs.org/
  tailwindcss: {
    exposeConfig: true,
    jit: true,
  },

  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        path: '/catalog/*',
        component: resolve(__dirname, 'pages/catalog.vue'),
        name: 'catalog-all',
      })
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
