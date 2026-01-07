// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    spoonacular: {
      apiKey: ''
    }
  },

  routeRules: {
    '/**': {
      isr: 60 * 60 * 24
    }
  },

  $development: {
    nitro: {
      storage: {
        recipes: {
          driver: 'fs',
          base: 'recipes'
        }
      }
    }
  },
  
  image: {
    providers: {
      spoonacular: {
        provider: '~/providers/spoonacular.ts',
      }
    }
  },

  modules: ['@nuxt/ui', "@nuxt/image"]
})
