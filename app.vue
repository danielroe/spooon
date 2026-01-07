<template>
  <UApp>
    <UContainer v-if="recipe">
      <h1 class="font-bold text-xl mt-12 md:mt-24">
        {{ recipe.title }}
      </h1>
      <div class="flex flex-row gap-1 mt-2">
        <UBadge v-for="label in recipe.dishTypes" :label="label" :variant="'subtle'" />
      </div>
      <section class="mt-4 flex flex-col md:flex-row-reverse gap-4 w-full">
        <NuxtImg v-if="recipe.image" :src="recipe.image" :alt="recipe.title" class="object-cover w-full" v-bind="recipe.image.match(/-(?<width>\d+)x(?<height>\d+)\./)?.groups" />
        <p class="text-lg max-w-[40ch]" v-html="recipe.summary" />
      </section>
      <div class="flex flex-col md:flex-row gap-2 md:gap-8">
        <section class="py-2 md:py-8 min-w-12">
          <div class="flex flex-col md:flex-row justify-between md:items-center">
            <h2 class="text-lg">Ingredients</h2>
            <label class="flex flex-row md:flex-row-reverse items-center gap-2 mt-2 text-sm">
              <USwitch v-model="metric" :aria-label="`Switch to ${metric ? 'US' : 'metric'} units`" />
              metric
            </label>
          </div>
          <UTable class="mt-2" :data="recipe.extendedIngredients" :columns="columns" />
        </section>
        <section v-if="recipe.analyzedInstructions?.[0]" class="py-2 md:py-8">
          <h2 class="text-lg">Steps</h2>
          <ol class="flex flex-col gap-1 md:gap-4 mt-5 w-full max-w-[60ch]">
            <li v-for="{ number, step } in recipe.analyzedInstructions[0].steps" class="flex items-baseline gap-2">
              <span class="shrink-0 inline-flex items-center justify-center rounded-full text-xs px-2 py-1 bg-primary-50 dark:bg-primary-400 dark:bg-opacity-10 text-primary-500 dark:text-primary-400 ring-1 ring-inset ring-primary-500 dark:ring-primary-400 ring-opacity-25 dark:ring-opacity-25 font-bold h-5 w-5">
                {{ number }}
              </span>
              {{ step }}
            </li>
          </ol>
        </section>
      </div>
      <UButton external :to="recipe.sourceUrl" class="mt-4 font-bold mb-24">
        View original recipe on {{ recipe.sourceName }}
      </UButton>
    </UContainer>
  </UApp>
</template>

<script setup lang="ts">
import type { InternalApi } from 'nitropack'

const { data: recipe } = await useFetch('/api/recipes', {
  transform: data => data[Math.random() * data.length | 0]
})

type Ingredient = InternalApi['/api/recipes']['get'][number]['extendedIngredients'][number]

const columns = [{
  id: 'name',
  accessorKey: 'name',
  header: 'Name',
  cell: ({ row }: { row: { original: Ingredient } }) => {
    const ingredient = row.original
    return h('span', { class: 'flex flex-row gap-2 items-center' }, [
      ingredient.image ? h('img', {
        src: `/ingredients_100x100/${ingredient.image}`,
        height: 20,
        width: 20,
        alt: `Image of ${ingredient.name}`
      }) : null,
      `${ingredient.name} (${[ingredient.measures[unit.value].amount, ingredient.measures[unit.value].unitLong].filter(Boolean).join(' ')})`
    ])
  }
}]

const metric = ref(true)
const unit = computed(() => metric.value ? 'metric' : 'us')

useServerHead({
  htmlAttrs: {
    lang: 'en',
  },
})

useServerSeoMeta({
  title: recipe.value!.title,
  description: recipe.value!.summary,
  ogTitle: recipe.value!.title,
  ogDescription: recipe.value!.summary,
  ogImage: recipe.value!.image,
  twitterCard: 'summary_large_image',
  ogUrl: 'https://nuxt-spooon.vercel.app'
})
</script>

<style>
@reference "~/assets/css/main.css";

p a {
  @apply text-primary-500 hover:underline font-bold;
}
</style>
