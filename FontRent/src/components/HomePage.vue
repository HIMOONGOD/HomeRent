<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useLanguage } from '../composables/useLanguage'
import { properties, type LeaseType } from '../data/properties'

type LeaseFilter = 'all' | LeaseType
const { t } = useLanguage()

const categories = computed(() => {
 const featured = [
  { label: t('allHomes'), value: 'all', icon: '\u2302' },
  { label: t('detachedHouse'), value: 'Detached house', icon: '\u2302' },
  { label: t('dormitory'), value: 'Dormitory', icon: '\u2302' },
  { label: t('apartment'), value: 'Apartment', icon: '\u2302' },
    { label: t('shopUnit'), value: 'Shop unit', icon: '\u2302' },
 ]
 const known = new Set(featured.map((category) => category.value))
 const extra = [...new Set(properties.map((property) => property.category))].filter((category) => !known.has(category)).map((category) => ({ label: category, value: category, icon: '\u2302' }))
 return [...featured, ...extra]
})

const leaseOptions = computed(() => [
  { label: t('allRentals'), value: 'all' },
  { label: t('monthlyLease'), value: 'monthly' },
  { label: t('shortStay'), value: 'short' },
])

function displayCategory(category: string) {
  const labels: Record<string, 'detachedHouse' | 'dormitory' | 'apartment' | 'shopUnit'> = { 'Detached house': 'detachedHouse', Dormitory: 'dormitory', Apartment: 'apartment', 'Shop unit': 'shopUnit' }
 const key = labels[category]
 return key ? t(key) : category
}

const filters = ref({
  leaseType: 'all' as LeaseFilter,
  city: 'all',
  category: 'all',
  minBedrooms: 0,
  maxPrice: 1000000000000,
})
const favoriteIds = ref<number[]>([])
const cities = computed(() => [...new Set(properties.map((property) => property.city).filter(Boolean))].sort())

const filteredProperties = computed(() =>
  properties.filter((property) => {
    return (
      property.purpose !== 'For Sale' &&
      (filters.value.leaseType === 'all' || property.leaseType === filters.value.leaseType) &&
      (!property.listingExpiresAt || new Date(property.listingExpiresAt).getTime() > Date.now()) &&
      (filters.value.city === 'all' || property.city === filters.value.city) &&
      (filters.value.category === 'all' || property.category === filters.value.category) &&
      property.bedrooms >= filters.value.minBedrooms &&
      property.monthlyPrice <= filters.value.maxPrice
    )
  }),
)

const hasActiveFilters = computed(
  () =>
    filters.value.leaseType !== 'all' ||
    filters.value.city !== 'all' ||
    filters.value.category !== 'all' ||
    filters.value.minBedrooms > 0 ||
    filters.value.maxPrice < 1000000000000,
)

function toggleFavorite(id: number) {
  favoriteIds.value = favoriteIds.value.includes(id)
    ? favoriteIds.value.filter((favoriteId) => favoriteId !== id)
    : [...favoriteIds.value, id]
}

function resetFilters() {
  filters.value = {
    leaseType: 'all',
    city: 'all',
    category: 'all',
    minBedrooms: 0,
    maxPrice: 1000000000000,
  }
}
</script>

<template>
  <main class="min-h-screen bg-slate-50">
    <section class="relative isolate overflow-hidden bg-slate-950 text-white">
      <img
        class="absolute inset-0 -z-20 h-full w-full object-cover"
        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2200&q=90"
        alt=""
      />
      <div class="absolute inset-0 -z-10 bg-linear-to-r from-slate-950/90 via-slate-900/75 to-slate-900/35"></div>
      <div class="absolute inset-0 -z-10 bg-linear-to-t from-slate-950/50 via-transparent to-transparent"></div>

      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div class="max-w-3xl">
          <div
            class="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/15 px-3.5 py-1.5 text-xs font-semibold text-emerald-100"
          >
            <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
            {{ t('heroBadge') }}
            <span class="text-emerald-200/70">·</span>
            {{ t('zeroBrokerFees') }}
          </div>
          <h1 class="font-display max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {{ t('heroTitle') }}
          </h1>
          <p class="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
            {{ t('heroDescription') }}
          </p>
        </div>

        <form
          class="mt-9 max-w-6xl rounded-2xl border border-white/70 bg-white p-3 text-slate-900 shadow-2xl sm:p-5"
          @submit.prevent
        >
          <div class="mb-4 flex gap-2 overflow-x-auto border-b border-slate-100 pb-4">
            <button
              v-for="option in leaseOptions"
              :key="option.value"
              type="button"
              :aria-pressed="filters.leaseType === option.value"
              :class="
                filters.leaseType === option.value
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              "
              class="shrink-0 rounded-lg px-3.5 py-2 text-xs font-semibold transition"
              @click="filters.leaseType = option.value as LeaseFilter"
            >
              {{ option.label }}
            </button>
          </div>

          <div class="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <label class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400">{{ t('locationCity') }}</span>
              <select
                v-model="filters.city"
                class="mt-1 w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
              >
                <option value="all">{{ t('allCities') }}</option>
                <option v-for="cityOption in cities" :key="cityOption" :value="cityOption">{{ cityOption }}</option>
              </select>
            </label>
            <label class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400">{{ t('propertyType') }}</span>
              <select
                v-model="filters.category"
                class="mt-1 w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
              >
                <option value="all">{{ t('anyType') }}</option>
                <option value="Villa">{{ t('modernVilla') }}</option>
                <option value="Penthouse">{{ t('penthouseCondo') }}</option>
                <option value="Family House">{{ t('familyHouse') }}</option>
                <option value="Studio Loft">{{ t('studioLoft') }}</option>
              </select>
            </label>
            <label class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400">{{ t('minBedrooms') }}</span>
              <select
                v-model.number="filters.minBedrooms"
                class="mt-1 w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
              >
                <option :value="0">{{ t('anyBedrooms') }}</option>
                <option :value="1">{{ t('bedroom1Plus') }}</option>
                <option :value="2">{{ t('bedrooms2Plus') }}</option>
                <option :value="3">{{ t('bedrooms3Plus') }}</option>
                <option :value="4">{{ t('bedrooms4Plus') }}</option>
              </select>
            </label>
            <label class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400">{{ t('monthlyBudget') }}</span>
              <select
                v-model.number="filters.maxPrice"
                class="mt-1 w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
              >
                <option :value="1000000000000">{{ t('noLimit') }}</option>
                <option :value="1000">{{ t('upTo1000') }}</option>
                <option :value="2000">{{ t('upTo2000') }}</option>
                <option :value="3500">{{ t('upTo3500') }}</option>
                <option :value="5000">{{ t('upTo5000') }}</option>
              </select>
            </label>
            <a
              href="#featured-homes"
              class="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {{ t('findHomes') }} ({{ filteredProperties.length }})
            </a>
          </div>
        </form>

        <div class="mt-8 flex flex-wrap gap-x-8 gap-y-4 text-sm text-slate-200">
          <div><span class="font-display text-xl font-bold text-white">1,200+</span><span class="ml-2">{{ t('verifiedHomes') }}</span></div>
          <div><span class="font-display text-xl font-bold text-white">4.9/5</span><span class="ml-2">{{ t('tenantRating') }}</span></div>
          <div><span class="font-display text-xl font-bold text-white">0%</span><span class="ml-2">{{ t('brokerFees') }}</span></div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 pb-1 pt-9 sm:px-6 lg:px-8">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex max-w-full items-center gap-2 overflow-x-auto pb-2">
          <button
            v-for="category in categories"
            :key="category.value"
            type="button"
            :aria-pressed="filters.category === category.value"
            :class="
              filters.category === category.value
                ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
            "
            class="flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition"
            @click="filters.category = category.value"
          >
            <span aria-hidden="true">{{ category.icon }}</span>
            {{ category.label }}
          </button>
        </div>
        <RouterLink
          to="/explore"
          class="flex items-center gap-1 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
        >
          {{ t('explore') }}
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </RouterLink>
      </div>
    </section>

    <section id="featured-homes" class="mx-auto max-w-7xl scroll-mt-24 px-4 py-8 sm:px-6 lg:px-8">
      <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{{ t('handpickedForYou') }}</p>
          <h2 class="font-display mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">{{ t('featuredHomes') }}</h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ filteredProperties.length }} {{ t('matchingHomes') }}
          </p>
        </div>
        <button
          v-if="hasActiveFilters"
          type="button"
          class="text-sm font-semibold text-rose-600 hover:text-rose-700 hover:underline"
          @click="resetFilters"
        >
          {{ t('resetFilters') }}
        </button>
      </div>

      <div
        v-if="filteredProperties.length === 0"
        class="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center"
      >
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-500">⌂</div>
        <h3 class="mt-4 font-display text-lg font-bold text-slate-900">{{ t('noHomesMatch') }}</h3>
        <p class="mt-1 text-sm text-slate-500">{{ t('tryDifferentFilters') }}</p>
        <button
          type="button"
          class="mt-5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          @click="resetFilters"
        >
          {{ t('resetAllFilters') }}
        </button>
      </div>

      <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="property in filteredProperties"
          :key="property.id"
          class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="relative h-56 overflow-hidden bg-slate-100">
            <img
              :src="property.image"
              :alt="property.title"
              loading="lazy"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div class="absolute left-3 top-3 flex flex-wrap gap-1.5">
              <span class="rounded-full bg-slate-950/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {{ displayCategory(property.category) }}
              </span>
              <span
                :class="property.leaseType === 'monthly' ? 'bg-emerald-600/95 text-white' : 'bg-amber-400/95 text-slate-950'"
                class="rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm"
              >
                {{ property.leaseType === 'monthly' ? t('monthlyLease') : t('shortStay') }}
              </span>
            </div>
            <button
              type="button"
              :aria-label="favoriteIds.includes(property.id) ? t('removeSavedListing') : t('saveListing')"
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
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.8"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
            <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 text-white">
              <span class="truncate rounded-lg bg-slate-950/75 px-2.5 py-1.5 text-xs font-medium backdrop-blur-sm">
                {{ property.neighborhood }}, {{ property.city }}
              </span>
              <span class="shrink-0 rounded-lg bg-slate-950/75 px-2.5 py-1.5 text-xs font-semibold backdrop-blur-sm">
                <span class="text-amber-300">★</span> {{ property.rating }} ({{ property.reviewsCount }} {{ t('reviews') }})
              </span>
            </div>
          </div>

          <div class="flex flex-1 flex-col justify-between p-5">
            <div>
              <h3 class="font-display text-lg font-bold text-slate-900 transition group-hover:text-emerald-700">
                {{ property.title }}
              </h3>
              <div class="mt-1 flex items-center gap-1 text-xs text-slate-500">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ property.neighborhood }}, {{ property.city }}
              </div>
              <div class="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs font-medium text-slate-600">
                <span>{{ property.bedrooms }} {{ t('beds') }}</span>
                <span>{{ property.bathrooms }} {{ t('baths') }}</span>
                <span>{{ property.sqft.toLocaleString() }} sqft</span>
                <span class="rounded bg-emerald-50 px-2 py-1 font-semibold text-emerald-800">
                  {{ property.furnished ? t('furnished') : t('unfurnished') }}
                </span>
              </div>
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
    </section>

    <section class="mt-8 border-y border-slate-200 bg-white py-14 sm:py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto mb-10 max-w-2xl text-center">
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{{ t('howItWorks') }}</p>
          <h2 class="font-display mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{{ t('designedFor') }}</h2>
          <p class="mt-3 text-sm leading-6 text-slate-600 sm:text-base">{{ t('howDescription') }}</p>
        </div>
        <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
          <article class="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div class="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 font-display font-bold text-emerald-800">01</div>
            <h3 class="font-display text-base font-bold text-slate-900">{{ t('findTheRightHome') }}</h3>
            <p class="mt-2 text-sm leading-6 text-slate-600">{{ t('findHomeDescription') }}</p>
          </article>
          <article class="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div class="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 font-display font-bold text-emerald-800">02</div>
            <h3 class="font-display text-base font-bold text-slate-900">{{ t('meetLandlord') }}</h3>
            <p class="mt-2 text-sm leading-6 text-slate-600">{{ t('meetLandlordDescription') }}</p>
          </article>
          <article class="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div class="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 font-display font-bold text-emerald-800">03</div>
            <h3 class="font-display text-base font-bold text-slate-900">{{ t('moveInConfidently') }}</h3>
            <p class="mt-2 text-sm leading-6 text-slate-600">{{ t('moveInDescription') }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="flex flex-col justify-between gap-6 rounded-3xl bg-emerald-950 px-6 py-9 text-white sm:flex-row sm:items-center sm:px-10">
        <div>
          <p class="text-sm font-semibold text-emerald-300">{{ t('haveAPlaceToRent') }}</p>
          <h2 class="font-display mt-1 text-2xl font-bold">{{ t('meetNextTenant') }}</h2>
          <p class="mt-2 max-w-xl text-sm leading-6 text-emerald-100/80">{{ t('landlordCallout') }}</p>
        </div>
        <RouterLink
          to="/add-property"
          class="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-50"
        >
          {{ t('listYourHouse') }}
        </RouterLink>
      </div>
    </section>
  </main>
</template>
