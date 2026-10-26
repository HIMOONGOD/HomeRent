<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { properties } from '../data/properties'
import { usePointsBalance } from '../composables/usePointsBalance'

const { pointsBalance } = usePointsBalance()
const ownerProperties = computed(() => properties.filter((property) => property.isOwnerListing))
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-sm font-semibold text-emerald-700">LANDLORD WORKSPACE</p>
        <h1 class="font-display mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">Your rental listings</h1>
        <p class="mt-1 text-sm text-slate-500">Post directly for renters to find and contact you. No rental commission.</p>
      </div>
      <div class="flex items-center gap-3">
        <RouterLink to="/add-property" class="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800">＋ Post a rental</RouterLink>
        <span :aria-label="`${pointsBalance} posting credits remaining`" :title="`${pointsBalance} posting credits remaining`" class="inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 text-sm font-bold text-amber-800">✦ {{ pointsBalance }}</span>
      </div>
    </header>

    <section class="mt-7 grid gap-4 sm:grid-cols-2">
      <article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="text-sm text-slate-500">Your posted rentals</p><p class="font-display mt-2 text-3xl font-bold text-slate-900">{{ ownerProperties.length }}</p></article>
      <article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="text-sm text-slate-500">Posting credits available</p><p class="font-display mt-2 text-3xl font-bold text-slate-900">{{ pointsBalance }}</p><p class="mt-1 text-xs text-slate-500">1 credit per month of listing duration</p></article>
    </section>

    <section class="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 class="font-display font-bold text-slate-900">Your listings</h2><p class="mt-1 text-xs text-slate-500">Renter enquiries go directly to the contact details on each listing.</p></div></div>
      <div v-if="ownerProperties.length" class="divide-y divide-slate-100">
        <article v-for="property in ownerProperties" :key="property.id" class="flex items-center gap-4 px-5 py-4">
          <img :src="property.image" :alt="property.title" class="h-16 w-20 shrink-0 rounded-xl object-cover" />
          <div class="min-w-0 flex-1"><RouterLink :to="`/properties/${property.id}`" class="truncate text-sm font-semibold text-slate-900 hover:text-emerald-700">{{ property.title }}</RouterLink><p class="mt-1 truncate text-xs text-slate-500">{{ property.neighborhood }}, {{ property.city }}</p><p class="mt-1 truncate text-xs text-slate-500">{{ property.ownerEmail }}<span v-if="property.ownerPhone"> · {{ property.ownerPhone }}</span></p></div>
          <div class="shrink-0 text-right"><p class="text-sm font-semibold text-slate-900">MMK {{ property.monthlyPrice.toLocaleString() }}<span class="text-xs font-normal text-slate-500">/mo</span></p><p class="mt-1 text-xs text-slate-500">Expires {{ property.listingExpiresAt ? new Date(property.listingExpiresAt).toLocaleDateString() : '—' }}</p></div>
        </article>
      </div>
      <div v-else class="px-5 py-12 text-center"><h3 class="font-display font-semibold text-slate-900">No rentals posted yet</h3><p class="mt-1 text-sm text-slate-500">Create your first listing and let renters contact you directly.</p><RouterLink to="/add-property" class="mt-4 inline-flex rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">Post a rental</RouterLink></div>
    </section>

    <p class="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900">Prototype note: listings and posting credits are saved in this browser only. A server and payment provider are needed before renters on other devices can see listings or owners can make real payments.</p>
  </main>
</template>
