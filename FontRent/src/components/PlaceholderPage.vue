<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLanguage } from '../composables/useLanguage'

defineProps<{
  title: string
}>()

const route = useRoute()
const { t } = useLanguage()
const pageTitle = computed(() => {
  switch (route.name) {
    case 'tenant':
      return t('tenantPageTitle')
    case 'explore':
      return t('exploreHomes')
    case 'landlord':
      return t('landlordPageTitle')
    case 'saved':
      return t('savedPageTitle')
    case 'create':
      return t('createPageTitle')
    default:
      return t('home')
  }
})
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <h1 class="font-display text-2xl font-bold text-slate-900">{{ pageTitle }}</h1>
    <p class="mt-2 text-slate-600">{{ t('comingSoon') }}</p>
  </main>
</template>
