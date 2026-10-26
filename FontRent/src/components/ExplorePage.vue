<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useLanguage } from '../composables/useLanguage'
import { properties } from '../data/properties'

const { t } = useLanguage()
type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating'

const searchQuery = ref('')
const city = ref('all')
const category = ref('all')
const minBedrooms = ref(0)
const sortBy = ref<SortOption>('featured')
const favoriteIds = ref<number[]>([])
const cities = computed(() => [...new Set(properties.map((property) => property.city).filter(Boolean))].sort())
const categories = computed(() => [...new Set(['Detached house', 'Dormitory', 'Apartment', 'Shop unit', ...properties.map((property) => property.category).filter(Boolean)])].sort())

function displayCategory(value: string) {
  const keys: Record<string, 'detachedHouse' | 'dormitory' | 'apartment' | 'shopUnit'> = { 'Detached house': 'detachedHouse', Dormitory: 'dormitory', Apartment: 'apartment', 'Shop unit': 'shopUnit' }
 const key = keys[value]
 return key ? t(key) : value
}

const filteredProperties = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const matches = properties.filter((property) => {
    const matchesQuery =
      !query ||
      [property.title, property.neighborhood, property.city, property.category, property.description]
        .some((value) => value.toLowerCase().includes(query))

    return (
      matchesQuery &&
      property.purpose !== 'For Sale' &&
      (!property.listingExpiresAt || new Date(property.listingExpiresAt).getTime() > Date.now()) &&
      (city.value === 'all' || property.city === city.value) &&
      (category.value === 'all' || property.category === category.value) &&
      property.bedrooms >= minBedrooms.value
    )
  })

  if (sortBy.value === 'price-asc') return matches.sort((a, b) => a.monthlyPrice - b.monthlyPrice)
  if (sortBy.value === 'price-desc') return matches.sort((a, b) => b.monthlyPrice - a.monthlyPrice)
  if (sortBy.value === 'rating') return matches.sort((a, b) => b.rating - a.rating)
  return matches
})

const hasActiveFilters = computed(
  () =>
    searchQuery.value.trim().length > 0 ||
    city.value !== 'all' ||
    category.value !== 'all' ||
    minBedrooms.value > 0,
)

function toggleFavorite(id: number) {
  favoriteIds.value = favoriteIds.value.includes(id)
    ? favoriteIds.value.filter((favoriteId) => favoriteId !== id)
    : [...favoriteIds.value, id]
}

function resetFilters() {
  searchQuery.value = ''
  city.value = 'all'
  category.value = 'all'
  minBedrooms.value = 0
  sortBy.value = 'featured'
}
</script>

<template>
  <main class="min-h-[calc(100vh-4rem)] bg-slate-50">
    <section class="border-b border-slate-200 bg-white">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{{ t('findYourPlace') }}</p>
            <h1 class="font-display mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">{{ t('exploreHomes') }}</h1>
            <p class="mt-1 text-sm text-slate-500">{{ t('exploreDescription') }}</p>
          </div>
          <RouterLink to="/" class="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800">
            ← {{ t('backToHome') }}
          </RouterLink>
        </div>

        <div class="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <label class="relative">
            <span class="sr-only">{{ t('searchPlaceholder') }}</span>
            <svg
              class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="search"
              :placeholder="t('searchPlaceholder')"
              class="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <label>
            <span class="sr-only">{{ t('filterCity') }}</span>
            <select
              v-model="city"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">{{ t('allCities') }}</option>
              <option v-for="cityOption in cities" :key="cityOption" :value="cityOption">{{ cityOption }}</option>
            </select>
          </label>
          <label>
            <span class="sr-only">{{ t('filterPropertyType') }}</span>
            <select
              v-model="category"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">{{ t('anyType') }}</option>
              <option v-for="categoryOption in categories" :key="categoryOption" :value="categoryOption">{{ displayCategory(categoryOption) }}</option>
            </select>
          </label>
          <label>
            <span class="sr-only">{{ t('minBedrooms') }}</span>
            <select
              v-model.number="minBedrooms"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option :value="0">{{ t('anyBedrooms') }}</option>
              <option :value="1">{{ t('bedroom1Plus') }}</option>
              <option :value="2">{{ t('bedrooms2Plus') }}</option>
              <option :value="3">{{ t('bedrooms3Plus') }}</option>
              <option :value="4">{{ t('bedrooms4Plus') }}</option>
            </select>
          </label>
          <label>
            <span class="sr-only">{{ t('sortHomes') }}</span>
            <select
              v-model="sortBy"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="featured">{{ t('sortFeatured') }}</option>
              <option value="price-asc">{{ t('priceLowHigh') }}</option>
              <option value="price-desc">{{ t('priceHighLow') }}</option>
              <option value="rating">{{ t('topRated') }}</option>
            </select>
          </label>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
      <div class="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 class="font-display text-xl font-bold text-slate-900">{{ t('homesForRent') }}</h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ filteredProperties.length }} {{ filteredProperties.length === 1 ? t('homeAvailable') : t('homesAvailable') }}
          </p>
        </div>
        <button
          v-if="hasActiveFilters"
          type="button"
          class="text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
          @click="resetFilters"
        >
          {{ t('clearFilters') }}
        </button>
      </div>

      <div v-if="filteredProperties.length" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="property in filteredProperties"
          :key="property.id"
          class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="relative h-56 overflow-hidden bg-slate-100">
            <RouterLink :to="`/properties/${property.id}`" :aria-label="`View details for ${property.title}`">
              <img
                :src="property.image"
                :alt="property.title"
                loading="lazy"
                class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </RouterLink>
            <div class="absolute left-3 top-3 flex flex-wrap gap-1.5">
              <span class="rounded-full bg-slate-950/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {{ displayCategory(property.category) }}
              </span>
              <span
                :class="property.leaseType === 'monthly' ? 'bg-emerald-600/95 text-white' : 'bg-amber-400/95 text-slate-950'"
                class="rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm"
              >
                {{ property.leaseType === 'monthly' ? t('monthlyLease') : t('shortStayAvailable') }}
              </span>
            </div>
            <button
              type="button"
              :aria-label="favoriteIds.includes(property.id) ? `Remove ${property.title} from saved homes` : `Save ${property.title}`"
              :aria-pressed="favoriteIds.includes(property.id)"
              class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow-md transition hover:scale-105 hover:text-rose-500"
              @click="toggleFavorite(property.id)"
            >
              <svg
                class="h-5 w-5"
                :class="favoriteIds.includes(property.id) ? 'fill-rose-500 text-rose-500' : 'fill-none'"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 text-white">
              <span class="truncate rounded-lg bg-slate-950/75 px-2.5 py-1.5 text-xs font-medium backdrop-blur-sm">
                {{ property.neighborhood }}, {{ property.city }}
              </span>
              <span class="shrink-0 rounded-lg bg-slate-950/75 px-2.5 py-1.5 text-xs font-semibold backdrop-blur-sm">
                <span class="text-amber-300">★</span> {{ property.rating }} ({{ property.reviewsCount }})
              </span>
            </div>
          </div>

          <div class="flex flex-1 flex-col justify-between p-5">
            <div>
              <RouterLink
                :to="`/properties/${property.id}`"
                class="font-display text-lg font-bold text-slate-900 transition hover:text-emerald-700"
              >
                {{ property.title }}
              </RouterLink>
              <p class="mt-1 text-xs text-slate-500">
                {{ property.bedrooms }} {{ t('bedsCount') }} · {{ property.bathrooms }} {{ t('bathsCount') }} · {{ property.sqft.toLocaleString() }} sqft
              </p>
              <p class="mt-3 text-sm text-slate-600">
                {{ property.furnished ? t('furnishedDescription') : t('unfurnishedDescription') }}.
                {{ property.leaseType === 'monthly' ? t('monthlyLease') : t('shortStayAvailable') }}.
              </p>
            </div>

            <div class="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <div>
                <span class="font-display text-xl font-extrabold text-slate-900">
                  {{ property.currency === 'MMK' ? 'MMK' : '$' }}{{ property.monthlyPrice.toLocaleString() }}
                </span>
                <span class="text-xs text-slate-500">{{ t('perMonth') }}</span>
                <span v-if="property.nightlyPrice > 0" class="mt-0.5 block text-[11px] text-slate-400">{{ property.currency === 'MMK' ? 'MMK' : '$' }}{{ property.nightlyPrice }}{{ t('perNight') }}</span>
              </div>
              <RouterLink
                :to="`/properties/${property.id}`"
                class="shrink-0 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
              >
                {{ t('viewDetails') }}
              </RouterLink>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-500">⌂</div>
        <h2 class="font-display mt-4 text-lg font-bold text-slate-900">{{ t('noHomesFound') }}</h2>
        <p class="mt-1 text-sm text-slate-500">{{ t('noHomesDescription') }}</p>
        <button
          type="button"
          class="mt-5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          @click="resetFilters"
        >
          {{ t('clearAllFilters') }}
        </button>
      </div>
    </section>
  </main>
</template>
