import { joinURL } from 'ufo'
import { defineProvider } from '@nuxt/image/runtime'

interface SpoonacularOptions {
  baseURL?: string
}

export default defineProvider<SpoonacularOptions>({
  getImage: (src, { modifiers = {}, baseURL = 'https://spoonacular.com/cdn' }) => {
    const sizes = [100, 250, 500]
    const size = modifiers.width || modifiers.height || 0
    const nextBiggest = sizes.find((s) => s >= size) || sizes[sizes.length - 1]
    const prefix = `ingredients_${nextBiggest}x${nextBiggest}`
    
    return {
      url: joinURL(baseURL, prefix, src),
    }
  }
})
