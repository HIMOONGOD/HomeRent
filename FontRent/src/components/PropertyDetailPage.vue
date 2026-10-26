<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useLanguage } from '../composables/useLanguage'
import { properties } from '../data/properties'

const route = useRoute()
const { t, language } = useLanguage()
const favorite = ref(false)

const property = computed(() => {
  const id = Number(route.params.id)
  return Number.isInteger(id) ? properties.find((item) => item.id === id) : undefined
})

const propertyPhotos = computed(() =>
  property.value?.photos?.length ? property.value.photos : property.value ? [property.value.image] : [],
)

function displayCategory(value: string) {
  const keys: Record<string, 'categoryVilla' | 'categoryPenthouse' | 'categoryFamilyHouse' | 'categoryStudioLoft'> = {
    Villa: 'categoryVilla',
    Penthouse: 'categoryPenthouse',
    'Family House': 'categoryFamilyHouse',
    'Studio Loft': 'categoryStudioLoft',
  }
  const key = keys[value]
  return key ? t(key) : value
}
</script>

<template>
  <main class="min-h-[calc(100vh-4rem)] bg-slate-50">
    <section v-if="property" class="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
        <RouterLink
          to="/explore"
          class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-700"
        >
          <span aria-hidden="true">←</span>
          {{ t('backToHomes') }}
        </RouterLink>
        <button
          type="button"
          :aria-pressed="favorite"
          class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:text-rose-600"
          @click="favorite = !favorite"
        >
          <span aria-hidden="true">{{ favorite ? '♥' : '♡' }}</span>
          {{ favorite ? t('saved') : t('saveHome') }}
        </button>
      </div>

      <div
        class="grid gap-2 overflow-hidden rounded-3xl bg-slate-200"
        :class="propertyPhotos.length > 1 ? 'sm:grid-cols-2' : ''"
      >
        <img
          :src="propertyPhotos[0]"
          :alt="property.title"
          class="h-64 w-full object-cover sm:h-96 lg:h-[460px]"
          :class="propertyPhotos.length > 1 ? 'sm:h-[460px]' : ''"
        />
        <div
          v-if="propertyPhotos.length > 1"
          class="grid grid-cols-2 gap-2"
          :class="propertyPhotos.length === 3 ? 'sm:grid-cols-1' : ''"
        >
          <img
            v-for="(photo, index) in propertyPhotos.slice(1)"
            :key="photo"
            :src="photo"
            :alt="`${property.title} - ${index + 2}`"
            class="h-36 w-full object-cover sm:h-[226px]"
          />
        </div>
      </div>

      <div class="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div class="space-y-7 lg:col-span-2">
          <section>
            <div class="flex flex-wrap items-center gap-2">
              <span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                {{ displayCategory(property.category) }}
              </span>
              <span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                {{ property.leaseType === 'monthly' ? t('monthlyLease') : t('shortStay') }}
              </span>
              <span class="text-sm font-semibold text-slate-700">
                <span class="text-amber-500">★</span> {{ property.rating }}
                <span class="font-normal text-slate-500">({{ property.reviewsCount }} {{ t('reviews') }})</span>
              </span>
            </div>
            <h1 class="font-display mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">{{ property.title }}</h1>
            <p class="mt-2 text-sm text-slate-500">{{ property.neighborhood }}, {{ property.city }}</p>
            <p class="mt-5 max-w-3xl text-base leading-7 text-slate-600">
              {{ language === 'my' ? property.descriptionMy : property.description }}
            </p>
          </section>

          <section class="grid grid-cols-2 gap-3 border-y border-slate-200 py-5 sm:grid-cols-4">
            <div class="rounded-xl bg-white p-4">
              <p class="text-xs text-slate-500">{{ t('bedrooms') }}</p>
              <p class="font-display mt-1 font-bold text-slate-900">{{ property.bedrooms }}</p>
            </div>
            <div class="rounded-xl bg-white p-4">
              <p class="text-xs text-slate-500">{{ t('bathrooms') }}</p>
              <p class="font-display mt-1 font-bold text-slate-900">{{ property.bathrooms }}</p>
            </div>
            <div class="rounded-xl bg-white p-4">
              <p class="text-xs text-slate-500">{{ t('floorArea') }}</p>
              <p class="font-display mt-1 font-bold text-slate-900">{{ property.sqft.toLocaleString() }} sqft</p>
            </div>
            <div class="rounded-xl bg-white p-4">
              <p class="text-xs text-slate-500">{{ t('furnishing') }}</p>
              <p class="font-display mt-1 font-bold text-slate-900">
                {{ property.furnished ? t('furnishedDescription') : t('unfurnishedDescription') }}
              </p>
            </div>
          </section>

          <section>
            <h2 class="font-display text-xl font-bold text-slate-900">{{ t('whatHomeOffers') }}</h2>
            <ul class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <li
                v-for="(amenity, index) in property.amenities"
                :key="amenity"
                class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
              >
                <span class="font-bold text-emerald-700" aria-hidden="true">✓</span>
                {{ language === 'my' ? property.amenitiesMy[index] : amenity }}
              </li>
            </ul>
          </section>
        </div>

        <aside>
          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <p class="text-sm text-slate-500">{{ t('monthlyRent') }}</p>
            <p class="font-display mt-1 text-3xl font-extrabold text-slate-900">
              {{ property.currency === 'MMK' ? 'MMK' : '$' }}{{ property.monthlyPrice.toLocaleString() }}
              <span class="text-sm font-medium text-slate-500">{{ t('perMonth') }}</span>
            </p>
            <p v-if="property.nightlyPrice > 0" class="mt-1 text-sm text-slate-500">{{ t('shortStaysFrom') }} {{ property.currency === 'MMK' ? 'MMK' : '$' }}{{ property.nightlyPrice }}{{ t('perNight') }}</p>

            <div class="my-5 space-y-3 border-y border-slate-100 py-4 text-sm">
              <div class="flex justify-between gap-4">
                <span class="text-slate-500">{{ t('propertyTypeLabel') }}</span>
                <span class="font-medium text-slate-800">{{ displayCategory(property.category) }}</span>
              </div>
              <div class="flex justify-between gap-4">
                <span class="text-slate-500">{{ t('propertyLocation') }}</span>
                <span class="text-right font-medium text-slate-800">{{ property.city }}</span>
              </div>
              <div class="flex justify-between gap-4">
                <span class="text-slate-500">{{ t('rentalOption') }}</span>
                <span class="font-medium text-slate-800">{{ property.leaseType === 'monthly' ? t('monthly') : t('shortStay') }}</span>
              </div>
            </div>

            <div class="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-950">
              <p class="font-semibold">{{ property.ownerName || 'Contact the landlord directly' }}</p>
              <p class="mt-1 text-xs leading-5">No agent or rental commission. Contact the owner to check availability and arrange a viewing.</p>
              <a v-if="property.ownerEmail" :href="`mailto:${property.ownerEmail}?subject=${encodeURIComponent(`Rental enquiry: ${property.title}`)}`" class="mt-3 block font-semibold text-emerald-800 underline">{{ property.ownerEmail }}</a>
              <a v-if="property.ownerPhone" :href="`tel:${property.ownerPhone}`" class="mt-2 block font-semibold text-emerald-800 underline">{{ property.ownerPhone }}</a>
              <p v-if="!property.ownerEmail && !property.ownerPhone" class="mt-2 text-xs">Contact information has not been added to this sample listing.</p>
            </div>
            <RouterLink
              to="/explore"
              class="mt-4 flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              {{ t('browseMoreHomes') }}
            </RouterLink>
          </div>
        </aside>
      </div>
    </section>

    <section v-else class="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl text-amber-800">!</div>
      <h1 class="font-display mt-5 text-2xl font-bold text-slate-900">{{ t('homeNotFound') }}</h1>
      <p class="mt-2 text-sm text-slate-600">{{ t('listingNotFoundDescription') }}</p>
      <RouterLink
        to="/explore"
        class="mt-6 inline-flex rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        {{ t('browseAvailableHomes') }}
      </RouterLink>
    </section>
  </main>
</template>
