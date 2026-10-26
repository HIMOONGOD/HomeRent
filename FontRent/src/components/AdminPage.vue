<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { properties, removeProperty } from '../data/properties'
import { usePointsBalance } from '../composables/usePointsBalance'

type SectionId = 'overview' | 'listings' | 'owners' | 'payments' | 'reports' | 'settings'
type ListingFilter = 'all' | 'owner' | 'sample'

const { pointsBalance } = usePointsBalance()
const activeSection = ref<SectionId>('overview')
const search = ref('')
const filter = ref<ListingFilter>('all')
const notice = ref('')

const navigation: { id: SectionId; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: '⌂' },
  { id: 'listings', label: 'Listings', icon: '▤' },
  { id: 'owners', label: 'Owners', icon: '♙' },
  { id: 'payments', label: 'Payments', icon: '＄' },
  { id: 'reports', label: 'Reports', icon: '▥' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
]

const ownerListings = computed(() => properties.filter((property) => property.isOwnerListing))
const cityCount = computed(() => new Set(properties.map((property) => property.city)).size)
const ownerContacts = computed(() => {
  const contacts = new Map<string, { name: string; email: string; phone: string; listings: number }>()
  for (const property of ownerListings.value) {
    const email = property.ownerEmail || 'No email provided'
    const previous = contacts.get(email)
    contacts.set(email, {
      name: property.ownerName || 'Owner',
      email,
      phone: property.ownerPhone || '',
      listings: (previous?.listings || 0) + 1,
    })
  }
  return [...contacts.values()]
})
const cityReport = computed(() => {
  const counts = new Map<string, number>()
  for (const property of properties) counts.set(property.city, (counts.get(property.city) || 0) + 1)
  return [...counts.entries()].map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count)
})
const categoryReport = computed(() => {
  const counts = new Map<string, number>()
  for (const property of properties) counts.set(property.category, (counts.get(property.category) || 0) + 1)
  return [...counts.entries()].map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count)
})
const maxCityCount = computed(() => Math.max(1, ...cityReport.value.map((row) => row.count)))
const maxCategoryCount = computed(() => Math.max(1, ...categoryReport.value.map((row) => row.count)))

const filteredListings = computed(() => {
  const query = search.value.trim().toLowerCase()
  return properties.filter((property) => {
    const matchesFilter = filter.value === 'all' ||
      (filter.value === 'owner' && property.isOwnerListing) ||
      (filter.value === 'sample' && !property.isOwnerListing)
    const matchesSearch = !query ||
      [property.title, property.city, property.neighborhood, property.ownerName, property.ownerEmail]
        .some((value) => value?.toLowerCase().includes(query))
    return matchesFilter && matchesSearch
  })
})
const latestListings = computed(() => ownerListings.value.slice(0, 5))
const pageTitle = computed(() => navigation.find((item) => item.id === activeSection.value)?.label || 'Overview')

function removeListing(id: number, title: string) {
  try {
    if (removeProperty(id)) notice.value = `“${title}” was removed from the directory.`
  } catch {
    notice.value = 'Could not save this moderation change in browser storage.'
  }
  window.setTimeout(() => { notice.value = '' }, 3500)
}

function exportListings() {
  const escapeCsv = (value: string | number | undefined) => `"${String(value ?? '').replaceAll('"', '""')}"`
  const rows = [
    ['Title', 'Type', 'City', 'Neighborhood', 'Monthly rent', 'Currency', 'Owner', 'Email', 'Phone', 'Source'],
    ...filteredListings.value.map((property) => [
      property.title, property.category, property.city, property.neighborhood,
      property.monthlyPrice, property.currency || 'USD', property.ownerName || '', property.ownerEmail || '', property.ownerPhone || '',
      property.isOwnerListing ? 'Owner post' : 'Sample listing',
    ]),
  ]
  const csv = rows.map((row) => row.map(escapeCsv).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'fontrent-listings-report.csv'
  link.click()
  URL.revokeObjectURL(url)
  notice.value = 'Listings report downloaded.'
  window.setTimeout(() => { notice.value = '' }, 3500)
}
</script>

<template>
  <main class="min-h-[calc(100vh-4rem)] bg-[#f4f6f8] text-slate-800">
    <div class="mx-auto max-w-[1500px] lg:flex">
      <aside class="border-b border-slate-200 bg-white p-4 lg:min-h-[calc(100vh-4rem)] lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:p-5">
        <RouterLink to="/" class="flex items-center gap-3 px-2 py-2">
          <span class="grid h-10 w-10 place-items-center rounded-xl bg-emerald-700 text-xl text-white">⌂</span>
          <span><span class="font-display block font-bold text-slate-900">NestFlow</span><span class="block text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">Admin console</span></span>
        </RouterLink>
        <p class="mb-2 mt-8 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">Workspace</p>
        <nav aria-label="Admin navigation" class="flex gap-1 overflow-x-auto lg:flex-col">
          <button v-for="item in navigation" :key="item.id" type="button" class="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition lg:w-full" :class="activeSection === item.id ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'" :aria-current="activeSection === item.id ? 'page' : undefined" @click="activeSection = item.id"><span class="w-5 text-center text-base" aria-hidden="true">{{ item.icon }}</span>{{ item.label }}<span v-if="item.id === 'listings'" class="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px]">{{ properties.length }}</span></button>
        </nav>
        <div class="mt-8 hidden rounded-2xl bg-slate-50 p-4 lg:block"><p class="text-xs font-semibold text-slate-700">Admin access</p><p class="mt-1 text-xs leading-5 text-slate-500">Prototype mode · this page is not protected by sign-in.</p></div>
        <RouterLink to="/explore" class="mt-5 hidden items-center gap-2 px-3 text-xs font-semibold text-emerald-700 hover:underline lg:flex">← Open renter site</RouterLink>
      </aside>

      <div class="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header class="flex flex-wrap items-center justify-between gap-4">
          <div><p class="text-xs font-semibold text-slate-400">ADMINISTRATION / {{ pageTitle.toUpperCase() }}</p><h1 class="font-display mt-1 text-2xl font-bold text-slate-900">{{ pageTitle }}</h1></div>
          <div class="flex items-center gap-2"><span class="hidden rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 sm:inline-flex">Browser prototype</span><RouterLink to="/" aria-label="Go to renter site" class="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white">A</RouterLink></div>
        </header>

        <div class="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950"><span class="font-bold">!</span><p><strong>Local admin mode.</strong> This dashboard reads browser-stored listings. It has no secure admin login, shared database, or live payment processor.</p></div>

        <template v-if="activeSection === 'overview'">
          <section aria-label="Platform summary" class="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <article class="rounded-2xl border border-slate-200 bg-white p-5"><div class="flex items-center justify-between"><p class="text-xs font-medium text-slate-500">Directory listings</p><span class="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-700">▤</span></div><p class="font-display mt-3 text-3xl font-bold text-slate-900">{{ properties.length }}</p><p class="mt-1 text-xs text-slate-500">{{ ownerListings.length }} owner posted · {{ properties.length - ownerListings.length }} samples</p></article>
            <article class="rounded-2xl border border-slate-200 bg-white p-5"><div class="flex items-center justify-between"><p class="text-xs font-medium text-slate-500">Owner contacts</p><span class="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-700">♙</span></div><p class="font-display mt-3 text-3xl font-bold text-slate-900">{{ ownerContacts.length }}</p><p class="mt-1 text-xs text-slate-500">Derived from posted listings</p></article>
            <article class="rounded-2xl border border-slate-200 bg-white p-5"><div class="flex items-center justify-between"><p class="text-xs font-medium text-slate-500">Locations covered</p><span class="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-700">⌖</span></div><p class="font-display mt-3 text-3xl font-bold text-slate-900">{{ cityCount }}</p><p class="mt-1 text-xs text-slate-500">Across current directory data</p></article>
            <article class="rounded-2xl border border-slate-200 bg-white p-5"><div class="flex items-center justify-between"><p class="text-xs font-medium text-slate-500">Rental commission</p><span class="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700">✓</span></div><p class="font-display mt-3 text-3xl font-bold text-emerald-700">0%</p><p class="mt-1 text-xs text-slate-500">No commission charged by the prototype</p></article>
          </section>

          <section class="mt-5 grid gap-5 xl:grid-cols-[1.3fr_1fr]">
            <article class="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div class="flex items-start justify-between"><div><h2 class="font-display font-bold text-slate-900">Listings by location</h2><p class="mt-1 text-xs text-slate-500">Current directory distribution</p></div><button type="button" class="text-xs font-semibold text-emerald-700 hover:underline" @click="activeSection = 'reports'">View reports →</button></div>
              <div v-if="cityReport.length" class="mt-6 space-y-4"><div v-for="row in cityReport.slice(0, 6)" :key="row.city" class="grid grid-cols-[minmax(70px,.7fr)_2fr_2rem] items-center gap-3"><span class="truncate text-xs font-medium text-slate-600">{{ row.city }}</span><div class="h-2 overflow-hidden rounded-full bg-slate-100"><div class="h-full rounded-full bg-emerald-600" :style="{ width: `${row.count / maxCityCount * 100}%` }"></div></div><span class="text-right text-xs font-semibold text-slate-700">{{ row.count }}</span></div></div>
              <p v-else class="mt-6 text-sm text-slate-500">There are no listings to summarize yet.</p>
            </article>
            <article class="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div class="flex items-start justify-between"><div><h2 class="font-display font-bold text-slate-900">Platform services</h2><p class="mt-1 text-xs text-slate-500">Current prototype capabilities</p></div><span class="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase text-amber-800">Local</span></div><div class="mt-5 divide-y divide-slate-100"><div class="flex items-center justify-between py-3 text-sm"><span class="text-slate-600">Listing directory</span><span class="font-semibold text-emerald-700">Available locally</span></div><div class="flex items-center justify-between py-3 text-sm"><span class="text-slate-600">Owner contact links</span><span class="font-semibold text-emerald-700">Available</span></div><div class="flex items-center justify-between py-3 text-sm"><span class="text-slate-600">Account service</span><span class="font-semibold text-amber-700">Not connected</span></div><div class="flex items-center justify-between py-3 text-sm"><span class="text-slate-600">Cash payments</span><span class="font-semibold text-amber-700">Not connected</span></div></div></article>
          </section>

          <section class="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 class="font-display font-bold text-slate-900">Recently posted listings</h2><p class="mt-1 text-xs text-slate-500">Owner-submitted properties in this browser</p></div><button type="button" class="text-xs font-semibold text-emerald-700 hover:underline" @click="activeSection = 'listings'; filter = 'owner'">Manage listings →</button></div>
            <div v-if="latestListings.length" class="divide-y divide-slate-100"><article v-for="property in latestListings" :key="property.id" class="flex items-center gap-3 px-5 py-3"><img :src="property.image" :alt="property.title" class="h-12 w-16 rounded-lg object-cover"><div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-slate-900">{{ property.title }}</p><p class="mt-0.5 truncate text-xs text-slate-500">{{ property.city }} · {{ property.ownerName }} · {{ property.ownerEmail }}</p></div><span class="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-800">Listed</span></article></div>
            <p v-else class="px-5 py-8 text-sm text-slate-500">No owner-submitted listings yet.</p>
          </section>
        </template>

        <template v-else-if="activeSection === 'listings'">
          <section class="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div class="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 xl:flex-row xl:items-center xl:justify-between"><div><h2 class="font-display font-bold text-slate-900">Listing management</h2><p class="mt-1 text-xs text-slate-500">Search, review, export, or remove listings from this browser.</p></div><div class="flex flex-col gap-2 sm:flex-row"><input v-model="search" type="search" aria-label="Search listings" placeholder="Search title, city, owner…" class="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"><select v-model="filter" aria-label="Filter listing source" class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"><option value="all">All listings</option><option value="owner">Owner posted</option><option value="sample">Sample listings</option></select><button type="button" class="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700" @click="exportListings">Export CSV</button></div></div>
            <div class="hidden grid-cols-[minmax(0,2fr)_1fr_1fr_1fr_auto] gap-4 bg-slate-50 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 md:grid"><span>Property</span><span>Owner</span><span>Rent</span><span>Source</span><span>Actions</span></div>
            <div v-if="filteredListings.length" class="divide-y divide-slate-100"><article v-for="property in filteredListings" :key="property.id" class="grid gap-3 px-5 py-4 md:grid-cols-[minmax(0,2fr)_1fr_1fr_1fr_auto] md:items-center md:gap-4"><div class="flex min-w-0 items-center gap-3"><img :src="property.image" :alt="property.title" class="h-14 w-16 shrink-0 rounded-lg object-cover"><div class="min-w-0"><p class="truncate text-sm font-semibold text-slate-900">{{ property.title }}</p><p class="mt-1 truncate text-xs text-slate-500">{{ property.neighborhood }}, {{ property.city }} · {{ property.category }}</p></div></div><div class="truncate text-xs text-slate-600">{{ property.ownerName || property.ownerEmail || 'Sample data' }}<span v-if="property.ownerEmail && property.ownerName" class="block truncate text-slate-400">{{ property.ownerEmail }}</span></div><p class="text-sm font-semibold text-slate-800">{{ property.currency === 'MMK' ? 'MMK' : '$' }}{{ property.monthlyPrice.toLocaleString() }}<span class="text-xs font-normal text-slate-400">/mo</span></p><span class="w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold" :class="property.isOwnerListing ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'">{{ property.isOwnerListing ? 'Owner post' : 'Sample' }}</span><div class="flex items-center gap-2"><RouterLink :to="`/properties/${property.id}`" class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">View</RouterLink><button type="button" class="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50" @click="removeListing(property.id, property.title)">Remove</button></div></article></div>
            <p v-else class="px-5 py-12 text-center text-sm text-slate-500">No listings match the current filters.</p>
          </section>
        </template>

        <template v-else-if="activeSection === 'owners'">
          <section class="mt-6 rounded-2xl border border-slate-200 bg-white"><div class="border-b border-slate-100 px-5 py-5"><h2 class="font-display font-bold text-slate-900">Owner directory</h2><p class="mt-1 text-xs text-slate-500">Contact records submitted with owner listings. These are not verified platform accounts.</p></div><div v-if="ownerContacts.length" class="divide-y divide-slate-100"><article v-for="owner in ownerContacts" :key="owner.email" class="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center"><span class="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 font-bold text-emerald-800">{{ owner.name.slice(0, 1).toUpperCase() }}</span><div class="min-w-0 flex-1"><p class="text-sm font-semibold text-slate-900">{{ owner.name }}</p><p class="mt-1 break-all text-xs text-slate-500">{{ owner.email }}<span v-if="owner.phone"> · {{ owner.phone }}</span></p></div><span class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">{{ owner.listings }} listing{{ owner.listings === 1 ? '' : 's' }}</span><button type="button" class="text-xs font-semibold text-emerald-700 hover:underline" @click="activeSection = 'listings'; search = owner.email; filter = 'owner'">View listings →</button></article></div><p v-else class="px-5 py-12 text-center text-sm text-slate-500">No owners have submitted listings in this browser yet.</p></section>
          <p class="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900">Account suspension, identity verification, and role management require real user accounts and server-side access controls, which this project does not have yet.</p>
        </template>

        <template v-else-if="activeSection === 'payments'">
          <section class="mt-6 grid gap-4 md:grid-cols-3"><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="text-xs font-medium text-slate-500">Owner posting credits</p><p class="font-display mt-2 text-3xl font-bold text-slate-900">{{ pointsBalance }}</p><p class="mt-1 text-xs text-slate-500">Demo balance in this browser</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="text-xs font-medium text-slate-500">Cash payments</p><p class="font-display mt-2 text-3xl font-bold text-amber-700">Not connected</p><p class="mt-1 text-xs text-slate-500">No payment processor or ledger</p></article><article class="rounded-2xl border border-slate-200 bg-white p-5"><p class="text-xs font-medium text-slate-500">Rental commissions</p><p class="font-display mt-2 text-3xl font-bold text-emerald-700">0%</p><p class="mt-1 text-xs text-slate-500">The platform adds no commission</p></article></section>
          <section class="mt-5 rounded-2xl border border-slate-200 bg-white p-6"><h2 class="font-display font-bold text-slate-900">Payment activity</h2><div class="mt-5 rounded-xl bg-slate-50 px-5 py-10 text-center"><span class="text-2xl text-slate-400">＄</span><p class="mt-3 text-sm font-semibold text-slate-700">No cash transactions recorded</p><p class="mx-auto mt-1 max-w-lg text-xs leading-5 text-slate-500">Listing credits are a local demo balance. Connect a payment provider and server-side ledger before collecting or reporting money.</p></div></section>
        </template>

        <template v-else-if="activeSection === 'reports'">
          <div class="mt-6 flex flex-wrap items-center justify-between gap-3"><p class="text-sm text-slate-500">Reports are calculated from the listings currently available in this browser.</p><button type="button" class="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-700" @click="exportListings">Download listings CSV</button></div>
          <section class="mt-4 grid gap-5 xl:grid-cols-2"><article class="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h2 class="font-display font-bold text-slate-900">Listings by city</h2><p class="mt-1 text-xs text-slate-500">{{ properties.length }} total directory entries</p><div class="mt-6 space-y-4"><div v-for="row in cityReport" :key="row.city" class="grid grid-cols-[minmax(80px,1fr)_2fr_2rem] items-center gap-3"><span class="truncate text-xs text-slate-600">{{ row.city }}</span><div class="h-2 overflow-hidden rounded-full bg-slate-100"><div class="h-full rounded-full bg-emerald-600" :style="{ width: `${row.count / maxCityCount * 100}%` }"></div></div><span class="text-right text-xs font-semibold">{{ row.count }}</span></div><p v-if="!cityReport.length" class="text-sm text-slate-500">No listing data yet.</p></div></article><article class="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h2 class="font-display font-bold text-slate-900">Listings by property type</h2><p class="mt-1 text-xs text-slate-500">Current category mix</p><div class="mt-6 space-y-4"><div v-for="row in categoryReport" :key="row.category" class="grid grid-cols-[minmax(90px,1fr)_2fr_2rem] items-center gap-3"><span class="truncate text-xs text-slate-600">{{ row.category }}</span><div class="h-2 overflow-hidden rounded-full bg-slate-100"><div class="h-full rounded-full bg-indigo-500" :style="{ width: `${row.count / maxCategoryCount * 100}%` }"></div></div><span class="text-right text-xs font-semibold">{{ row.count }}</span></div><p v-if="!categoryReport.length" class="text-sm text-slate-500">No listing data yet.</p></div></article></section>
          <p class="mt-4 text-xs leading-5 text-slate-500">Traffic, search conversion, occupancy, rent collection, and renter demand analytics are unavailable because the app has no event tracking or transaction database.</p>
        </template>

        <template v-else>
          <section class="mt-6 space-y-5">
            <article class="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h2 class="font-display font-bold text-slate-900">Rental marketplace rules</h2><p class="mt-1 text-xs text-slate-500">Current behavior in the frontend prototype</p><dl class="mt-5 divide-y divide-slate-100"><div class="flex flex-wrap items-center justify-between gap-3 py-3"><dt class="text-sm text-slate-600">Rental commission</dt><dd class="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-800">0%</dd></div><div class="flex flex-wrap items-center justify-between gap-3 py-3"><dt class="text-sm text-slate-600">Posting duration charge</dt><dd class="text-sm font-semibold text-slate-800">1 demo credit per month</dd></div><div class="flex flex-wrap items-center justify-between gap-3 py-3"><dt class="text-sm text-slate-600">Currency conversion / cash amount</dt><dd class="text-sm font-semibold text-amber-700">Not configured</dd></div></dl></article>
            <article class="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h2 class="font-display font-bold text-slate-900">Application readiness</h2><div class="mt-4 grid gap-3 sm:grid-cols-2"><div class="rounded-xl border border-emerald-100 bg-emerald-50 p-4"><p class="text-xs font-semibold text-emerald-900">Working in this browser</p><p class="mt-1 text-xs leading-5 text-emerald-800">Renter search, listing submission, direct owner contact links, listing moderation.</p></div><div class="rounded-xl border border-amber-100 bg-amber-50 p-4"><p class="text-xs font-semibold text-amber-900">Needs backend setup</p><p class="mt-1 text-xs leading-5 text-amber-800">Admin roles, shared listings, account management, real payment processing, and audit records.</p></div></div></article>
          </section>
        </template>

        <footer class="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 py-5 text-[11px] text-slate-400"><span>NestFlow Admin · Local prototype</span><span>Rental commission: 0%</span><RouterLink to="/explore" class="font-semibold text-emerald-700 hover:underline">Open renter site</RouterLink></footer>
      </div>
    </div>
    <div v-if="notice" role="status" class="fixed bottom-5 right-5 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg">{{ notice }}</div>
  </main>
</template>
